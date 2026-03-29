'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка регистрации');
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch (err) {
      setError('Ошибка сети');
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-2 text-sm font-medium text-slate-500">Регистрация</div>
        <h1 className="text-3xl font-semibold text-slate-900">Создать аккаунт</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Выбери роль и создай аккаунт в ГруппТранс.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2 text-sm font-medium">
            <span className="text-slate-900">Роль</span>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField('role', 'CUSTOMER')}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  form.role === 'CUSTOMER'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-semibold">Я заказчик</div>
                <div
                  className={`mt-1 text-xs ${
                    form.role === 'CUSTOMER' ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  Создаю заявки и выбираю перевозчика
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateField('role', 'CARRIER')}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  form.role === 'CARRIER'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-semibold">Я перевозчик</div>
                <div
                  className={`mt-1 text-xs ${
                    form.role === 'CARRIER' ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  Откликаюсь на заявки и веду профиль транспорта
                </div>
              </button>
            </div>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            <span className="text-slate-900">Имя</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
              placeholder="Ваше имя"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            <span className="text-slate-900">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
              placeholder="you@example.com"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            <span className="text-slate-900">Пароль</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
              placeholder="Минимум 6 символов"
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Создание...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </main>
  );
}
