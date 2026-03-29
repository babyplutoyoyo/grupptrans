export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return Response.json(
        { error: 'Не все поля заполнены' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    if (role === 'CARRIER') {
      await prisma.carrierProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    return Response.json({
      message: 'Регистрация успешна',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
