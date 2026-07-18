import { getCourseProgress } from './storage.js';

export const CURATOR_URL = 'https://chatgpt.com/g/g-6a5a82ec465481918ad747ec7f111bd4-legkii-start-neirokurator-kursa-1';
const COURSE_ID = '01_ai_fundamentals';

const statusMap = {
  planned: { label: 'Скоро', button: 'О курсе', className: '' },
  preparing: { label: 'Тестовый доступ', button: 'Посмотреть', className: 'badge-preparing' },
  available: { label: 'Доступен', button: 'Начать курс', className: 'badge-available' }
};

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function courseAction(course) {
  const progress = getCourseProgress(course.id);
  if (progress.startedAt && course.id === COURSE_ID) return { label: 'Продолжить обучение', href: `#/course/${course.id}/lesson/${progress.lastOpenedLesson || 1}` };
  return { label: statusMap[course.status]?.button || 'О курсе', href: `#/course/${course.id}` };
}

function courseCard(course) {
  const status = statusMap[course.status] || statusMap.planned;
  const action = courseAction(course);
  const progress = getCourseProgress(course.id);
  const percent = course.lessons ? Math.round(((progress.completedLessons || []).length / course.lessons) * 100) : 0;
  return `<article class="course-card" style="--marker:${escapeHtml(course.marker)}">
    <div class="course-card-top"><span class="course-index">${String(course.order).padStart(2, '0')}</span><span class="badge ${status.className}">${status.label}</span></div>
    <div class="course-marker" aria-hidden="true"></div>
    <h3>${escapeHtml(course.title)}</h3>
    <p class="course-promise">${escapeHtml(course.promise)}</p>
    <div class="meta"><span>${escapeHtml(course.level)}</span><span>${course.lessons} уроков</span><span>${escapeHtml(course.time)}</span></div>
    <div class="course-result"><span>Результат</span><strong>${escapeHtml(course.after)}</strong></div>
    ${progress.startedAt ? `<div class="course-progress"><div class="progress-caption"><span>Пройдено</span><strong>${percent}%</strong></div><progress class="progress" max="100" value="${percent}">${percent}%</progress></div>` : ''}
    <a class="button ${course.id === COURSE_ID ? 'button-primary' : ''}" href="${action.href}">${action.label}<span aria-hidden="true">→</span></a>
  </article>`;
}

export function homeView(courses) {
  const firstCourse = courses.find((course) => course.id === COURSE_ID);
  const firstAction = firstCourse ? courseAction(firstCourse) : { label: 'Смотреть курсы', href: '#/courses' };
  return `<section class="hero"><div class="container hero-grid">
    <div class="hero-copy">
      <div class="eyebrow">Самостоятельное обучение с нейрокуратором</div>
      <h1>Осваивайте ИИ через <em>реальные задачи</em></h1>
      <p class="lead">Короткие практические курсы, в которых каждое занятие заканчивается результатом, проверкой и готовым способом работы.</p>
      <div class="cluster"><a class="button button-accent" href="${firstAction.href}">${firstAction.label}<span aria-hidden="true">→</span></a><a class="text-link" href="#how-it-works">Как устроено обучение</a></div>
      <div class="trust-row"><span>В своём темпе</span><span>Практика на вашей задаче</span><span>Без живого куратора</span></div>
    </div>
    <aside class="hero-panel">
      <div class="hero-panel-kicker">Первый маршрут</div>
      <span class="hero-course-number">01</span>
      <h2>Основы работы с нейросетями</h2>
      <p>От случайных запросов — к понятному и проверяемому рабочему процессу.</p>
      <div class="hero-metrics"><span><strong>6</strong> уроков</span><span><strong>7–9</strong> часов</span></div>
      <a class="button button-light button-block" href="#/course/${COURSE_ID}">Посмотреть программу</a>
    </aside>
  </div></section>
  <section class="proof-strip"><div class="container proof-grid"><div><strong>01</strong><span>Изучаете только нужное</span></div><div><strong>02</strong><span>Сразу применяете</span></div><div><strong>03</strong><span>Получаете разбор</span></div><div><strong>04</strong><span>Сохраняете результат</span></div></div></section>
  <section id="how-it-works" class="section"><div class="container"><div class="section-heading"><div><div class="eyebrow">Методика</div><h2>Один понятный цикл<br>в каждом уроке</h2></div><p class="lead">Не нужно запоминать десятки функций. Вы проходите один и тот же рабочий путь, пока он не станет привычным.</p></div><div class="steps-grid"><div class="step"><span class="step-number">01</span><h3>Разобраться</h3><p>Короткий материал без лишней теории.</p></div><div class="step"><span class="step-number">02</span><h3>Сделать</h3><p>Практика на реальной или учебной задаче.</p></div><div class="step"><span class="step-number">03</span><h3>Проверить</h3><p>Нейрокуратор покажет ошибки и следующий шаг.</p></div><div class="step"><span class="step-number">04</span><h3>Сохранить</h3><p>Готовый результат остаётся у вас.</p></div></div></div></section>
  <section class="section section-alt"><div class="container"><div class="section-heading"><div><div class="eyebrow">Программы</div><h2>Начните с нужного навыка</h2></div><p class="lead">Первый курс создаёт фундамент. Следующие программы расширяют его под конкретные инструменты и задачи.</p></div><div class="cards-grid">${courses.slice(0, 3).map(courseCard).join('')}</div><div class="section-action"><a class="button button-primary" href="#/courses">Все направления<span aria-hidden="true">→</span></a></div></div></section>
  <section class="section curator-section"><div class="container curator-grid"><div><div class="eyebrow eyebrow-light">Личный нейрокуратор</div><h2>Поддержка остаётся рядом на каждом шаге</h2><p>Нейрокуратор объясняет, задаёт вопросы, проверяет работу и помогает увидеть ошибку. Итоговое решение всегда остаётся за вами.</p></div><div class="curator-card"><span class="curator-mark">AI</span><div><strong>Работает в вашем ChatGPT</strong><p>Ваш прогресс переносится между уроками с помощью паспорта обучения.</p></div><a class="button button-light" href="${CURATOR_URL}" target="_blank" rel="noopener noreferrer">Открыть нейрокуратора</a></div></div></section>`;
}

