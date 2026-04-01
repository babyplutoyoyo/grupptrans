'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const RUSSIAN_CITIES = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Пермь', 'Воронеж', 'Волгоград', 'Краснодар', 'Саратов', 'Тюмень', 'Тольятти', 'Ижевск', 'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск', 'Ярославль', 'Владивосток', 'Махачкала', 'Томск', 'Оренбург', 'Кемерово', 'Новокузнецк', 'Рязань', 'Астрахань', 'Набережные Челны', 'Пенза', 'Липецк', 'Киров', 'Чебоксары', 'Тула', 'Калининград', 'Балашиха', 'Курск', 'Курчатов', 'Железногорск', 'Обнинск', 'Подольск', 'Люберцы', 'Химки', 'Мытищи', 'Королёв', 'Домодедово', 'Серпухов', 'Коломна', 'Орёл', 'Белгород', 'Старый Оскол', 'Брянск', 'Смоленск', 'Тверь', 'Иваново', 'Владимир', 'Кострома', 'Тамбов', 'Севастополь', 'Сочи', 'Ставрополь', 'Улан-Удэ', 'Магнитогорск', 'Сургут', 'Выборг'
];

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [customerPage, setCustomerPage] = useState('request');
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [waypoints, setWaypoints] = useState([]);
  const [touched, setTouched] = useState(false);

  const [form, setForm] = useState({
    fromCity: '',
    toCity: '',
    passengers: '',
    hasChildren: 'no',
    tripDate: '',
    busType: '',
    paymentType: '',
    comment: '',
    returnToOrigin: true,
    distanceKm: '',
    desiredPrice: '',
  });

  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) || null;

  useEffect(() => {
    const savedUser = localStorage.getItem('grupptrans_user');

    if (!savedUser) {
      setError('Сначала войди в аккаунт заказчика.');
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);

      if (parsedUser.role !== 'CUSTOMER') {
        setLoading(false);
        return;
      }

      if (!parsedUser?.id) {
        setError('В localStorage нет id пользователя. Снова войди в аккаунт.');
        setLoading(false);
        return;
      }

      loadRequests(parsedUser.id);
    } catch {
      setError('Ошибка чтения пользователя из localStorage.');
      setLoading(false);
    }
  }, []);

  async function loadRequests(userId) {
    try {
      const res = await fetch(`/api/requests/${userId}`, {
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

  function updateForm(field, value) {
    if (field === 'tripDate') {
      setForm((prev) => ({ ...prev, tripDate: formatDateInput(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addWaypoint() {
    setWaypoints((prev) => [...prev, '']);
  }

  function updateWaypoint(index, value) {
    setWaypoints((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  }

  function removeWaypoint(index) {
    setWaypoints((prev) => prev.filter((_, i) => i !== index));
  }

  function openRequestDetails(requestId) {
    setSelectedRequestId(requestId);
    setCustomerPage('request-details');
  }

  const cityErrors = useMemo(
    () => ({
      from:
        form.fromCity.trim() && !isKnownRussianCity(form.fromCity)
          ? 'Пока принимаем только города России'
          : '',
      to:
        form.toCity.trim() && !isKnownRussianCity(form.toCity)
          ? 'Пока принимаем только города России'
          : '',
      waypoints: waypoints.map((point) =>
        !point.trim()
          ? ''
          : isKnownRussianCity(point)
          ? ''
          : 'Укажи город России из списка'
      ),
    }),
    [form.fromCity, form.toCity, waypoints]
  );

  const dateError = useMemo(() => {
    if (!form.tripDate.trim()) return '';
    return isValidDisplayDate(form.tripDate)
      ? ''
      : 'Введи дату в формате дд.мм.гггг';
  }, [form.tripDate]);

  const requiredErrors = useMemo(
    () => ({
      fromCity: !form.fromCity.trim()
        ? 'Заполни поле «Откуда»'
        : cityErrors.from,
      toCity: !form.toCity.trim()
        ? 'Заполни поле «Куда»'
        : cityErrors.to,
      passengers: !form.passengers.trim()
        ? 'Заполни поле «Кол-во пассажиров»'
        : isPositiveInteger(form.passengers)
        ? ''
        : 'Укажи число больше 0',
      tripDate: !form.tripDate.trim()
        ? 'Заполни поле «Дата поездки»'
        : dateError,
      busType: !form.busType.trim() ? 'Выбери тип автобуса' : '',
      paymentType: !form.paymentType.trim() ? 'Выбери тип оплаты' : '',
      desiredPrice:
        form.desiredPrice.trim() && !isPositiveInteger(form.desiredPrice)
          ? 'Укажи число больше 0'
          : '',
    }),
    [form, cityErrors, dateError]
  );

  const hasErrors =
    Object.values(requiredErrors).some(Boolean) ||
    cityErrors.waypoints.some(Boolean);

  const routeDistanceLabel = useMemo(() => {
    if (form.distanceKm && String(form.distanceKm).trim()) {
      return `${form.distanceKm} км`;
    }
    return 'Укажи города маршрута';
  }, [form.distanceKm]);

  async function submitRequest(e) {
    e.preventDefault();
    setTouched(true);
    setError('');
    setMessage('');

    if (!currentUser?.id) {
      setError('Нет userId. Снова войди в аккаунт.');
      return;
    }

    if (hasErrors) return;

    setSaving(true);

    try {
      const isoTripDate = displayDateToIso(form.tripDate);

      const res = await fetch(`/api/requests/${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tripDate: isoTripDate,
          routePoints: waypoints.filter((x) => x.trim()),
          distanceKm: form.distanceKm ? Number(form.distanceKm) : null,
          desiredPrice: form.desiredPrice ? Number(form.desiredPrice) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка создания заявки');
        setSaving(false);
        return;
      }

      setMessage('Заявка создана');
      setForm({
        fromCity: '',
        toCity: '',
        passengers: '',
        hasChildren: 'no',
        tripDate: '',
        busType: '',
        paymentType: '',
        comment: '',
        returnToOrigin: true,
        distanceKm: '',
        desiredPrice: '',
      });
      setWaypoints([]);
      setTouched(false);
      await loadRequests(currentUser.id);
      setCustomerPage('dashboard');
    } catch {
      setError('Ошибка сети при создании заявки');
    }

    setSaving(false);
  }

  const customerNav = [
    { id: 'request', label: 'Создать заявку' },
    { id: 'dashboard', label: 'Мои заявки' },
  ];

  const cityOptions = useMemo(() => RUSSIAN_CITIES, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Загрузка кабинета...
          </h1>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">
            Доступ ограничен
          </div>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Нужно войти
          </h1>
          <p className="mt-4 text-slate-700">
            Сначала войди в аккаунт заказчика.
          </p>
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

  if (currentUser.role !== 'CUSTOMER') {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-800">
                Доступ ограничен
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Это кабинет заказчика
              </h1>
              <p className="mt-4 text-slate-700">
                Ты вошел как перевозчик. Перейди в свой кабинет.
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
            href="/carrier-profile"
            className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Перейти в кабинет перевозчика
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
              <div className="text-sm font-semibold text-slate-800">
                Личный кабинет
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Кабинет заказчика
              </h1>
              <p className="mt-3 text-slate-700">
                Создавай заявки, смотри свои заказы и отклики по ним.
              </p>
            </div>

            <div className="flex gap-3">
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

          <div className="border-b border-slate-200 px-8 py-4">
            <div className="flex flex-wrap gap-3">
              {customerNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCustomerPage(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    customerPage === item.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {customerPage === 'request' && (
              <div className="mx-auto max-w-6xl">
                <div className="bg-white">
                  <div className="mb-2 text-sm font-semibold text-slate-800">
                    Страница заказчика
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Создание заявки
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Сейчас форма работает по городам России. Позже можно
                    расширить до улиц и подключить карты Яндекса или 2ГИС.
                  </p>

                  <form onSubmit={submitRequest} className="mt-8 grid gap-6">
                    <div className="grid items-start gap-6 md:grid-cols-2">
                      <CityField
                        label="Откуда *"
                        value={form.fromCity}
                        onChange={(value) => updateForm('fromCity', value)}
                        options={cityOptions}
                        error={touched ? requiredErrors.fromCity : ''}
                      />
                      <CityField
                        label="Куда *"
                        value={form.toCity}
                        onChange={(value) => updateForm('toCity', value)}
                        options={cityOptions}
                        error={touched ? requiredErrors.toCity : ''}
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            Промежуточные точки
                          </div>
                          <div className="mt-1 text-xs text-slate-600">
                            Добавляй остановки только если они нужны по маршруту.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={addWaypoint}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 opacity-100 hover:bg-slate-50"
                        >
                          Добавить точку
                        </button>
                      </div>

                      {waypoints.length > 0 && (
                        <div className="mt-4 grid gap-3">
                          {waypoints.map((point, index) => (
                            <div
                              key={index}
                              className="grid items-start gap-3 md:grid-cols-[1fr_auto]"
                            >
                              <CityField
                                label={`Промежуточная точка ${index + 1}`}
                                value={point}
                                onChange={(value) =>
                                  updateWaypoint(index, value)
                                }
                                options={cityOptions}
                                error={touched ? cityErrors.waypoints[index] : ''}
                              />
                              <button
                                type="button"
                                onClick={() => removeWaypoint(index)}
                                className="mt-[30px] rounded-2xl border border-slate-300 px-4 py-3 text-sm hover:bg-slate-50"
                              >
                                Убрать
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <input
                        type="checkbox"
                        checked={form.returnToOrigin}
                        onChange={(e) =>
                          updateForm('returnToOrigin', e.target.checked)
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-300"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Вернуть группу в город отправления
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          Чаще всего нужно для экскурсий, свадеб и трансферов
                          туда-обратно.
                        </div>
                      </div>
                    </label>

                    <div className="grid items-start gap-6 md:grid-cols-2">
                      <Field
                        label="Кол-во пассажиров *"
                        value={form.passengers}
                        onChange={(value) => updateForm('passengers', value)}
                        placeholder="Например, 20"
                        error={touched ? requiredErrors.passengers : ''}
                      />
                      <SelectField
                        label="Дети"
                        value={form.hasChildren}
                        onChange={(value) => updateForm('hasChildren', value)}
                        options={['no::Нет', 'yes::Да']}
                        error=""
                      />
                    </div>

                    <div className="grid items-start gap-6 md:grid-cols-2">
                      <SelectField
                        label="Тип автобуса *"
                        value={form.busType}
                        onChange={(value) => updateForm('busType', value)}
                        options={[
                          'Минивэн (до 8 мест)',
                          'Микроавтобус (до 20 мест)',
                          'Автобус (до 35 мест)',
                          'Автобус (до 45 мест)',
                          'Туристический автобус (до 55 мест)',
                        ]}
                        error={touched ? requiredErrors.busType : ''}
                      />
                      <SelectField
                        label="Тип оплаты *"
                        value={form.paymentType}
                        onChange={(value) => updateForm('paymentType', value)}
                        options={['Наличные', 'Безнал', 'Картой']}
                        error={touched ? requiredErrors.paymentType : ''}
                      />
                    </div>

                    <div className="grid items-start gap-6 md:grid-cols-2">
                      <Field
                        label="Дата *"
                        value={form.tripDate}
                        onChange={(value) => updateForm('tripDate', value)}
                        placeholder="дд.мм.гггг"
                        error={touched ? requiredErrors.tripDate : ''}
                      />
                      <Field
                        label="Желаемая цена, ₽"
                        value={form.desiredPrice}
                        onChange={(value) => updateForm('desiredPrice', value)}
                        placeholder="Например, 18000"
                        error={touched ? requiredErrors.desiredPrice : ''}
                      />
                    </div>

                    <Field
                      label="Комментарий"
                      value={form.comment}
                      onChange={(value) => updateForm('comment', value)}
                      placeholder="Например: школьная экскурсия, нужен багажный отсек, остановка у музея"
                      error=""
                    />

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                      <div className="text-sm font-semibold text-emerald-800">
                        Длина маршрута
                      </div>
                      <div className="mt-1 text-2xl font-bold text-emerald-900">
                        {routeDistanceLabel}
                      </div>
                      <div className="mt-1 text-xs text-emerald-800">
                        Расчет ориентировочный. Позже заменим на маршрутный API
                        карт.
                      </div>
                    </div>

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
                      disabled={saving}
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                    >
                      {saving ? 'Создание...' : 'Отправить заявку'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {customerPage === 'dashboard' && (
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-3xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-6 py-5">
                    <div className="text-sm font-semibold text-slate-800">
                      Мои заявки
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                      Список заявок
                    </h2>
                  </div>

                  <div className="p-6">
                    {!requests.length ? (
                      <p className="text-slate-700">Пока заявок нет.</p>
                    ) : (
                      <div className="grid gap-4">
                        {requests.map((request) => (
                          <button
                            key={request.id}
                            onClick={() => openRequestDetails(request.id)}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100"
                          >
                            <div className="text-base font-semibold text-slate-900">
                              {request.fromCity} → {request.toCity}
                            </div>
                            <div className="mt-2 text-sm text-slate-700">
                              Пассажиры: {request.passengers}
                            </div>
                            <div className="mt-1 text-sm text-slate-700">
                              Дата:{' '}
                              {new Date(request.tripDate).toLocaleDateString()}
                            </div>
                            <div className="mt-1 text-sm text-slate-700">
                              Оплата: {request.paymentType}
                            </div>
                            <div className="mt-1 text-sm text-slate-700">
                              Желаемая цена:{' '}
                              {request.desiredPrice ? `${request.desiredPrice} ₽` : 'Не указана'}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-6 py-5">
                    <div className="text-sm font-semibold text-slate-800">
                      Отклики по заявке
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                      Детали
                    </h2>
                  </div>

                  <div className="p-6">
                    {!selectedRequest ? (
                      <p className="text-slate-700">
                        Выбери заявку, чтобы посмотреть подробности и отклики.
                      </p>
                    ) : (
                      <div className="grid gap-4">
                        <InfoRow
                          label="Маршрут"
                          value={`${selectedRequest.fromCity} → ${selectedRequest.toCity}`}
                        />
                        <InfoRow
                          label="Пассажиры"
                          value={String(selectedRequest.passengers)}
                        />
                        <InfoRow
                          label="Дата"
                          value={new Date(
                            selectedRequest.tripDate
                          ).toLocaleDateString()}
                        />
                        <InfoRow
                          label="Тип автобуса"
                          value={selectedRequest.busType}
                        />
                        <InfoRow
                          label="Оплата"
                          value={selectedRequest.paymentType}
                        />
                        <InfoRow
                          label="Желаемая цена"
                          value={
                            selectedRequest.desiredPrice
                              ? `${selectedRequest.desiredPrice} ₽`
                              : 'Не указана'
                          }
                        />
                        <InfoRow
                          label="Комментарий"
                          value={selectedRequest.comment || 'Нет'}
                        />

                        <div className="mt-2">
                          <div className="mb-3 text-sm font-semibold text-slate-800">
                            Отклики перевозчиков
                          </div>
                          {!selectedRequest.offers?.length ? (
                            <p className="text-slate-700">
                              Откликов пока нет.
                            </p>
                          ) : (
                            <div className="grid gap-4">
                              {selectedRequest.offers.map((offer) => (
                                <div
                                  key={offer.id}
                                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                >
                                  <div className="text-base font-semibold text-slate-900">
                                    {offer.carrier?.carrierProfile
                                      ?.companyType || 'Перевозчик'}{' '}
                                    {offer.carrier?.carrierProfile
                                      ?.companyName ||
                                      offer.carrier?.name ||
                                      ''}
                                  </div>
                                  <div className="mt-1 text-sm text-slate-700">
                                    {offer.carrier?.carrierProfile?.busModel ||
                                      'Марка автобуса не указана'}
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
            )}

            {customerPage === 'request-details' && (
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-3xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          Моя заявка
                        </div>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                          Подробности
                        </h2>
                      </div>

                      <button
                        onClick={() => setCustomerPage('dashboard')}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                      >
                        Назад
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {!selectedRequest ? (
                      <p className="text-slate-700">Заявка не выбрана.</p>
                    ) : (
                      <div className="grid gap-4">
                        <InfoRow
                          label="Маршрут"
                          value={`${selectedRequest.fromCity} → ${selectedRequest.toCity}`}
                        />
                        <InfoRow
                          label="Пассажиры"
                          value={String(selectedRequest.passengers)}
                        />
                        <InfoRow
                          label="Дата"
                          value={new Date(
                            selectedRequest.tripDate
                          ).toLocaleDateString()}
                        />
                        <InfoRow
                          label="Тип автобуса"
                          value={selectedRequest.busType}
                        />
                        <InfoRow
                          label="Оплата"
                          value={selectedRequest.paymentType}
                        />
                        <InfoRow
                          label="Желаемая цена"
                          value={
                            selectedRequest.desiredPrice
                              ? `${selectedRequest.desiredPrice} ₽`
                              : 'Не указана'
                          }
                        />
                        <InfoRow
                          label="Комментарий"
                          value={selectedRequest.comment || 'Нет'}
                        />
                        <InfoRow
                          label="Возврат в город отправления"
                          value={
                            selectedRequest.returnToOrigin ? 'Да' : 'Нет'
                          }
                        />
                        <InfoRow
                          label="Длина маршрута"
                          value={
                            selectedRequest.distanceKm
                              ? `${selectedRequest.distanceKm} км`
                              : 'Не указана'
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-6 py-5">
                    <div className="text-sm font-semibold text-slate-800">
                      Отклики перевозчиков
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                      Предложения по заявке
                    </h2>
                  </div>

                  <div className="p-6">
                    {!selectedRequest?.offers?.length ? (
                      <p className="text-slate-700">Откликов пока нет.</p>
                    ) : (
                      <div className="grid gap-4">
                        {selectedRequest.offers.map((offer) => (
                          <div
                            key={offer.id}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="text-base font-semibold text-slate-900">
                              {offer.carrier?.carrierProfile?.companyType ||
                                'Перевозчик'}{' '}
                              {offer.carrier?.carrierProfile?.companyName ||
                                offer.carrier?.name ||
                                ''}
                            </div>
                            <div className="mt-1 text-sm text-slate-700">
                              {offer.carrier?.carrierProfile?.busModel ||
                                'Марка автобуса не указана'}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, error }) {
  return (
    <label className="grid min-h-[96px] gap-2 text-sm font-medium">
      <span className="text-slate-900">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`rounded-2xl border px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300'
        }`}
      />
      <span className={`text-xs ${error ? 'text-red-600' : 'text-transparent'}`}>
        {error || 'placeholder'}
      </span>
    </label>
  );
}

function CityField({ label, value, onChange, options, error }) {
  return (
    <label className="grid min-h-[96px] gap-2 text-sm font-medium">
      <span className="text-slate-900">{label}</span>
      <input
        list="russian-cities-dashboard"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-2xl border px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300'
        }`}
      />
      <datalist id="russian-cities-dashboard">
        {options.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>
      <span className={`text-xs ${error ? 'text-red-600' : 'text-transparent'}`}>
        {error || 'placeholder'}
      </span>
    </label>
  );
}

function SelectField({ label, value, onChange, options, error }) {
  return (
    <label className="grid min-h-[96px] gap-2 text-sm font-medium">
      <span className="text-slate-900">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-2xl border bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300'
        }`}
      >
        <option value="">Выбери вариант</option>
        {options.map((option) => {
          const hasCustomValue = option.includes('::');
          const [optionValue, optionLabel] = hasCustomValue
            ? option.split('::')
            : [option, option];

          return (
            <option key={option} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      <span className={`text-xs ${error ? 'text-red-600' : 'text-transparent'}`}>
        {error || 'placeholder'}
      </span>
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

function isKnownRussianCity(value) {
  return RUSSIAN_CITIES.includes(value.trim());
}

function isPositiveInteger(value) {
  return /^\d+$/.test(value.trim()) && Number(value) > 0;
}

function formatDateInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [];
  if (digits.slice(0, 2)) parts.push(digits.slice(0, 2));
  if (digits.slice(2, 4)) parts.push(digits.slice(2, 4));
  if (digits.slice(4, 8)) parts.push(digits.slice(4, 8));
  return parts.join('.');
}

function isValidDisplayDate(value) {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return false;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

function displayDateToIso(value) {
  const [dd, mm, yyyy] = value.split('.');
  return `${yyyy}-${mm}-${dd}`;
}
