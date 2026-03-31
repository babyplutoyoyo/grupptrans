export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';

export async function GET(_, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return Response.json({ error: 'Не передан userId' }, { status: 400 });
    }

    let profile = await prisma.carrierProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.carrierProfile.create({
        data: { userId },
      });
    }

    return Response.json({ profile });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Ошибка загрузки профиля' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return Response.json({ error: 'Не передан userId' }, { status: 400 });
    }

    const body = await req.json();

    const updatedProfile = await prisma.carrierProfile.upsert({
      where: { userId },
      update: {
        companyType: body.companyType || null,
        companyName: body.companyName || null,
        busModel: body.busModel || null,
        seats: body.seats ? Number(body.seats) : null,
        hasAc: body.hasAc === 'yes',
        hasBelts: body.hasBelts === 'yes',
        hasLuggage: body.hasLuggage === 'yes',
        busYear: body.busYear ? Number(body.busYear) : null,
        paymentTypes: body.paymentTypes || null,
        comment: body.comment || null,
      },
      create: {
        userId,
        companyType: body.companyType || null,
        companyName: body.companyName || null,
        busModel: body.busModel || null,
        seats: body.seats ? Number(body.seats) : null,
        hasAc: body.hasAc === 'yes',
        hasBelts: body.hasBelts === 'yes',
        hasLuggage: body.hasLuggage === 'yes',
        busYear: body.busYear ? Number(body.busYear) : null,
        paymentTypes: body.paymentTypes || null,
        comment: body.comment || null,
      },
    });

    return Response.json({
      message: 'Профиль сохранен',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Ошибка сохранения профиля' }, { status: 500 });
  }
}