export function coursesView(courses) {
  return `<section class="page"><div class="container"><div class="page-head page-head-wide"><div class="eyebrow">Лёгкий старт</div><h1>Практические курсы<br><em>по работе с ИИ</em></h1><p class="lead">Выберите навык и двигайтесь от первого упражнения к собственному рабочему процессу.</p></div><div class="cards-grid">${courses.map(courseCard).join('')}</div></div></section>`;
}

export function courseView(course, lessons) {
  if (!course) return notFoundView();
  if (course.id !== COURSE_ID) {
    return `<section class="page"><div class="container"><div class="coming-soon"><span class="badge">${statusMap[course.status].label}</span><div class="eyebrow">Новое направление</div><h1>${escapeHtml(course.title)}</h1><p class="lead">${escapeHtml(course.promise)}</p><div class="course-result"><span>После курса</span><strong>${escapeHtml(course.after)}</strong></div><div class="meta"><span>${escapeHtml(course.level)}</span><span>${course.lessons} уроков</span><span>${escapeHtml(course.time)}</span></div><a class="button" href="#/courses">← Вернуться к курсам</a></div></div></section>`;
  }
  const progress = getCourseProgress(course.id);
  const completed = new Set(progress.completedLessons || []);
  const actionLesson = progress.lastOpenedLesson || 1;
  const completedCount = completed.size;
  return `<section class="course-hero"><div class="container course-hero-grid"><div><div class="eyebrow eyebrow-light">Курс 01 · Тестовый доступ</div><h1>${escapeHtml(course.title)}</h1><p class="lead">${escapeHtml(course.promise)}</p><div class="cluster"><a class="button button-accent" href="#/course/${course.id}/lesson/${actionLesson}">${progress.startedAt ? 'Продолжить обучение' : 'Начать с первого урока'}<span aria-hidden="true">→</span></a><a class="button button-outline-light" href="downloads/LIGHT_START_COURSE_01_STARTER_KIT.zip" download>Скачать материалы</a></div></div><div class="course-hero-result"><span>Итог курса</span><strong>Собственный проверенный процесс работы с ИИ</strong><p>Не набор советов, а способ решать одну вашу регулярную задачу.</p></div></div></section>
  <section class="section"><div class="container course-program-grid"><div><div class="section-heading compact"><div><div class="eyebrow">Программа</div><h2>Шесть шагов к рабочей системе</h2></div><p class="lead">Проходите последовательно. Результат каждого урока становится основой следующего.</p></div><div class="lesson-list">${lessons.map((lesson) => `<article class="lesson-item ${completed.has(lesson.id) ? 'is-complete' : ''}"><span class="lesson-number">${String(lesson.id).padStart(2, '0')}</span><div><span class="lesson-duration">${escapeHtml(lesson.duration)}</span><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.goal)}</p></div>${completed.has(lesson.id) ? '<span class="lesson-done">Готово</span>' : `<a class="button button-small" href="#/course/${course.id}/lesson/${lesson.id}">Открыть урок</a>`}</article>`).join('')}</div></div>
  <aside class="course-sidebar"><div class="progress-card"><div class="progress-ring" style="--progress:${Math.round((completedCount / 6) * 360)}deg"><span>${completedCount}/6</span></div><div><span class="eyebrow">Ваш прогресс</span><h3>${completedCount ? 'Продолжайте в своём темпе' : 'Всё готово для старта'}</h3></div><progress class="progress" max="6" value="${completedCount}">${completedCount} из 6</progress><a class="button button-primary button-block" href="#/course/${course.id}/lesson/${actionLesson}">${progress.startedAt ? 'Продолжить' : 'Открыть урок 1'}</a></div><div class="privacy-note"><strong>Ваши материалы остаются у вас</strong><p>Сайт не загружает и не хранит документы. Для проверки вы самостоятельно передаёте обезличенные материалы нейрокуратору.</p></div></aside></div></section>`;
}

