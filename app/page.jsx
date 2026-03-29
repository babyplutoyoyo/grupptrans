'use client';

import { useEffect, useMemo, useState } from 'react';

const RUSSIAN_CITIES = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Пермь', 'Воронеж', 'Волгоград', 'Краснодар', 'Саратов', 'Тюмень', 'Тольятти', 'Ижевск', 'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск', 'Ярославль', 'Владивосток', 'Махачкала', 'Томск', 'Оренбург', 'Кемерово', 'Новокузнецк', 'Рязань', 'Астрахань', 'Набережные Челны', 'Пенза', 'Липецк', 'Киров', 'Чебоксары', 'Тула', 'Калининград', 'Балашиха', 'Курск', 'Курчатов', 'Железногорск', 'Обнинск', 'Подольск', 'Люберцы', 'Химки', 'Мытищи', 'Королёв', 'Домодедово', 'Серпухов', 'Коломна', 'Орёл', 'Белгород', 'Старый Оскол', 'Брянск', 'Смоленск', 'Тверь', 'Иваново', 'Владимир', 'Кострома', 'Тамбов', 'Севастополь', 'Сочи', 'Ставрополь', 'Улан-Удэ', 'Магнитогорск', 'Сургут', 'Выборг'
];

const CITY_COORDS = {
  'Москва': { lat: 55.7558, lon: 37.6173 }, 'Санкт-Петербург': { lat: 59.9343, lon: 30.3351 }, 'Новосибирск': { lat: 55.0084, lon: 82.9357 }, 'Екатеринбург': { lat: 56.8389, lon: 60.6057 }, 'Казань': { lat: 55.8304, lon: 49.0661 }, 'Нижний Новгород': { lat: 56.2965, lon: 43.9361 }, 'Челябинск': { lat: 55.1644, lon: 61.4368 }, 'Самара': { lat: 53.1959, lon: 50.1008 }, 'Омск': { lat: 54.9885, lon: 73.3242 }, 'Ростов-на-Дону': { lat: 47.2357, lon: 39.7015 }, 'Уфа': { lat: 54.7388, lon: 55.9721 }, 'Красноярск': { lat: 56.0153, lon: 92.8932 }, 'Пермь': { lat: 58.0105, lon: 56.2502 }, 'Воронеж': { lat: 51.6608, lon: 39.2003 }, 'Волгоград': { lat: 48.708, lon: 44.5133 }, 'Краснодар': { lat: 45.0355, lon: 38.9753 }, 'Саратов': { lat: 51.5336, lon: 46.0343 }, 'Тюмень': { lat: 57.153, lon: 65.5343 }, 'Тольятти': { lat: 53.5078, lon: 49.4204 }, 'Ижевск': { lat: 56.8527, lon: 53.2115 }, 'Барнаул': { lat: 53.3474, lon: 83.7784 }, 'Ульяновск': { lat: 54.3142, lon: 48.4031 }, 'Иркутск': { lat: 52.2869, lon: 104.305 }, 'Хабаровск': { lat: 48.4802, lon: 135.0719 }, 'Ярославль': { lat: 57.6261, lon: 39.8845 }, 'Владивосток': { lat: 43.1155, lon: 131.8855 }, 'Махачкала': { lat: 42.9849, lon: 47.5047 }, 'Томск': { lat: 56.4846, lon: 84.948 }, 'Оренбург': { lat: 51.7682, lon: 55.0969 }, 'Кемерово': { lat: 55.3552, lon: 86.0873 }, 'Новокузнецк': { lat: 53.7575, lon: 87.1361 }, 'Рязань': { lat: 54.6296, lon: 39.7418 }, 'Астрахань': { lat: 46.3497, lon: 48.0408 }, 'Набережные Челны': { lat: 55.7435, lon: 52.3958 }, 'Пенза': { lat: 53.1959, lon: 45.0183 }, 'Липецк': { lat: 52.6122, lon: 39.5981 }, 'Киров': { lat: 58.6036, lon: 49.6679 }, 'Чебоксары': { lat: 56.1439, lon: 47.2489 }, 'Тула': { lat: 54.1921, lon: 37.6156 }, 'Калининград': { lat: 54.7104, lon: 20.4522 }, 'Балашиха': { lat: 55.7961, lon: 37.938 }, 'Курск': { lat: 51.7304, lon: 36.1926 }, 'Курчатов': { lat: 51.6593, lon: 35.6572 }, 'Железногорск': { lat: 52.331, lon: 35.3711 }, 'Обнинск': { lat: 55.0968, lon: 36.6101 }, 'Подольск': { lat: 55.4311, lon: 37.5456 }, 'Люберцы': { lat: 55.6764, lon: 37.8982 }, 'Химки': { lat: 55.8887, lon: 37.4304 }, 'Мытищи': { lat: 55.9116, lon: 37.7308 }, 'Королёв': { lat: 55.9142, lon: 37.8256 }, 'Домодедово': { lat: 55.443, lon: 37.7478 }, 'Серпухов': { lat: 54.9226, lon: 37.4031 }, 'Коломна': { lat: 55.0938, lon: 38.7688 }, 'Орёл': { lat: 52.9685, lon: 36.0692 }, 'Белгород': { lat: 50.5954, lon: 36.5873 }, 'Старый Оскол': { lat: 51.2967, lon: 37.8417 }, 'Брянск': { lat: 53.2433, lon: 34.3637 }, 'Смоленск': { lat: 54.7826, lon: 32.0453 }, 'Тверь': { lat: 56.8596, lon: 35.9119 }, 'Иваново': { lat: 56.9972, lon: 40.9714 }, 'Владимир': { lat: 56.129, lon: 40.4066 }, 'Кострома': { lat: 57.7679, lon: 40.9269 }, 'Тамбов': { lat: 52.7212, lon: 41.4523 }, 'Севастополь': { lat: 44.6167, lon: 33.5254 }, 'Сочи': { lat: 43.5855, lon: 39.7231 }, 'Ставрополь': { lat: 45.0448, lon: 41.969 }, 'Улан-Удэ': { lat: 51.8334, lon: 107.584 }, 'Магнитогорск': { lat: 53.4072, lon: 58.9791 }, 'Сургут': { lat: 61.254, lon: 73.3962 }, 'Выборг': { lat: 60.7091, lon: 28.7494 }
};

