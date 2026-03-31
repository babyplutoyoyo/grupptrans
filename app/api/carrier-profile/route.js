export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const requests = await prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        offers: {
          include: {
            carrier: {
              include: {
                carrierProfile: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return Response.json({ requests });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Ошибка загрузки заявок для перевозчика' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const { requestId, carrierId, price, comment } = body;

    if (!requestId || !carrierId || !price) {
      return Response.json(
        { error: 'Не хватает данных для отклика' },
        { status: 400 }
      );
    }

    const existingOffer = await prisma.offer.findFirst({
      where: {
        requestId,
        carrierId,
      },
    });

    if (existingOffer) {
      const updatedOffer = await prisma.offer.update({
        where: { id: existingOffer.id },
        data: {
          price: Number(price),
          comment: comment || null,
        },
      });

      return Response.json({
        message: 'Отклик обновлен',
        offer: updatedOffer,
      });
    }

    const offer = await prisma.offer.create({
      data: {
        requestId,
        carrierId,
        price: Number(price),
        comment: comment || null,
      },
    });

    return Response.json({
      message: 'Отклик отправлен',
      offer,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Ошибка отправки отклика' },
      { status: 500 }
    );
  }
}
