'use client';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-sm font-semibold text-slate-800">Личный кабинет</div>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Кабинет заказчика
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Вход работает. Дальше сюда перенесём реальные заявки пользователя.
        </p>
      </div>
    </main>
  );
}