const VERIFIED_CARRIERS = [
  { id: 1, legalName: 'ООО «КурскТурТранс»', busModel: 'Yutong ZK6122H9', busSpecs: ['45 мест', 'Багажный отсек', 'Кондиционер', 'Ремни безопасности'], price: '18 500 ₽', comment: 'Подадим автобус за 15 минут до выезда. Есть место под багаж и сопровождение группы.', verified: true },
  { id: 2, legalName: 'ИП Соколов А.А.', busModel: 'Mercedes-Benz Sprinter', busSpecs: ['20 мест', 'Мягкие кресла', 'Климат-контроль', 'USB-зарядка'], price: '17 200 ₽', comment: 'Работаем по безналу, закрывающие документы и договор предоставим.', verified: true },
  { id: 3, legalName: 'ООО «РегионМаршрут»', busModel: 'ПАЗ Vector Next', busSpecs: ['30 мест', 'Подходит для города', 'Откидные сиденья'], price: '16 900 ₽', comment: 'Подходит для школьных и экскурсионных поездок, возможны дополнительные остановки.', verified: false }
];

const SAMPLE_REQUESTS = [
  { id: 101, route: 'Москва → Тула', date: '24.03.2026', passengers: '20', busType: 'Микроавтобус (до 20 мест)', payment: 'Безнал', distance: '185 км' },
  { id: 102, route: 'Курск → Курчатов', date: '25.03.2026', passengers: '35', busType: 'Автобус (до 45 мест)', payment: 'Наличные', distance: '42 км' }
];

