'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CarrierRequestsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [price, setPrice] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) || null;

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

      loadRequests();
    } catch {
      setError('Ошибка чтения пользователя из localStorage.');
      setLoading(false);
    }
  }, []);

  async function loadRequests() {
    try {
      const res = await fetch('/api/carrier-requests', {
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка загрузки заявок');
        setLoading(false);
        return;
      }

      setRequests(data.requests || []);
      setSelectedRequestId(data.requests?.[0]?.id || null);
      setLoading(false);
    } catch {
      setError('Ошибка сети при загрузке заявок');
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('grupptrans_user');
    window.location.href = '/login';
  }

  async function handleSendOffer(e) {
    e.preventDefault();

    if (!currentUser?.id) {
      setError('Нет userId. Снова войди в аккаунт.');
      return;
    }

    if (!selectedRequestId) {
      setError('Выбери заявку.');
      return;
    }

    if (!price.trim()) {
      setError('Укажи цену.');
      return;
    }

    setSending(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/carrier-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequestId,
          carrierId: currentUser.id,
          price,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка отправки отклика');
        setSending(false);
        return;
      }

      setMessage('Отклик отправлен');
      setPrice('');
      setComment('');
      await loadRequests();
    } catch {
      setError('Ошибка сети при отправке отклика');
    }

    setSending(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Загрузка заявок...</h1>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-800">Доступ ограничен</div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Это раздел перевозчика</h1>
              <p className="mt-4 text-slate-700">Ты вошел как заказчик. Перейди в свой кабинет.</p>
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
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-8 py-8">
            <div>
              <div className="text-sm font-semibold text-slate-800">Раздел перевозчика</div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Доступные заявки</h1>
              <p className="mt-3 text-slate-700">
                Выбирай заявку, указывай свою цену и отправляй отклик заказчику.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/carrier-profile"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Мой профиль
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Выйти
              </button>
            </div>
          </div>

          <div className="grid gap-6 p-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="text-sm font-semibold text-slate-800">Заявки</div>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">Список маршрутов</h2>
              </div>

              <div className="p-6">
                {!requests.length ? (
                  <p className="text-slate-700">Пока заявок нет.</p>
                ) : (
                  <div className="grid gap-4">
                    {requests.map((request) => (
                      <button
                        key={request.id}
                        onClick={() => setSelectedRequestId(request.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          selectedRequestId === request.id
                            ? 'border-slate-900 bg-slate-100'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-base font-semibold text-slate-900">
                          {request.fromCity} → {request.toCity}
                        </div>
                        <div className="mt-2 text-sm text-slate-700">
                          Пассажиры: {request.passengers}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">
                          Дата: {new Date(request.tripDate).toLocaleDateString()}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">
                          Оплата: {request.paymentType}
			</div>
			<div className="mt-1 text-sm text-slate-700">
  			  Желаемая цена: {request.desiredPrice ? `${request.desiredPrice} ₽` : 'Не указана'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="text-sm font-semibold text-slate-800">Отклик</div>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">Детали заявки</h2>
              </div>

              <div className="p-6">
                {!selectedRequest ? (
                  <p className="text-slate-700">Выбери заявку, чтобы посмотреть детали и откликнуться.</p>
                ) : (
                  <div className="grid gap-5">
                    <InfoRow label="Маршрут" value={`${selectedRequest.fromCity} → ${selectedRequest.toCity}`} />
                    <InfoRow label="Пассажиры" value={String(selectedRequest.passengers)} />
                    <InfoRow label="Дата" value={new Date(selectedRequest.tripDate).toLocaleDateString()} />
                    <InfoRow label="Тип автобуса" value={selectedRequest.busType} />
                    <InfoRow label="Оплата" value={selectedRequest.paymentType} />
                    <InfoRow
  		      label="Желаемая цена"
  		      value={
    			selectedRequest.desiredPrice
      			? `${selectedRequest.desiredPrice} ₽`
      			: 'Не указана'
  		      }
		    />
		    <InfoRow label="Комментарий" value={selectedRequest.comment || 'Нет'} />
                    <InfoRow
                      label="Возврат в город отправления"
                      value={selectedRequest.returnToOrigin ? 'Да' : 'Нет'}
                    />

                    <form onSubmit={handleSendOffer} className="mt-4 grid gap-5">
                      <Field
                        label="Твоя цена, ₽"
                        value={price}
                        onChange={setPrice}
                        placeholder="Например, 18500"
                      />

                      <Field
                        label="Комментарий к отклику"
                        value={comment}
                        onChange={setComment}
                        placeholder="Например, подадим автобус за 15 минут до выезда"
                      />

                      {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      {message && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                          {message}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={sending}
                        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                      >
                        {sending ? 'Отправка...' : 'Откликнуться'}
                      </button>
                    </form>

                    <div className="mt-4">
                      <div className="mb-3 text-sm font-semibold text-slate-800">Уже отправленные отклики</div>
                      {!selectedRequest.offers?.length ? (
                        <p className="text-slate-700">По этой заявке пока нет откликов.</p>
                      ) : (
                        <div className="grid gap-4">
                          {selectedRequest.offers.map((offer) => (
                            <div
                              key={offer.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <div className="text-base font-semibold text-slate-900">
                                {offer.carrier?.carrierProfile?.companyType || 'Перевозчик'}{' '}
                                {offer.carrier?.carrierProfile?.companyName || offer.carrier?.name || ''}
                              </div>
                              <div className="mt-1 text-sm text-slate-700">
                                {offer.carrier?.carrierProfile?.busModel || 'Марка автобуса не указана'}
                              </div>
                              <div className="mt-3 text-lg font-semibold text-slate-900">
                                {offer.price} ₽
                              </div>
                              <p className="mt-3 text-sm leading-6 text-slate-700">
                                {offer.comment || 'Комментарий не указан'}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-slate-700">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}