function templateUrl(item) {
  if (item.endsWith('/')) return 'downloads/templates/LESSON_06_AI_PROCESS_TEMPLATES.zip';
  return `downloads/templates/${item}`;
}

function friendlyFileLabel(item) {
  if (item.includes('ПАСПОРТ_ОБУЧЕНИЯ')) return 'Паспорт обучения';
  if (item.includes('task_card_and_baseline')) return 'Карточка задачи и исходный результат';
  if (item.includes('outcome_and_context')) return 'Описание результата и контекста';
  if (item.includes('prompt_v1_and_result')) return 'Первая версия запроса и результат';
  if (item.includes('quality_matrix_and_prompt_v2')) return 'Проверка качества и улучшенный запрос';
  if (item.includes('audit_and_revision')) return 'Аудит и исправленная версия';
  if (item.includes('demo_customer_reviews_new_week')) return 'Новая неделя учебных отзывов';
  if (item.includes('demo_customer_reviews')) return 'Учебные отзывы клиентов';
  if (item.endsWith('/')) return 'Комплект рабочего процесса';
  return 'Материал урока';
}

function labeledFiles(items, mode = 'upload') {
  if (!items?.length) return '<p class="supporting-text">Дополнительные материалы не понадобятся.</p>';
  return `<div class="resource-list">${items.map((item) => {
    const label = friendlyFileLabel(item);
    let description = 'Возьмите заполненную работу, которую сохранили после предыдущего урока.';
    let actionLabel = 'Восстановить шаблон';
    if (mode === 'practice') {
      description = 'Необязательный пример, на котором можно повторить демонстрацию.';
      actionLabel = 'Скачать пример';
    } else if (mode === 'save') {
      description = item.includes('ПАСПОРТ_ОБУЧЕНИЯ') ? 'Нейрокуратор поможет создать его после проверки.' : 'Скачайте заготовку и заполните её по ходу урока.';
      actionLabel = item.includes('ПАСПОРТ_ОБУЧЕНИЯ') ? 'Скачать заготовку' : 'Скачать рабочий шаблон';
    } else if (mode === 'archive') {
      description = item.includes('ПАСПОРТ_ОБУЧЕНИЯ') ? 'Обновите и сохраните, чтобы продолжить обучение в любой момент.' : 'Сохраните проверенную версию в своей папке курса.';
    }
    const passportAction = item.includes('ПАСПОРТ_ОБУЧЕНИЯ') && mode === 'archive'
      ? `<button class="button button-small js-copy" type="button" data-copy="ОБНОВИ ПАСПОРТ">Скопировать команду</button><a class="button button-small button-primary" href="${CURATOR_URL}" target="_blank" rel="noopener noreferrer">Обновить с нейрокуратором</a>`
      : '';
    const downloadAction = mode === 'archive'
      ? ''
      : `<a class="resource-link" href="${templateUrl(item)}" download>${actionLabel}<span aria-hidden="true">↓</span></a>`;
    return `<div class="resource-card"><span class="resource-icon" aria-hidden="true">${mode === 'practice' ? '✦' : '↳'}</span><div class="resource-copy"><strong>${escapeHtml(label)}</strong><span>${description}</span><div class="resource-actions">${downloadAction}${passportAction}</div></div></div>`;
  }).join('')}</div>`;
}

function commandRow(command, label = 'Скопировать') {
  return `<div class="command-row"><span>${escapeHtml(command)}</span><button class="command-copy js-copy" type="button" data-copy="${escapeHtml(command)}">${label}</button></div>`;
}

