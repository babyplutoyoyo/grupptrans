export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: 'Введите email и пароль' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return Response.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    return Response.json({
      message: 'Вход выполнен',
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
