import { useEffect } from 'react';
import './Landing.css';

const TOOL_URL = '/app';

function useRevealOnScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (prefersReduced) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function SlideTag({ n, title }: { n: number; title: string }) {
  return (
    <p className="eyebrow">
      Слайд {String(n).padStart(2, '0')}/10 · {title}
    </p>
  );
}

function ProductTag({ i, title }: { i: number; title: string }) {
  return (
    <p className="eyebrow">
      Слайд 03/10 · Продукт {i} из 4 · {title}
    </p>
  );
}

const PRICING_ROWS = [
  {
    name: 'Персональная карта',
    som: '75 млн ₽',
    price: '1 990–8 000 ₽ (с рамкой)',
    margin: '3 500–7 500 ₽ (премиум)',
  },
  {
    name: 'Event Maps',
    som: '5 млн ₽',
    price: '1 500–2 500 ₽',
    margin: '1 000–2 000 ₽',
  },
  {
    name: 'Реклама на местности',
    som: '110 млн ₽/год',
    price: '5 000–15 000 ₽',
    margin: '4 500–14 500 ₽',
  },
  {
    name: '«Узнаю дорогу.рф»',
    som: 'оценивается по пилотам',
    price: 'лицензии / партнёрства',
    margin: '—',
  },
];

const SCENARIOS = ['История отношений', 'Путешествие', 'Детство ребёнка', 'Корпоративная география'];

const TEAM = [
  'Грищенко Сергей',
  'Карев Степан',
  'Кузнецов Алексей',
  'Масленников Юрий',
  'Суханов Артём',
  'Тарасенко Галина',
  'Абдурахипов Роман',
  'Васильев Кирилл',
];