export function lessonView(course, lesson, nextLesson, renderedContent) {
  if (!course || !lesson) return notFoundView();
  const progress = getCourseProgress(course.id);
  const completed = (progress.completedLessons || []).includes(lesson.id);
  const previous = lesson.id > 1 ? `#/course/${course.id}/lesson/${lesson.id - 1}` : `#/course/${course.id}`;
  const next = lesson.id < 6 ? `#/course/${course.id}/lesson/${lesson.id + 1}` : '#/progress';
  const coursePercent = Math.round((lesson.id / 6) * 100);
  const inputFiles = lesson.uploadToCurator?.length
    ? `<p class="supporting-text">Подготовьте результаты предыдущих уроков:</p>${labeledFiles(lesson.uploadToCurator, 'upload')}`
    : '<p class="supporting-text">Для первого урока ничего загружать не нужно.</p>';
  const practice = lesson.practiceFiles?.length ? `<div class="optional-material"><span>По желанию</span>${labeledFiles(lesson.practiceFiles, 'practice')}</div>` : '';
  const nextFiles = nextLesson ? `<div class="next-prep"><strong>Перед следующим уроком</strong><p>Сохраните результаты этого занятия и обновлённый паспорт обучения.</p></div>` : '';
  const checklist = lesson.checklist.map((label, index) => `<label class="check-row"><input type="checkbox" class="js-lesson-check" data-index="${index}"><span>${escapeHtml(label)}</span></label>`).join('');

  return `<section class="lesson-page"><div class="container">
    <nav class="lesson-toolbar" aria-label="Навигация по курсу"><a class="back-link" href="${previous}">← Назад к программе</a><span>Курс 1 · Урок ${lesson.id} из 6</span></nav>
    <header class="lesson-hero"><div><div class="eyebrow">Урок ${String(lesson.id).padStart(2, '0')}</div><h1>${escapeHtml(lesson.title)}</h1><div class="lesson-meta"><span>${escapeHtml(lesson.duration)}</span><span>Практическое занятие</span><span>В своём темпе</span></div></div><div class="lesson-outcome"><span>После урока</span><strong>${escapeHtml(lesson.goal)}</strong></div></header>
    <div class="course-line"><span style="width:${coursePercent}%"></span></div>
    <div class="lesson-layout">
      <main class="lesson-main"><article class="lesson-content markdown">${renderedContent}</article></main>
      <aside class="lesson-side">
        <div class="journey-card"><div class="journey-head"><div><span class="eyebrow">Ваш маршрут</span><h2>Четыре шага урока</h2></div><span class="journey-count">${completed ? 'Готово' : '1 / 4'}</span></div>
          <details class="journey-step" open><summary><span>1</span><div><small>Начало</small><strong>Откройте нейрокуратора</strong></div></summary><div class="journey-body">${inputFiles}${commandRow(lesson.startCommand)}<a class="button button-primary button-block" href="${CURATOR_URL}" target="_blank" rel="noopener noreferrer">Перейти к нейрокуратору<span aria-hidden="true">↗</span></a><p class="safe-hint">Передавайте только те документы, которые можно безопасно использовать для обучения.</p></div></details>
          <details class="journey-step"><summary><span>2</span><div><small>Практика</small><strong>Выполните задание</strong></div></summary><div class="journey-body">${labeledFiles([lesson.artifact], 'save')}${practice}</div></details>
          <details class="journey-step"><summary><span>3</span><div><small>Обратная связь</small><strong>Получите проверку</strong></div></summary><div class="journey-body"><p class="supporting-text">Загрузите заполненную работу нейрокуратору и отправьте команду:</p>${commandRow(lesson.reviewCommand)}<a class="button button-primary button-block" href="${CURATOR_URL}" target="_blank" rel="noopener noreferrer">Открыть проверку<span aria-hidden="true">↗</span></a></div></details>
          <details class="journey-step"><summary><span>4</span><div><small>Завершение</small><strong>Сохраните результат</strong></div></summary><div class="journey-body">${labeledFiles(lesson.saveAfterLesson, 'archive')}${nextFiles}</div></details>
        </div>
        <section class="completion-card"><div><span class="eyebrow">Готовность</span><h3>Проверьте себя</h3></div><div class="checklist">${checklist}</div><button class="button button-accent button-block js-complete-lesson" type="button" data-course="${course.id}" data-lesson="${lesson.id}" ${completed ? '' : 'disabled'}>${completed ? 'Урок завершён' : 'Завершить урок'}</button><p>Отметка сохраняется только в вашем браузере.</p></section>
        <a class="next-lesson-link" href="${next}"><span>${lesson.id < 6 ? 'Следующий урок' : 'Мой прогресс'}</span><strong>${lesson.id < 6 ? escapeHtml(nextLesson?.shortTitle || '') : 'Посмотреть результаты'}</strong><b aria-hidden="true">→</b></a>
      </aside>
    </div>
  </div></section>`;
}

