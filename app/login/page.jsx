'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка входа');
        setLoading(false);
        return;
      }

      localStorage.setItem('grupptrans_user', JSON.stringify(data.user));

      if (data.user.role === 'CARRIER') {
        router.push('/carrier-profile');
      } else {
        router.push('/dashboard');
      }
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
        <div className="mb-2 text-sm font-medium text-slate-500">Вход</div>
        <h1 className="text-3xl font-semibold text-slate-900">Войти в аккаунт</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Введи email и пароль, чтобы попасть в свой кабинет.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
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
              placeholder="Введите пароль"
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
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Нет аккаунта?{' '}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="font-medium text-slate-900 underline underline-offset-4"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </main>
  );
}