export function Landing() {
  useRevealOnScroll();

  return (
    <div className="landing">
      <header className="landing__nav">
        <span className="landing__brand">
          узнаю<strong>дорогу</strong>.рф
        </span>
        <a className="landing__nav-cta" href={TOOL_URL}>
          Открыть инструмент →
        </a>
      </header>

      <main>
        {/* Слайд 1 — Титульный */}
        <section className="hero">
          <p className="eyebrow">Команда «Колобок» · проект «Знаю дорогу»</p>
          <h1>От карты для детей к новым продуктовым нишам</h1>
          <p className="hero__lede">
            Технология персонализированных карт изначально позиционировалась узко — как
            «карта для детей», и это ограничивало рост продукта. Цель работы — найти новые
            жизнеспособные ниши для этой технологии и получить первые подтверждённые данные
            о спросе, чтобы решить, какой сегмент масштабировать дальше.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={TOOL_URL}>
              Посмотреть живой MVP
            </a>
            <a className="btn btn--ghost" href="#problem">
              Питч ↓
            </a>
          </div>
        </section>

        {/* Слайд 2 — Боль */}
        <section className="problem reveal" id="problem">
          <SlideTag n={2} title="Боль" />
          <h2>Технология шире, чем ниша, в которую мы её загнали</h2>
          <ul className="problem__list">
            <li>
              Организаторы мероприятий — страйкбола, квестов, фестивалей, реконструкции —
              сейчас делают карты вручную. Нужен дизайнер, карта плохо адаптируется под
              новую локацию, и весь процесс приходится повторять для каждого события
              заново.
            </li>
            <li>
              Локальный бизнес физически находится рядом с клиентом, но остаётся для него
              невидимым. Кофейня в двухстах метрах от человека не существует в его поле
              внимания: он не знает о ней и не понимает, куда идти.
            </li>
            <li>
              Частные люди хотят сохранить важную для себя историю — отношения,
              путешествие, детство ребёнка — в физическом виде, но удобного
              персонализированного формата для этого нет; в ход идут универсальные
              фотокниги и сувениры без географической и сюжетной привязки.
            </li>
            <li>
              Краеведческий контент города разрознён: тексты об истории улиц и топонимов
              существуют отдельно от карты, у геоданных нет исторического слоя, а у истории
              — географической привязки.
            </li>
          </ul>
          <p className="callout-quote">
            Общий вывод: боль везде одна и та же — ценная информация (маршрут, история,
            реклама) существует, но не привязана к карте и не доходит до человека в нужный
            момент.
          </p>
        </section>

        {/* Слайд 3 — Решение: 4 продукта, каждый — на своей странице */}
        <section className="divergence reveal" id="solution">
          <SlideTag n={3} title="Решение — 4 продукта" />
          <h2>Один движок — четыре разных бизнеса</h2>
          <div className="fork">
            <div className="fork__trunk">
              <span>OSM движок + типография</span>
            </div>
            <div className="fork__branches">
              <div className="fork__branch">
                <strong>Event Maps</strong>
                <span>Конструктор карт для мероприятий</span>
              </div>
              <div className="fork__branch">
                <strong>Реклама на местности</strong>
                <span>Карта-навигатор с рекламным контактом</span>
              </div>
              <div className="fork__branch">
                <strong>Персональная карта</strong>
                <span>Личная история в физическом объекте</span>
              </div>
              <div className="fork__branch fork__branch--live">
                <strong>«Узнаю дорогу.рф»</strong>
                <span>Карта города + краеведческий контент — уже MVP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Слайд 3, страница 1 — Event Maps */}
        <section className="concept reveal" id="product-eventmaps">
          <ProductTag i={1} title="Event Maps" />
          <h2>Event Maps</h2>
          <p className="concept__thesis">
            Конструктор карт для организаторов мероприятий: страйкбола, квестов, фестивалей
            и исторической реконструкции.
          </p>
          <div className="concept__body concept__body--two">
            <div className="concept__col">
              <h3>Организатор передаёт</h3>
              <p>Локацию, ключевые точки, маршрут, задания, логотип и фирменный стиль.</p>
            </div>
            <div className="concept__col">
              <h3>Система собирает</h3>
              <p>
                Готовую карту с чекпоинтами, зонами команд и тайниками — для печати или как
                интерактивный элемент прямо на мероприятии.
              </p>
            </div>
          </div>
          <p className="callout-quote">
            Карта легко адаптируется под новую локацию без участия дизайнера.
          </p>
        </section>

        {/* Слайд 3, страница 2 — Реклама на местности */}
        <section className="concept reveal" id="product-ads">
          <ProductTag i={2} title="Реклама на местности" />
          <h2>Реклама на местности</h2>
          <p className="concept__thesis">
            Карта-навигатор, которая одновременно решает задачу бизнеса — быть заметным
            рядом с клиентом.
          </p>
          <div className="concept__body concept__body--two">
            <div className="concept__col">
              <h3>Для человека</h3>
              <p>Видит ближайшие заведения с указанием времени в пути.</p>
            </div>
            <div className="concept__col">
              <h3>Для бизнеса</h3>
              <p>
                Физический рекламный формат — сити-формат, карта-навигатор или
                брендированное покрытие в проходном месте: торговый или бизнес-центр,
                отель, жилой комплекс, коворкинг.
              </p>
            </div>
          </div>
          <div className="callout-box">
            <p className="callout-box__label">Механика QR-кода</p>
            <p>
              На каждом объекте — QR-код: отсканировав его, человек сразу переходит на
              страницу заведения, меню, форму бронирования или получает персональную
              скидку, а бизнес получает измеримый рекламный контакт вместо простого
              визуального размещения — видно, сколько людей реально дошли от карты до
              действия.
            </p>
          </div>
          <p className="callout-quote">Бизнес платит за этот контакт, а не за сам материал.</p>
        </section>

        {/* Слайд 3, страница 3 — Персональная карта */}
        <section className="concept reveal" id="product-personal">
          <ProductTag i={3} title="Персональная карта" />
          <h2>Персональная карта</h2>
          <p className="concept__thesis">
            Сервис для частных клиентов, которые хотят сохранить личную историю в
            физическом объекте.
          </p>
          <ul className="callouts">
            {SCENARIOS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="validation__flow">
            <span>3–10 точек: имена, даты, подписи, фото</span>
            <span aria-hidden="true">→</span>
            <span>QR на цифровой альбом (опционально)</span>
            <span aria-hidden="true">→</span>
            <span>Макет от команды</span>
            <span aria-hidden="true">→</span>
            <span>Утверждение и оплата</span>
            <span aria-hidden="true">→</span>
            <span className="validation__kpi">Печать</span>
          </div>
          <p className="pricing-tag">Премиум — в раме или на подрамнике как предмет интерьера</p>
        </section>

        {/* Слайд 3, страница 4 — Узнаю дорогу.рф (функционал) */}
        <section className="concept reveal" id="product-tool">
          <ProductTag i={4} title="«Узнаю дорогу.рф»" />
          <h2>«Узнаю дорогу.рф»</h2>
          <p className="concept__thesis">
            Веб-приложение, соединяющее интерактивную карту города на данных OpenStreetMap
            с краеведческим контентом towiki.ru.
          </p>
          <div className="concept__body concept__body--two">
            <div className="concept__col">
              <h3>Категории объектов</h3>
              <p>
                Улицы, площади, переулки, набережные, микрорайоны и другие — подгружаются
                напрямую из открытого API towiki.ru.
              </p>
            </div>
            <div className="concept__col">
              <h3>Навигация</h3>
              <p>
                Клик по объекту в списке или по подсвечивающейся линии на карте приближает
                нужный участок и открывает карточку статьи с историей, фотографиями и
                ссылками; переход по внутренней ссылке в статье переносит на карту к
                следующему объекту.
              </p>
            </div>
          </div>
          <p className="callout-quote">
            По городу можно «путешествовать» через историю его названий.
          </p>
        </section>

        {/* Слайд 4 — Продукт 4: уже готовый MVP */}
        <section className="concept concept--live reveal" id="product4">
          <SlideTag n={4} title="Продукт 4 уже работает" />
          <h2>Не только описан на слайде</h2>
          <p className="concept__thesis">
            Прототип «Узнаю дорогу.рф» реально собран и доступен: карта Томска на
            OpenStreetMap связана с контентом towiki.ru, навигация по истории города через
            клики по ссылкам внутри статей работает уже сейчас.
          </p>
          <p className="callout-quote">
            Готовое доказательство того, что связка «карта плюс живой контент» технически
            реализуема практически бесплатно — без сервера и без затрат на хостинг.
          </p>
          <div className="concept__body concept__body--two">
            <div className="concept__col">
              <h3>Школы и вузы</h3>
              <p>Лицензии на использование карты на уроках краеведения.</p>
            </div>
            <div className="concept__col">
              <h3>Рекламные агентства</h3>
              <p>Партнёрства — размещение локального бизнеса на карте.</p>
            </div>
          </div>
          <p className="market-slide__note">
            Оба канала можно пилотировать уже сейчас, потому что продукт готов к
            демонстрации, а не находится в разработке.
          </p>
          <a className="btn btn--primary" href={TOOL_URL}>
            Открыть узнаюдорогу.рф →
          </a>
        </section>

        {/* Слайд 5 — Рынок и цены */}
        <section className="market-slide reveal" id="market">
          <SlideTag n={5} title="Рынок и цены" />
          <h2>Где деньги</h2>
          <div className="compare__table">
            <div className="compare__row compare__row--head">
              <span>Направление</span>
              <span>SOM</span>
              <span>Цена</span>
              <span>Маржа с единицы</span>
            </div>
            {PRICING_ROWS.map((row) => (
              <div className="compare__row" key={row.name}>
                <span>{row.name}</span>
                <span>{row.som}</span>
                <span>{row.price}</span>
                <span>{row.margin}</span>
              </div>
            ))}
          </div>
          <p className="market-slide__note">
            Апсейл на рамках поднимает средний чек персональной карты в 2–4 раза.
          </p>
        </section>

        {/* Слайд 6 — Как проверяем спрос */}
        <section className="validation reveal" id="validation">
          <SlideTag n={6} title="Как проверяем спрос" />
          <h2>Деньгами, а не мнениями</h2>
          <div className="validation__flow">
            <span>CustDev по реальному поведению</span>
            <span aria-hidden="true">→</span>
            <span>Лендинг с 3–4 сценариями</span>
            <span aria-hidden="true">→</span>
            <span>Ручной MVP</span>
            <span aria-hidden="true">→</span>
            <span className="validation__kpi">KPI: оплаченный заказ</span>
          </div>
          <p className="validation__caption">
            CustDev строим на реальном поведении: что человек уже покупал, а не «купили бы
            вы такую карту». Главный KPI — оплаченный заказ, а не клики или лайки.
          </p>
          <div className="callout-box">
            <p className="callout-box__label">Отдельно проверили новый сегмент — ролевиков</p>
            <p>
              Провели пять интервью, трое из пяти сами назвали потребность в карте — для
              игры или на память, двое мастеров готовы закладывать её в бюджет мероприятия.
            </p>
            <p className="callout-box__verdict">
              Вывод: перспективный под-сегмент внутри Event Maps и персональной карты —
              нужна выборка побольше.
            </p>
          </div>
        </section>

        {/* Слайд 7 — Результаты */}
        <section className="results reveal" id="results">
          <SlideTag n={7} title="Результаты" />
          <h2>Что уже сделано</h2>
          <ul className="results__list">
            <li>Есть работающий прототип «Узнаю дорогу.рф» с интеграцией OpenStreetMap и towiki.ru.</li>
            <li>Проведены первые CustDev-интервью по трём гипотезам, включая новый сегмент ролевых игр.</li>
            <li>Собрана методология проверки спроса, готовая к масштабированию на все четыре продукта.</li>
          </ul>
        </section>

        {/* Слайд 8 — Каналы выхода на рынок */}
        <section className="channels channels--top reveal" id="channels">
          <SlideTag n={8} title="Каналы выхода на рынок" />
          <h2>Как доберёмся до клиентов</h2>
          <div className="channels__grid">
            <div>
              <p className="channels__label">B2C</p>
              <p>Соцсети, контекстная реклама, блогеры, партнёрства с фотографами, свадебными организаторами, турагентствами.</p>
            </div>
            <div>
              <p className="channels__label">B2B</p>
              <p>Прямые продажи локальному бизнесу и event-агентствам, работа с торговыми и бизнес-центрами, отелями.</p>
            </div>
            <div>
              <p className="channels__label">B2G и B2B — для продукта 4</p>
              <p>Школы, вузы и рекламные агентства.</p>
            </div>
          </div>
        </section>

        {/* Слайд 9 — Команда */}
        <section className="team reveal" id="team">
          <SlideTag n={9} title="Команда" />
          <h2>Команда «Колобок»</h2>
          <ul className="team__grid">
            {TEAM.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>

        {/* Слайд 10 — Запрос к инвесторам + спасибо */}
        <section className="cta reveal" id="ask">
          <SlideTag n={10} title="Запрос к инвесторам" />
          <h2>Инвестиции — на проверку, а не на веру</h2>
          <p>
            Инвестиции нужны на проведение CustDev по всем четырём направлениям,
            производство первых партий MVP и пилотные переговоры со школами и рекламными
            агентствами.
          </p>
          <a className="btn btn--primary" href={TOOL_URL}>
            Открыть узнаюдорогу.рф →
          </a>
          <p className="cta__thanks">Спасибо за внимание — готовы ответить на вопросы.</p>
        </section>
      </main>

      <footer className="landing__footer">
        <span>узнаюдорогу.рф</span>
        <a href={TOOL_URL}>Открыть инструмент →</a>
      </footer>
    </div>
  );
}
