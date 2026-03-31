'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CarrierProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({
    companyType: 'ООО',
    companyName: '',
    busModel: '',
    seats: '',
    hasAc: 'yes',
    hasBelts: 'yes',
    hasLuggage: 'yes',
    busYear: '',
    paymentTypes: '',
    comment: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('grupptrans_user');

    if (!savedUser) {
      setError('Сначала войди в аккаунт перевозчика.');
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);

      if (parsedUser.role !== 'CARRIER') {
        setLoading(false);
        return;
      }

      if (!parsedUser?.id) {
        setError('В localStorage нет id пользователя. Снова войди в аккаунт.');
        setLoading(false);
        return;
      }

      fetchProfile(parsedUser.id);
    } catch {
      setError('Ошибка чтения пользователя из localStorage.');
      setLoading(false);
    }
  }, []);

  async function fetchProfile(userId) {
    try {
      const res = await fetch(`/api/carrier-profile/${userId}`, {
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка загрузки профиля');
        setLoading(false);
        return;
      }

      const profile = data.profile;

      setForm({
        companyType: profile.companyType || 'ООО',
        companyName: profile.companyName || '',
        busModel: profile.busModel || '',
        seats: profile.seats ? String(profile.seats) : '',
        hasAc: profile.hasAc ? 'yes' : 'no',
        hasBelts: profile.hasBelts ? 'yes' : 'no',
        hasLuggage: profile.hasLuggage ? 'yes' : 'no',
        busYear: profile.busYear ? String(profile.busYear) : '',
        paymentTypes: profile.paymentTypes || '',
        comment: profile.comment || '',
      });

      setLoading(false);
    } catch {
      setError('Ошибка сети при загрузке профиля');
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('grupptrans_user');
    window.location.href = '/login';
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!currentUser?.id) {
      setError('Нет userId. Снова войди в аккаунт.');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/carrier-profile/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка сохранения профиля');
        setSaving(false);
        return;
      }

      setMessage('Профиль сохранен');
    } catch {
      setError('Ошибка сети при сохранении');
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Загрузка профиля...</h1>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">Доступ ограничен</div>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Нужно войти</h1>
          <p className="mt-4 text-slate-700">Сначала войди в аккаунт перевозчика.</p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Перейти ко входу
          </Link>
        </div>
      </main>
    );
  }

  if (currentUser.role !== 'CARRIER') {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-800">Доступ ограничен</div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Это кабинет перевозчика</h1>
              <p className="mt-4 text-slate-700">
                Ты вошел как заказчик. Перейди в свой кабинет.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Выйти
            </button>
          </div>

          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Перейти в кабинет заказчика
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-800">Личный кабинет</div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Кабинет перевозчика
            </h1>
            <p className="mt-3 text-slate-700">
              Заполни данные компании и транспорта.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/carrier-requests"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Заявки
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              На главную
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Выйти
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
          <SelectField
            label="Тип организации"
            value={form.companyType}
            onChange={(value) => updateField('companyType', value)}
            options={['ООО', 'ИП']}
          />

          <Field
            label="Название ООО / ИП"
            value={form.companyName}
            onChange={(value) => updateField('companyName', value)}
            placeholder="Например, ООО «ГруппТранс Партнер»"
          />

          <Field
            label="Марка / модель автобуса"
            value={form.busModel}
            onChange={(value) => updateField('busModel', value)}
            placeholder="Например, Mercedes-Benz Sprinter"
          />

          <Field
            label="Кол-во мест"
            value={form.seats}
            onChange={(value) => updateField('seats', value)}
            placeholder="Например, 20"
          />

          <Field
            label="Год выпуска"
            value={form.busYear}
            onChange={(value) => updateField('busYear', value)}
            placeholder="Например, 2020"
          />

          <Field
            label="Способы оплаты"
            value={form.paymentTypes}
            onChange={(value) => updateField('paymentTypes', value)}
            placeholder="Наличные, безнал"
          />

          <SelectField
            label="Кондиционер"
            value={form.hasAc}
            onChange={(value) => updateField('hasAc', value)}
            options={['yes::Есть', 'no::Нет']}
          />

          <SelectField
            label="Ремни безопасности"
            value={form.hasBelts}
            onChange={(value) => updateField('hasBelts', value)}
            options={['yes::Есть', 'no::Нет']}
          />

          <SelectField
            label="Багажный отсек"
            value={form.hasLuggage}
            onChange={(value) => updateField('hasLuggage', value)}
            options={['yes::Есть', 'no::Нет']}
          />

          <Field
            label="Комментарий о транспорте"
            value={form.comment}
            onChange={(value) => updateField('comment', value)}
            placeholder="Например, мягкие кресла, USB-зарядка"
          />

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? 'Сохранение...' : 'Сохранить профиль'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span className="text-slate-900">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span className="text-slate-900">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
      >
        {options.map((option) => {
          const hasCustomValue = option.includes('::');
          const [optionValue, optionLabel] = hasCustomValue ? option.split('::') : [option, option];

          return (
            <option key={option} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}
