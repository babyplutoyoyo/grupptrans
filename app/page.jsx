'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('grupptrans_user');

    if (!savedUser) return;

    try {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
    } catch {
      localStorage.removeItem('grupptrans_user');
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('grupptrans_user');
    setCurrentUser(null);
    window.location.href = '/';
  }

  const customerHref =
    currentUser?.role === 'CUSTOMER' ? '/dashboard' : '/login';

  const carrierHref =
    currentUser?.role === 'CARRIER' ? '/carrier-profile' : '/login';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-left">
            <div className="text-xl font-semibold">ГруппТранс</div>
            <div className="text-sm text-slate-600">
              Сервис подбора пассажирских перевозок
            </div>
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">
                  {currentUser.name}
                </div>
                <div className="text-xs font-medium text-slate-700">
                  {currentUser.role === 'CUSTOMER'
                    ? 'Заказчик'
                    : 'Перевозчик'}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Вход
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-sm md:p-12">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                Платформа пассажирских перевозок
              </div>

              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
                ГруппТранс помогает быстро найти перевозчика для экскурсии,
                трансфера или групповой поездки
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
                Заказчики создают заявку с маршрутом и деталями поездки, а
                перевозчики отправляют свои предложения. Платформа упрощает
                поиск, сравнение и выбор подходящего варианта в одном месте.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={customerHref}
                  className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-medium text-slate-900 transition hover:opacity-90"
                >
                  {currentUser?.role === 'CUSTOMER'
                    ? 'Перейти в кабинет заказчика'
                    : 'Я заказчик'}
                </Link>

                <Link
                  href={carrierHref}
                  className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-white/15"
                >
                  {currentUser?.role === 'CARRIER'
                    ? 'Перейти в кабинет перевозчика'
                    : 'Я перевозчик'}
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-sm font-medium text-white/70">
                  Как это работает
                </div>

                <div className="mt-4 grid gap-3 text-sm text-white/90">
                  <div className="rounded-2xl bg-white/10 p-4">
                    1. Заказчик заходит в кабинет и создает заявку
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    2. Перевозчики видят доступные маршруты
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    3. Перевозчик отправляет предложение с ценой
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    4. Заказчик сравнивает отклики и выбирает вариант
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-sm font-semibold text-slate-800">
              Для заказчика
            </div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">
              Создавай заявки и управляй поездками
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-700">
              В кабинете заказчика ты создаешь маршрут, указываешь параметры
              поездки, смотришь свои заявки и позже будешь сравнивать отклики с
              ценами.
            </p>
            <Link
              href={customerHref}
              className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              {currentUser?.role === 'CUSTOMER'
                ? 'Открыть кабинет заказчика'
                : 'Войти как заказчик'}
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-sm font-semibold text-slate-800">
              Для перевозчика
            </div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">
              Заполняй профиль и получай заказы
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-700">
              В кабинете перевозчика можно заполнить данные компании и
              транспорта. Следующим шагом добавим список заявок и отправку
              отклика с ценой.
            </p>
            <Link
              href={carrierHref}
              className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              {currentUser?.role === 'CARRIER'
                ? 'Открыть кабинет перевозчика'
                : 'Войти как перевозчик'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
