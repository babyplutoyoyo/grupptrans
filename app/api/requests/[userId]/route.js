export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';

export async function GET(_, { params }) {
  try {
    const { userId } = await params;

    const requests = await prisma.request.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
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
      { error: 'Ошибка загрузки заявок' },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const { userId } = await params;
    const body = await req.json();

    const request = await prisma.request.create({
      data: {
        customerId: userId,
        fromCity: body.fromCity,
        toCity: body.toCity,
        routePoints: body.routePoints || [],
        returnToOrigin: body.returnToOrigin ?? true,
        passengers: Number(body.passengers),
        hasChildren: body.hasChildren === 'yes',
        tripDate: new Date(body.tripDate),
        busType: body.busType,
        paymentType: body.paymentType,
        comment: body.comment || null,
        distanceKm: body.distanceKm ? Number(body.distanceKm) : null,
        desiredPrice: body.desiredPrice ? Number(body.desiredPrice) : null,
      },
    });

    return Response.json({
      message: 'Заявка создана',
      request,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Ошибка создания заявки' },
      { status: 500 }
    );
  }
}