export function progressView(courses) {
  const started = courses.map((course) => ({ course, progress: getCourseProgress(course.id) })).filter((item) => item.progress.startedAt);
  if (!started.length) return `<section class="page"><div class="container"><div class="page-head"><div class="eyebrow">Личный кабинет</div><h1>Ваш прогресс</h1><p class="lead">Откройте первый урок, и здесь появится быстрый путь к продолжению обучения.</p></div><div class="empty-state"><span>01</span><div><h2>Вы ещё не начали курс</h2><p>Выберите первое направление и двигайтесь в удобном темпе.</p><a class="button button-primary" href="#/courses">Выбрать курс</a></div></div></div></section>`;
  return `<section class="page"><div class="container"><div class="page-head"><div class="eyebrow">Личный кабинет</div><h1>Ваш прогресс</h1><p class="lead">Здесь хранится навигация. Сами учебные результаты остаются в сохранённых вами документах.</p></div><div class="course-progress-list">${started.map(({ course, progress }) => { const count = (progress.completedLessons || []).length; const percent = Math.round((count / course.lessons) * 100); return `<article class="progress-card progress-card-wide"><div class="progress-ring" style="--progress:${Math.round((count / course.lessons) * 360)}deg"><span>${percent}%</span></div><div><span class="eyebrow">Продолжить обучение</span><h2>${escapeHtml(course.title)}</h2><p>${count} из ${course.lessons} уроков завершено</p><div class="cluster"><a class="button button-primary" href="#/course/${course.id}/lesson/${progress.lastOpenedLesson || 1}">Продолжить</a><a class="button" href="#/course/${course.id}">Программа курса</a></div></div></article>`; }).join('')}</div><div class="passport-note"><span>Как не потерять прогресс</span><div><h2>Сохраняйте паспорт обучения</h2><p>После каждого занятия нейрокуратор обновляет краткую историю вашего обучения. Она поможет продолжить с нужного места даже в новом диалоге.</p><a class="text-link" href="#/help">Как восстановить обучение →</a></div></div></div></section>`;
}

export function helpView() {
  return `<section class="page"><div class="container help-grid"><div class="page-head"><div class="eyebrow">Поддержка</div><h1>Помощь без сложных инструкций</h1><p class="lead">Всё, что нужно знать о материалах, нейрокураторе и сохранении прогресса.</p></div><div class="faq"><details open><summary>С чего начать первый курс?</summary><p>Откройте первый урок и следуйте четырём шагам в блоке «Ваш маршрут». В начале ничего загружать не нужно.</p></details><details><summary>Где выполняются задания?</summary><p>Нейрокуратор помогает подготовить задание и проверяет результат. Некоторые контрольные запуски выполняются в отдельном обычном чате ChatGPT — сайт подскажет, когда это понадобится.</p></details><details><summary>Как продолжить обучение в новом диалоге?</summary><p>Загрузите актуальный паспорт обучения и результаты предыдущих занятий. Нейрокуратор восстановит вашу точку обучения.</p></details><details><summary>Что произойдёт после очистки браузера?</summary><p>Исчезнут только отметки на сайте. Сохранённые вами работы и паспорт обучения останутся на компьютере.</p></details><details><summary>Можно ли использовать рабочие документы?</summary><p>Только если у вас есть право их передавать. Удалите имена, контакты, пароли, коммерческие секреты и сведения третьих лиц. Для первого прохождения безопаснее взять учебный пример.</p></details><details><summary>Кто решает, когда переходить дальше?</summary><p>Вы. Нейрокуратор показывает ошибки и риски, но решение о завершении урока остаётся за обучающимся.</p></details></div></div></section>`;
}

export function notFoundView() {
  return `<section class="page"><div class="container"><div class="empty-state"><span>404</span><div><h1>Страница не найдена</h1><p>Вернитесь к программам и продолжите обучение.</p><a class="button button-primary" href="#/courses">Открыть курсы</a></div></div></div></section>`;
}

export function errorView(message) {
  return `<section class="page"><div class="container error-state"><div class="eyebrow">Не удалось открыть страницу</div><h1>Попробуем ещё раз</h1><p>${escapeHtml(message)}</p><button class="button button-primary" type="button" onclick="location.reload()">Повторить</button></div></section>`;
}