export default function PassengerTransportMVP() {
  const [audience, setAudience] = useState(null);
  const [customerPage, setCustomerPage] = useState('request');
  const [carrierPage, setCarrierPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [form, setForm] = useState({
    from: '', to: '', phone: '+7 ', name: '', passengers: '', hasChildren: 'no', date: '', busType: '', paymentType: '', comment: '', returnToOrigin: true,
  });
  const [touched, setTouched] = useState(false);
  const [requests, setRequests] = useState([]);
  const [carrierForm, setCarrierForm] = useState({
    companyType: 'ООО', companyName: 'ГруппТранс Партнер', busModel: '', seats: '', hasAc: 'yes', hasBelts: 'yes', hasLuggage: 'yes', busYear: '', paymentTypes: 'Наличные, безнал', comment: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('grupptrans_user');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);

        if (parsedUser.role === 'CUSTOMER') {
          setAudience('customer');
        }

        if (parsedUser.role === 'CARRIER') {
          setAudience('carrier');
        }
      } catch (e) {
        localStorage.removeItem('grupptrans_user');
      }
    }
  }, []);

  const selectedRequest = requests.find((request) => request.id === selectedRequestId) || null;

  const customerNav = [
    { id: 'home', label: 'Заказчику' },
    { id: 'request', label: 'Создать заявку' },
    { id: 'dashboard', label: 'Мои заявки' },
  ];
  const carrierNav = [
    { id: 'home', label: 'Перевозчикам' },
    { id: 'requests', label: 'Доступные заявки' },
    { id: 'profile', label: 'Личный кабинет' },
  ];

  const cityErrors = useMemo(() => ({
    from: form.from.trim() && !isKnownRussianCity(form.from) ? 'Пока принимаем только города России' : '',
    to: form.to.trim() && !isKnownRussianCity(form.to) ? 'Пока принимаем только города России' : '',
    waypoints: waypoints.map((point) => !point.trim() ? '' : isKnownRussianCity(point) ? '' : 'Укажи город России из списка'),
  }), [form.from, form.to, waypoints]);

  const phoneError = useMemo(() => {
    if (!form.phone.trim() || form.phone.trim() === '+7') return '';
    return normalizePhone(form.phone) ? '' : 'Введи корректный российский номер телефона';
  }, [form.phone]);

  const dateError = useMemo(() => {
    if (!form.date.trim()) return '';
    return isValidFutureDate(form.date) ? '' : 'Введи дату в формате дд.мм.гггг и не раньше сегодняшнего дня';
  }, [form.date]);

  const requiredErrors = useMemo(() => ({
    from: !form.from.trim() ? 'Заполни поле «Откуда»' : cityErrors.from,
    to: !form.to.trim() ? 'Заполни поле «Куда»' : cityErrors.to,
    phone: !normalizePhone(form.phone) ? 'Введи корректный российский номер телефона' : phoneError,
    name: !form.name.trim() ? 'Заполни поле «Имя»' : '',
    passengers: !form.passengers.trim() ? 'Заполни поле «Кол-во пассажиров»' : isPositiveInteger(form.passengers) ? '' : 'Укажи число больше 0',
    date: !form.date.trim() ? 'Заполни поле «Дата»' : dateError,
    busType: !form.busType.trim() ? 'Выбери тип автобуса' : '',
    paymentType: !form.paymentType.trim() ? 'Выбери тип оплаты' : '',
  }), [form, cityErrors, phoneError, dateError]);

  const hasErrors = Object.values(requiredErrors).some(Boolean) || cityErrors.waypoints.some(Boolean);
  const routeDistance = useMemo(() => calculateRouteDistanceKm(form.from, waypoints, form.to, form.returnToOrigin), [form.from, waypoints, form.to, form.returnToOrigin]);

  function updateForm(field, value) {
    if (field === 'phone') return setForm((prev) => ({ ...prev, phone: formatPhoneInput(value) }));
    if (field === 'date') return setForm((prev) => ({ ...prev, date: formatDateInput(value) }));
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateCarrierForm(field, value) {
    setCarrierForm((prev) => ({ ...prev, [field]: value }));
  }

  function addWaypoint() {
    setWaypoints((prev) => [...prev, '']);
  }

  function updateWaypoint(index, value) {
    setWaypoints((prev) => prev.map((item, i) => i === index ? value : item));
  }

  function removeWaypoint(index) {
    setWaypoints((prev) => prev.filter((_, i) => i !== index));
  }

  function openRequestDetails(requestId) {
    setSelectedRequestId(requestId);
    setCustomerPage('request-details');
  }

  function handleLogout() {
    localStorage.removeItem('grupptrans_user');
    setCurrentUser(null);
    setAudience(null);
    setCustomerPage('home');
    setCarrierPage('home');
  }

  function resetForm() {
    setForm({ from: '', to: '', phone: '+7 ', name: '', passengers: '', hasChildren: 'no', date: '', busType: '', paymentType: '', comment: '', returnToOrigin: true });
    setWaypoints([]);
    setTouched(false);
  }

  function submitRequest(e) {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) return;
    const cleanedWaypoints = waypoints.map((x) => x.trim()).filter(Boolean);
    const newRequest = { id: Date.now(), ...form, phone: normalizePhone(form.phone), waypoints: cleanedWaypoints, distance: routeDistance };
    setRequests((prev) => [newRequest, ...prev]);
    setSelectedRequestId(newRequest.id);
    setCustomerPage('request-details');
    resetForm();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => {
              setAudience(null);
              setCustomerPage('home');
              setCarrierPage('home');
            }}
            className="text-left"
          >
            <div className="text-xl font-semibold">ГруппТранс</div>
            <div className="text-sm text-slate-500">Сервис подбора пассажирских перевозок</div>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{currentUser.name}</div>
                <div className="text-xs text-slate-500">
                  {currentUser.role === 'CUSTOMER' ? 'Заказчик' : 'Перевозчик'}
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
              <a
                href="/login"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Вход
              </a>
              <a
                href="/register"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Регистрация
              </a>
            </div>
          )}
        </div>

        {audience && (
          <div className="border-t bg-white">
            <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-3 text-sm">
              {(audience === 'customer' ? customerNav : carrierNav).map((item) => (
                <button
                  key={item.id}
                  onClick={() => audience === 'customer' ? setCustomerPage(item.id) : setCarrierPage(item.id)}
                  className={navPillClass(audience === 'customer' ? customerPage === item.id : carrierPage === item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {!audience && <AudienceLanding onSelect={setAudience} />}
        {audience === 'customer' && customerPage === 'home' && <CustomerHomePage setCustomerPage={setCustomerPage} />}
        {audience === 'customer' && customerPage === 'request' && <RequestPage form={form} updateForm={updateForm} waypoints={waypoints} addWaypoint={addWaypoint} updateWaypoint={updateWaypoint} removeWaypoint={removeWaypoint} requiredErrors={requiredErrors} touched={touched} submitRequest={submitRequest} routeDistance={routeDistance} cityErrors={cityErrors} />}
        {audience === 'customer' && customerPage === 'dashboard' && <DashboardPage requests={requests} setCustomerPage={setCustomerPage} openRequestDetails={openRequestDetails} selectedRequestId={selectedRequestId} />}
        {audience === 'customer' && customerPage === 'request-details' && <RequestDetailsPage request={selectedRequest} offers={VERIFIED_CARRIERS} setCustomerPage={setCustomerPage} />}
        {audience === 'carrier' && carrierPage === 'home' && <CarrierHomePage setCarrierPage={setCarrierPage} />}
        {audience === 'carrier' && carrierPage === 'requests' && <CarrierRequestsPage />}
        {audience === 'carrier' && carrierPage === 'profile' && <CarrierProfilePage carrierForm={carrierForm} updateCarrierForm={updateCarrierForm} />}
      </main>
    </div>
  );
}

function AudienceLanding({ onSelect }) {
  return (
    <div className="grid gap-8">
      <section className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-sm md:p-12">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">Платформа пассажирских перевозок</div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">ГруппТранс помогает быстро найти перевозчика для экскурсии, трансфера или групповой поездки</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">Заказчики создают заявку с маршрутом и деталями поездки, а перевозчики отправляют свои предложения. Платформа упрощает поиск, сравнение и выбор подходящего варианта в одном месте.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => onSelect('customer')} className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:opacity-90">Оставить заявку</button>
              <button onClick={() => onSelect('carrier')} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15">Я перевозчик</button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="text-sm font-medium text-white/70">Как это работает</div>
              <div className="mt-4 grid gap-3 text-sm text-white/90">
                <div className="rounded-2xl bg-white/10 p-4">1. Создаешь заявку с маршрутом и датой</div>
                <div className="rounded-2xl bg-white/10 p-4">2. Получаешь предложения от перевозчиков</div>
                <div className="rounded-2xl bg-white/10 p-4">3. Сравниваешь цену, автобус и условия</div>
                <div className="rounded-2xl bg-white/10 p-4">4. Выбираешь подходящий транспорт</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <button onClick={() => onSelect('customer')} className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-sm font-medium text-slate-500">Для заказчика</div>
          <div className="mt-3 text-3xl font-semibold">Я заказчик</div>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">Создать заявку, получить предложения перевозчиков, сравнить условия и выбрать подходящий автобус.</p>
        </button>
        <button onClick={() => onSelect('carrier')} className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-sm font-medium text-slate-500">Для перевозчика</div>
          <div className="mt-3 text-3xl font-semibold">Я перевозчик</div>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">Смотреть доступные заявки, откликаться на них и управлять профилем компании в отдельном разделе.</p>
        </button>
      </section>
    </div>
  );
}

function CustomerHomePage({ setCustomerPage }) {
  return (
    <div className="grid gap-8">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">Раздел заказчика</div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Организуйте групповую поездку без долгих звонков и хаоса в мессенджерах</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">Создайте заявку на перевозку, укажите маршрут, дату, количество пассажиров и детали поездки. Проверенные перевозчики увидят заказ и отправят свои предложения.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => setCustomerPage('request')} className="rounded-2xl bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:opacity-90">Создать заявку</button>
            <button onClick={() => setCustomerPage('dashboard')} className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-100">Мои заявки</button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">Что уже умеет форма</div>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-4">Проверяет города России</div>
              <div className="rounded-2xl bg-slate-50 p-4">Фиксирует, есть ли дети</div>
              <div className="rounded-2xl bg-slate-50 p-4">Подставляет номер с +7</div>
              <div className="rounded-2xl bg-slate-50 p-4">Считает ориентировочную длину маршрута</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RequestPage({ form, updateForm, waypoints, addWaypoint, updateWaypoint, removeWaypoint, requiredErrors, touched, submitRequest, routeDistance, cityErrors }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-2 text-sm font-medium text-slate-500">Страница заказчика</div>
        <h2 className="text-2xl font-semibold">Создание заявки</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Сейчас форма работает по городам России. Позже можно расширить до улиц и подключить карты Яндекса или 2ГИС.</p>
        <form onSubmit={submitRequest} className="mt-8 grid gap-6">
          <div className="grid items-start gap-6 md:grid-cols-2">
            <CityField label="Откуда *" placeholder="Например, Москва" value={form.from} onChange={(value) => updateForm('from', value)} error={touched ? requiredErrors.from : ''} />
            <CityField label="Куда *" placeholder="Например, Курск" value={form.to} onChange={(value) => updateForm('to', value)} error={touched ? requiredErrors.to : ''} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Промежуточные точки</div>
                <div className="mt-1 text-xs text-slate-500">Добавляй остановки только если они нужны по маршруту.</div>
              </div>
              <button type="button" onClick={addWaypoint} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">Добавить точку</button>
            </div>

            {waypoints.length > 0 && (
              <div className="mt-4 grid gap-3">
                {waypoints.map((point, index) => (
                  <div key={index} className="grid items-start gap-3 md:grid-cols-[1fr_auto]">
                    <Field label={`Промежуточная точка ${index + 1}`} placeholder="Например, Курчатов" value={point} onChange={(value) => updateWaypoint(index, value)} error={touched ? cityErrors.waypoints[index] : ''} />
                    <button type="button" onClick={() => removeWaypoint(index)} className="mt-[30px] rounded-2xl border border-slate-300 px-4 py-3 text-sm hover:bg-slate-50">Убрать</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <input type="checkbox" checked={form.returnToOrigin} onChange={(e) => updateForm('returnToOrigin', e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300" />
            <div>
              <div className="text-sm font-semibold">Вернуть группу в город отправления</div>
              <div className="mt-1 text-xs text-slate-500">Чаще всего нужно для экскурсий, свадеб и трансферов туда-обратно.</div>
            </div>
          </label>

          <div className="grid items-start gap-6 md:grid-cols-2">
            <Field label="Кол-во пассажиров *" placeholder="Например, 20" value={form.passengers} onChange={(value) => updateForm('passengers', value)} error={touched ? requiredErrors.passengers : ''} />
            <SelectField label="Дети" value={form.hasChildren} onChange={(value) => updateForm('hasChildren', value)} options={['no::Нет', 'yes::Да']} error="" />
          </div>

          <div className="grid items-start gap-6 md:grid-cols-2">
            <SelectField label="Тип автобуса *" value={form.busType} onChange={(value) => updateForm('busType', value)} options={['Минивэн (до 8 мест)', 'Микроавтобус (до 20 мест)', 'Автобус (до 35 мест)', 'Автобус (до 45 мест)', 'Туристический автобус (до 55 мест)']} error={touched ? requiredErrors.busType : ''} />
            <SelectField label="Тип оплаты *" value={form.paymentType} onChange={(value) => updateForm('paymentType', value)} options={['Наличные', 'Безнал', 'Картой']} error={touched ? requiredErrors.paymentType : ''} />
          </div>

          <div className="grid items-start gap-6 md:grid-cols-2">
            <Field label="Дата *" placeholder="дд.мм.гггг" value={form.date} onChange={(value) => updateForm('date', value)} error={touched ? requiredErrors.date : ''} />
            <Field label="Комментарий" placeholder="Например: школьная экскурсия, нужен багажный отсек, остановка у музея" value={form.comment} onChange={(value) => updateForm('comment', value)} error="" />
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
            <div className="text-sm font-medium text-emerald-800">Длина маршрута</div>
            <div className="mt-1 text-2xl font-bold text-emerald-900">{routeDistance ?? 'Укажи города маршрута'}</div>
            <div className="mt-1 text-xs text-emerald-700">Расчет ориентировочный, по прямой между городами. Позже заменим на маршрутный API карт.</div>
          </div>

          <div className="grid items-start gap-6 md:grid-cols-2">
            <Field label="Имя *" placeholder="Ваше имя" value={form.name} onChange={(value) => updateForm('name', value)} error={touched ? requiredErrors.name : ''} />
            <PhoneField label="Номер *" value={form.phone} onChange={(value) => updateForm('phone', value)} error={touched ? requiredErrors.phone : ''} />
          </div>

          <button type="submit" className="mt-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">Отправить заявку</button>
        </form>
      </div>
    </div>
  );
}

function DashboardPage({ requests, setCustomerPage, openRequestDetails, selectedRequestId }) {
  if (!requests.length) {
    return <EmptyState title="У вас пока нет заявок" description="После отправки формы здесь можно будет смотреть статус и предложения перевозчиков." actionLabel="Создать первую заявку" onAction={() => setCustomerPage('request')} />;
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">Личный кабинет заказчика</div>
          <h2 className="mt-1 text-2xl font-semibold">Мои заявки</h2>
        </div>
        <button onClick={() => setCustomerPage('request')} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90">Новая заявка</button>
      </div>

      {requests.map((request) => (
        <button key={request.id} onClick={() => openRequestDetails(request.id)} className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">{buildRouteText(request)}</div>
              <div className="mt-1 text-sm text-slate-500">Дата: {request.date}</div>
            </div>
            {selectedRequestId === request.id && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">Открыта</span>}
          </div>

          <div className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <InfoRow label="Пассажиры" value={request.passengers} />
            <InfoRow label="Дети" value={request.hasChildren === 'yes' ? 'Да' : 'Нет'} />
            <InfoRow label="Тип автобуса" value={request.busType} />
            <InfoRow label="Оплата" value={request.paymentType} />
            <InfoRow label="Комментарий" value={request.comment || 'Нет'} />
            <InfoRow label="Длина маршрута" value={request.distance ?? '—'} />
          </div>

          <div className="mt-5 text-sm font-medium text-slate-900">Нажми, чтобы посмотреть заявку и отклики</div>
        </button>
      ))}
    </div>
  );
}

function RequestDetailsPage({ request, offers, setCustomerPage }) {
  if (!request) {
    return <EmptyState title="Заявка не выбрана" description="Открой раздел «Мои заявки» и нажми на нужную заявку, чтобы посмотреть подробности и отклики." actionLabel="Перейти к заявкам" onAction={() => setCustomerPage('dashboard')} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-slate-500">Моя заявка</div>
              <h2 className="mt-2 text-2xl font-semibold">Подробности</h2>
            </div>
            <button onClick={() => setCustomerPage('dashboard')} className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Назад</button>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-700">
            <InfoRow label="Маршрут" value={buildRouteText(request)} />
            <InfoRow label="Дата" value={request.date} />
            <InfoRow label="Пассажиры" value={request.passengers} />
            <InfoRow label="Дети" value={request.hasChildren === 'yes' ? 'Да' : 'Нет'} />
            <InfoRow label="Тип автобуса" value={request.busType} />
            <InfoRow label="Тип оплаты" value={request.paymentType} />
            <InfoRow label="Комментарий" value={request.comment || 'Нет'} />
            <InfoRow label="Промежуточные точки" value={request.waypoints.length ? request.waypoints.join(' • ') : 'Нет'} />
            <InfoRow label="Возврат в город отправления" value={request.returnToOrigin ? 'Да' : 'Нет'} />
            <InfoRow label="Длина маршрута" value={request.distance ?? '—'} />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-slate-500">Отклики перевозчиков</div>
          <h3 className="mt-2 text-2xl font-semibold">Предложения по заявке</h3>
        </div>

        {offers.map((offer) => (
          <div key={offer.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{offer.legalName}</div>
                <div className="mt-1 text-sm text-slate-500">{offer.busModel}</div>
              </div>
              {offer.verified && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Проверенный</span>}
            </div>

            <div className="mt-4 text-2xl font-bold">{offer.price}</div>
            <div className="mt-4 flex flex-wrap gap-2">{offer.busSpecs.map((spec) => <SpecPill key={spec} text={spec} />)}</div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{offer.comment}</p>
            <button className="mt-5 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90">Выбрать перевозчика</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarrierHomePage({ setCarrierPage }) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center">
      <div>
        <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">Раздел перевозчика</div>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Получайте заказы на перевозку групп и откликайтесь на подходящие маршруты</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Перевозчик работает в отдельном разделе: смотрит новые заявки, оценивает параметры поездки и отправляет свое предложение.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => setCarrierPage('requests')} className="rounded-2xl bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:opacity-90">Смотреть заявки</button>
          <button onClick={() => setCarrierPage('profile')} className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-100">Личный кабинет</button>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 text-sm font-medium text-slate-500">Что видит перевозчик</div>
        <div className="grid gap-4 text-sm text-slate-700">
          <div className="rounded-2xl bg-slate-50 p-4">Отдельная навигация и свой раздел</div>
          <div className="rounded-2xl bg-slate-50 p-4">Список заявок с датой, маршрутом и длиной пути</div>
          <div className="rounded-2xl bg-slate-50 p-4">Личный кабинет с заполнением данных автобуса</div>
          <div className="rounded-2xl bg-slate-50 p-4">Дальше сюда добавим отклик и онбординг</div>
        </div>
      </div>
    </div>
  );
}

function CarrierRequestsPage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-medium text-slate-500">Раздел перевозчика</div>
        <h2 className="mt-2 text-2xl font-semibold">Доступные заявки</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Здесь нет интерфейса заказчика, только список маршрутов, по которым можно отправить предложение.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {SAMPLE_REQUESTS.map((request) => (
          <div key={request.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="text-lg font-semibold">Заявка #{request.id}</div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">Новый заказ</span>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <InfoRow label="Маршрут" value={request.route} />
              <InfoRow label="Дата" value={request.date} />
              <InfoRow label="Пассажиры" value={request.passengers} />
              <InfoRow label="Тип автобуса" value={request.busType} />
              <InfoRow label="Оплата" value={request.payment} />
              <InfoRow label="Длина маршрута" value={request.distance} />
            </div>
            <button className="mt-5 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90">Откликнуться</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarrierProfilePage({ carrierForm, updateCarrierForm }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-medium text-slate-500">Личный кабинет перевозчика</div>
        <h2 className="mt-2 text-2xl font-semibold">Профиль компании и транспорта</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <SelectField label="Тип организации" value={carrierForm.companyType} onChange={(value) => updateCarrierForm('companyType', value)} options={['ООО', 'ИП']} error="" />
          <Field label="Название ООО / ИП" placeholder="Например, ООО «ГруппТранс Партнер»" value={carrierForm.companyName} onChange={(value) => updateCarrierForm('companyName', value)} error="" />
          <Field label="Марка / модель автобуса" placeholder="Например, Mercedes-Benz Sprinter" value={carrierForm.busModel} onChange={(value) => updateCarrierForm('busModel', value)} error="" />
          <Field label="Кол-во мест" placeholder="Например, 20" value={carrierForm.seats} onChange={(value) => updateCarrierForm('seats', value)} error="" />
          <Field label="Год выпуска" placeholder="Например, 2020" value={carrierForm.busYear} onChange={(value) => updateCarrierForm('busYear', value)} error="" />
          <Field label="Способы оплаты" placeholder="Наличные, безнал" value={carrierForm.paymentTypes} onChange={(value) => updateCarrierForm('paymentTypes', value)} error="" />
          <SelectField label="Кондиционер" value={carrierForm.hasAc} onChange={(value) => updateCarrierForm('hasAc', value)} options={['yes::Есть', 'no::Нет']} error="" />
          <SelectField label="Ремни безопасности" value={carrierForm.hasBelts} onChange={(value) => updateCarrierForm('hasBelts', value)} options={['yes::Есть', 'no::Нет']} error="" />
          <SelectField label="Багажный отсек" value={carrierForm.hasLuggage} onChange={(value) => updateCarrierForm('hasLuggage', value)} options={['yes::Есть', 'no::Нет']} error="" />
          <Field label="Комментарий о транспорте" placeholder="Например, мягкие кресла, USB-зарядка, подходит для экскурсий" value={carrierForm.comment} onChange={(value) => updateCarrierForm('comment', value)} error="" />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-medium text-slate-500">Как это будет видно заказчику</div>
        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-lg font-semibold">{carrierForm.companyType} «{carrierForm.companyName || 'Название компании'}»</div>
          <div className="mt-1 text-sm text-slate-500">{carrierForm.busModel || 'Марка автобуса'}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {carrierForm.seats && <SpecPill text={`${carrierForm.seats} мест`} />}
            {carrierForm.hasAc === 'yes' ? <SpecPill text="Кондиционер" /> : <SpecPill text="Без кондиционера" />}
            {carrierForm.hasBelts === 'yes' ? <SpecPill text="Ремни безопасности" /> : <SpecPill text="Без ремней" />}
            {carrierForm.hasLuggage === 'yes' ? <SpecPill text="Багажный отсек" /> : <SpecPill text="Без багажного отсека" />}
            {carrierForm.busYear && <SpecPill text={`Год ${carrierForm.busYear}`} />}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{carrierForm.comment || 'Здесь будет комментарий о транспорте и условиях поездки.'}</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, error }) {
  return (
    <label className="grid min-h-[96px] gap-2 text-sm font-medium">
      <span>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition ${error ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-300 focus:border-slate-500'}`} />
      <span className={`text-xs ${error ? 'text-red-600' : 'text-transparent'}`}>{error || 'placeholder'}</span>
    </label>
  );
}

function PhoneField({ label, value, onChange, error }) {
  return (
    <label className="grid min-h-[96px] gap-2 text-sm font-medium">
      <span>{label}</span>
      <div className={`flex items-center rounded-2xl border px-4 py-3 text-sm transition ${error ? 'border-red-300 bg-red-50 focus-within:border-red-400' : 'border-slate-300 focus-within:border-slate-500'}`}>
        <span className="mr-1 shrink-0 text-slate-900">+7</span>
        <input type="text" inputMode="numeric" value={value.replace(/^\+7\s?/, '')} onChange={(e) => onChange(`+7 ${e.target.value}`)} placeholder="999 123 45 67" className="w-full bg-transparent outline-none" />
      </div>
      <span className={`text-xs ${error ? 'text-red-600' : 'text-transparent'}`}>{error || 'placeholder'}</span>
    </label>
  );
}

function CityField({ label, placeholder, value, onChange, error }) {
  return (
    <label className="grid min-h-[96px] gap-2 text-sm font-medium">
      <span>{label}</span>
      <input type="text" list="russian-cities" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition ${error ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-300 focus:border-slate-500'}`} />
      <datalist id="russian-cities">{RUSSIAN_CITIES.map((city) => <option key={city} value={city} />)}</datalist>
      <span className={`text-xs ${error ? 'text-red-600' : 'text-transparent'}`}>{error || 'placeholder'}</span>
    </label>
  );
}

function SelectField({ label, value, onChange, options, error }) {
  return (
    <label className="grid min-h-[96px] gap-2 text-sm font-medium">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition ${error ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-300 focus:border-slate-500'}`}>
        <option value="">Выбери вариант</option>
        {options.map((option) => {
          const hasCustomValue = option.includes('::');
          const [optionValue, optionLabel] = hasCustomValue ? option.split('::') : [option, option];
          return <option key={option} value={optionValue}>{optionLabel}</option>;
        })}
      </select>
      <span className={`text-xs ${error ? 'text-red-600' : 'text-transparent'}`}>{error || 'placeholder'}</span>
    </label>
  );
}

function SpecPill({ text }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{text}</span>;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      <button onClick={onAction} className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90">{actionLabel}</button>
    </div>
  );
}

function navPillClass(isActive) {
  return `whitespace-nowrap rounded-full px-4 py-2 transition ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;
}

function isKnownRussianCity(value) {
  return RUSSIAN_CITIES.includes(value.trim());
}

function formatPhoneInput(value) {
  const digits = value.replace(/\D/g, '').replace(/^7/, '').slice(0, 10);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 8);
  const p4 = digits.slice(8, 10);
  let result = '+7';
  if (p1) result += ` ${p1}`;
  if (p2) result += ` ${p2}`;
  if (p3) result += ` ${p3}`;
  if (p4) result += ` ${p4}`;
  return result;
}

function normalizePhone(value) {
  const digits = value.replace(/\D/g, '');
  const normalized = digits.startsWith('7') ? digits.slice(1) : digits;
  if (normalized.length !== 10 || normalized[0] !== '9') return '';
  return `+7 (${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6, 8)}-${normalized.slice(8, 10)}`;
}

function formatDateInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [];
  if (digits.slice(0, 2)) parts.push(digits.slice(0, 2));
  if (digits.slice(2, 4)) parts.push(digits.slice(2, 4));
  if (digits.slice(4, 8)) parts.push(digits.slice(4, 8));
  return parts.join('.');
}

function isValidFutureDate(value) {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return false;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed >= today;
}

function isPositiveInteger(value) {
  return /^\d+$/.test(value.trim()) && Number(value) > 0;
}

function buildRouteText(request) {
  const points = [request.from, ...(request.waypoints || []), request.to].filter(Boolean);
  if (request.returnToOrigin && request.from) points.push(request.from);
  return points.join(' → ');
}

function calculateRouteDistanceKm(from, waypoints, to, returnToOrigin) {
  const cleaned = [from, ...waypoints.map((x) => x.trim()).filter(Boolean), to].filter(Boolean);
  if (cleaned.length < 2) return null;
  if (!cleaned.every((city) => CITY_COORDS[city])) return null;
  const route = [...cleaned];
  if (returnToOrigin && from) route.push(from);
  let total = 0;
  for (let i = 0; i < route.length - 1; i += 1) total += haversineKm(CITY_COORDS[route[i]], CITY_COORDS[route[i + 1]]);
  return `${Math.round(total)} км`;
}

function haversineKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}
