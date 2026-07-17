import { getCourseProgress } from './storage.js';

export const CURATOR_URL = 'https://chatgpt.com/g/g-6a5a82ec465481918ad747ec7f111bd4-legkii-start-neirokurator-kursa-1';
const COURSE_ID = '01_ai_fundamentals';

const statusMap = {
  planned: { label: 'Запланирован', button: 'О курсе', className: '' },
  preparing: { label: 'Готовится к запуску', button: 'Подробнее', className: 'badge-preparing' },
  available: { label: 'Доступен', button: 'Начать курс', className: 'badge-available' }
};

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function courseAction(course) {
  const progress = getCourseProgress(course.id);
  if (progress.startedAt && course.id === COURSE_ID) return { label: 'Продолжить', href: `#/course/${course.id}/lesson/${progress.lastOpenedLesson || 1}` };
  return { label: statusMap[course.status]?.button || 'О курсе', href: `#/course/${course.id}` };
}

function courseCard(course) {
  const status = statusMap[course.status] || statusMap.planned;
  const action = courseAction(course);
  const progress = getCourseProgress(course.id);
  const percent = course.lessons ? Math.round(((progress.completedLessons || []).length / course.lessons) * 100) : 0;
  return `<article class="course-card" style="--marker:${escapeHtml(course.marker)}">
    <div class="course-marker" aria-hidden="true"></div>
    <span class="badge ${status.className}">${status.label}</span>
    <h3>${escapeHtml(course.title)}</h3>
    <p>${escapeHtml(course.promise)}</p>
    <div class="meta"><span>${escapeHtml(course.level)}</span><span>${course.lessons} уроков</span><span>${escapeHtml(course.time)}</span></div>
    <p><strong>После курса:</strong> ${escapeHtml(course.after)}</p>
    ${progress.startedAt ? `<div><div class="cluster small"><span>Прогресс</span><strong>${percent}%</strong></div><progress class="progress" max="100" value="${percent}">${percent}%</progress></div>` : ''}
    <a class="button ${course.id === COURSE_ID ? 'button-primary' : ''}" href="${action.href}">${action.label}</a>
  </article>`;
}

export function homeView(courses) {
  return `<section class="hero"><div class="container hero-grid">
    <div class="hero-copy"><div class="eyebrow">Практические курсы для быстрого освоения навыков работы с нейросетями</div><h1>ЛЁГКИЙ <span>СТАРТ</span></h1><p class="lead">Выберите курс, выполняйте практические задания и получайте обратную связь от GPTs-нейрокуратора в своём аккаунте.</p><div class="cluster"><a class="button button-accent" href="#/courses">Выбрать курс</a><a class="button button-ghost" href="#how-it-works">Как проходит обучение</a></div></div>
    <aside class="hero-panel"><strong>Вы не просто читаете уроки</strong><ol><li>Берёте реальную задачу.</li><li>Создаёте проверяемый результат.</li><li>Исправляете ошибки с нейрокуратором.</li><li>Сохраняете готовый рабочий процесс.</li></ol></aside>
  </div></section>
  <section id="how-it-works" class="section section-alt"><div class="container"><div class="page-head"><div class="eyebrow">Методика</div><h2>Один цикл в каждом уроке</h2></div><div class="steps-grid"><div class="step"><span class="step-number">01</span><h3>Изучить</h3><p>Короткий материал и пример.</p></div><div class="step"><span class="step-number">02</span><h3>Выполнить</h3><p>Практика на собственной задаче.</p></div><div class="step"><span class="step-number">03</span><h3>Проверить</h3><p>Разбор с GPTs-нейрокуратором.</p></div><div class="step"><span class="step-number">04</span><h3>Сохранить</h3><p>Файл урока и обновлённый паспорт.</p></div></div></div></section>
  <section class="section"><div class="container"><div class="page-head"><div class="eyebrow">Каталог</div><h2>Начните с нужного навыка</h2><p class="lead">Первый курс создаёт базовый процесс работы с AI. Остальные направления будут добавляться последовательно.</p></div><div class="cards-grid">${courses.slice(0, 3).map(courseCard).join('')}</div><div class="cluster" style="margin-top:24px"><a class="button button-primary" href="#/courses">Все курсы</a></div></div></section>
  <section class="section section-alt"><div class="container two-column"><div><div class="eyebrow">GPTs-нейрокуратор</div><h2>Подсказки и проверка — в вашем ChatGPT</h2><p class="lead">Нейрокуратор объясняет материал, проверяет работу по рубрике и показывает ошибки. Он не выполняет итоговую работу вместо вас.</p></div><div class="panel stack"><strong>Ответственность остаётся у обучающегося</strong><p class="muted">Оценка нейрокуратора носит рекомендательный характер. Вы сами решаете, когда переходить дальше и как применять результат.</p><a class="button" href="${CURATOR_URL}" target="_blank" rel="noopener noreferrer">Открыть нейрокуратора</a></div></div></section>`;
}

export function coursesView(courses) {
  return `<section class="page"><div class="container"><div class="page-head"><div class="eyebrow">Лёгкий старт</div><h1>Каталог курсов</h1><p class="lead">Практические программы самостоятельного обучения: от базовой постановки задач до видео, приложений и автоматизации.</p></div><div class="cards-grid">${courses.map(courseCard).join('')}</div></div></section>`;
}

export function courseView(course, lessons) {
  if (!course) return notFoundView();
  if (course.id !== COURSE_ID) {
    return `<section class="page"><div class="container"><div class="page-head"><span class="badge">${statusMap[course.status].label}</span><h1>${escapeHtml(course.title)}</h1><p class="lead">${escapeHtml(course.promise)}</p></div><div class="panel stack"><h2>Что вы получите</h2><p>${escapeHtml(course.after)}</p><div class="meta"><span>${escapeHtml(course.level)}</span><span>${course.lessons} уроков</span><span>${escapeHtml(course.time)}</span></div><p class="notice">Программа курса будет опубликована после подготовки материалов и нейрокуратора.</p><a class="button" href="#/courses">Вернуться в каталог</a></div></div></section>`;
  }
  const progress = getCourseProgress(course.id);
  const completed = new Set(progress.completedLessons || []);
  const actionLesson = progress.lastOpenedLesson || 1;
  return `<section class="page"><div class="container two-column"><div class="stack"><div class="page-head"><span class="badge badge-preparing">Готовится к запуску</span><h1>${escapeHtml(course.title)}</h1><p class="lead">${escapeHtml(course.promise)}</p></div><div class="stats"><div class="stat"><span class="muted small">Уроки</span><strong>6</strong><span>практических этапов</span></div><div class="stat"><span class="muted small">Нагрузка</span><strong>7–9 ч</strong><span>в своём темпе</span></div><div class="stat"><span class="muted small">Результат</span><strong>1</strong><span>готовый AI-процесс</span></div></div><div><h2>Программа</h2><div class="lesson-list">${lessons.map((lesson) => `<div class="lesson-item"><span class="lesson-number">${String(lesson.id).padStart(2, '0')}</span><div><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.goal)}</p></div>${completed.has(lesson.id) ? '<span class="lesson-done">Завершён</span>' : `<a class="button" href="#/course/${course.id}/lesson/${lesson.id}">Открыть</a>`}</div>`).join('')}</div></div></div>
  <aside class="panel sticky-panel stack"><h3>Перед началом</h3><ol><li>Скачайте стартовый комплект.</li><li>Создайте папку для работ.</li><li>Откройте нейрокуратора.</li></ol><a class="button button-primary button-block" href="#/course/${course.id}/lesson/${actionLesson}">${progress.startedAt ? 'Продолжить курс' : 'Посмотреть урок 1'}</a><a class="button button-block" href="downloads/LIGHT_START_COURSE_01_STARTER_KIT.zip" download>Скачать комплект</a><a class="button button-block" href="${CURATOR_URL}" target="_blank" rel="noopener noreferrer">Открыть нейрокуратора</a><p class="notice small">Личные документы не загружаются на сайт. Передавайте их в ChatGPT только после обезличивания.</p></aside></div></section>`;
}

function chips(items) {
  if (!items?.length) return '<span class="muted small">На первом уроке файлы не требуются.</span>';
  return items.map((item) => `<span class="file-chip">${escapeHtml(item)}</span>`).join('');
}

function templateUrl(item) {
  if (item.endsWith('/')) return 'downloads/templates/LESSON_06_AI_PROCESS_TEMPLATES.zip';
  return `downloads/templates/${item}`;
}

function labeledFiles(items, mode = 'upload') {
  if (!items?.length) return '<span class="muted small">Дополнительные файлы не требуются.</span>';
  return items.map((item) => {
    let label = 'Файл предыдущего урока';
    let description = 'Возьмите заполненный файл, который сохранили после предыдущего урока.';
    let downloadLabel = mode === 'save' ? 'Скачать шаблон для заполнения' : 'Нет файла? Скачать пустой шаблон';
    if (mode === 'practice') {
      label = 'Учебные данные для примера';
      description = 'Скачайте файл, если хотите повторить демонстрацию из урока.';
      downloadLabel = 'Скачать учебные данные';
    }
    if (item.includes('ПАСПОРТ_ОБУЧЕНИЯ')) label = 'Обновлённый паспорт обучения';
    else if (item.endsWith('/')) {
      label = 'Комплект итогового AI-процесса';
      downloadLabel = 'Скачать комплект шаблонов';
    } else if (/^0\d_урок\//.test(item)) label = 'Итоговая работа урока';

    const lessonMatch = item.match(/^(\d\d)_урок\//);
    if (mode === 'save') {
      description = item.includes('ПАСПОРТ_ОБУЧЕНИЯ')
        ? 'Попросите нейрокуратора создать обновлённый файл и скачайте его в папку курса.'
        : 'Заполните шаблон в ходе урока и сохраните проверенную версию на компьютере.';
      if (item.includes('ПАСПОРТ_ОБУЧЕНИЯ')) downloadLabel = 'Скачать пустой паспорт';
    } else if (mode === 'archive') {
      description = item.includes('ПАСПОРТ_ОБУЧЕНИЯ')
        ? 'Попросите нейрокуратора создать обновлённый файл и скачайте его в папку курса.'
        : 'Сохраните на компьютере заполненную версию, которую только что проверили.';
    } else if (item.includes('ПАСПОРТ_ОБУЧЕНИЯ')) {
      description = 'Возьмите версию, которую нейрокуратор обновил после предыдущей проверки.';
    } else if (lessonMatch) {
      description = `Возьмите заполненный файл, сохранённый после урока ${Number(lessonMatch[1])}.`;
    }

    const passportAction = item.includes('ПАСПОРТ_ОБУЧЕНИЯ') && (mode === 'save' || mode === 'archive')
      ? `<button class="button button-small js-copy" type="button" data-copy="ОБНОВИ ПАСПОРТ">Скопировать «ОБНОВИ ПАСПОРТ»</button><a class="button button-small" href="${CURATOR_URL}" target="_blank" rel="noopener noreferrer">Создать файл в GPTs</a>`
      : '';
    const downloadAction = mode === 'archive' && !item.includes('ПАСПОРТ_ОБУЧЕНИЯ')
      ? ''
      : `<a class="button button-small" href="${templateUrl(item)}" download>${downloadLabel}</a>`;

    return `<div class="file-entry"><strong>${label}</strong><span class="file-chip">${escapeHtml(item)}</span><span class="muted small">${description}</span><div class="file-actions">${downloadAction}${passportAction}</div></div>`;
  }).join('');
}

export function lessonView(course, lesson, nextLesson, renderedContent) {
  if (!course || !lesson) return notFoundView();
  const progress = getCourseProgress(course.id);
  const completed = (progress.completedLessons || []).includes(lesson.id);
  const previous = lesson.id > 1 ? `#/course/${course.id}/lesson/${lesson.id - 1}` : `#/course/${course.id}`;
  const next = lesson.id < 6 ? `#/course/${course.id}/lesson/${lesson.id + 1}` : '#/progress';
  const inputFiles = lesson.uploadToCurator?.length
    ? `<p class="muted small">Загрузите заполненные файлы с предыдущих уроков:</p>${labeledFiles(lesson.uploadToCurator, 'upload')}`
    : '<span class="muted small">Для первого урока загружать файлы не нужно.</span>';
  const practice = lesson.practiceFiles?.length
    ? `<section class="panel stack"><span class="eyebrow">Материалы</span><h3>Учебные данные для примера</h3>${labeledFiles(lesson.practiceFiles, 'practice')}</section>`
    : '';
  const nextFiles = nextLesson
    ? `<section class="panel stack"><h3>Для следующего урока подготовьте</h3>${labeledFiles(nextLesson.uploadToCurator, 'upload')}</section>`
    : '';
  const checklist = lesson.checklist.map((label, index) =>
    `<label class="check-row"><input type="checkbox" class="js-lesson-check" data-index="${index}"><span>${escapeHtml(label)}</span></label>`
  ).join('');

  return `<section class="page"><div class="container">
    <div class="lesson-toolbar"><a class="button button-ghost" href="${previous}">← Назад</a><span class="badge">Урок ${lesson.id} из 6 · ${escapeHtml(lesson.duration)}</span></div>
    <div class="lesson-layout"><article class="lesson-content markdown">${renderedContent}</article><aside class="lesson-side">
      <section class="panel stack"><div><span class="eyebrow">Результат урока</span><h3>${escapeHtml(lesson.goal)}</h3></div></section>
      <section class="panel stack"><span class="eyebrow">Шаг 1</span><h3>Начните урок с нейрокуратором</h3>${inputFiles}<div class="copy-row"><code>${escapeHtml(lesson.startCommand)}</code><button class="button js-copy" type="button" data-copy="${escapeHtml(lesson.startCommand)}">Копировать</button></div><a class="button button-primary button-block" href="${CURATOR_URL}" target="_blank" rel="noopener noreferrer">Открыть нейрокуратора</a><p class="notice small">Проверьте право на передачу документов и удалите персональные данные, пароли, токены и секреты.</p></section>
      ${practice}
      <section class="panel stack"><span class="eyebrow">Шаг 2</span><h3>Выполните задание и заполните файл</h3>${labeledFiles([lesson.artifact], 'save')}</section>
      <section class="panel stack"><span class="eyebrow">Шаг 3</span><h3>Отправьте работу на проверку</h3><p class="muted small">Загрузите в нейрокуратор заполненную итоговую работу этого урока.</p>${labeledFiles([lesson.artifact], 'upload')}<div class="copy-row"><code>${escapeHtml(lesson.reviewCommand)}</code><button class="button js-copy" type="button" data-copy="${escapeHtml(lesson.reviewCommand)}">Копировать</button></div><a class="button button-primary button-block" href="${CURATOR_URL}" target="_blank" rel="noopener noreferrer">Открыть проверку в GPTs</a></section>
      <section class="panel stack"><span class="eyebrow">Шаг 4</span><h3>После проверки сохраните</h3>${labeledFiles(lesson.saveAfterLesson, 'archive')}</section>
      ${nextFiles}
      <section class="panel stack"><h3>Завершение урока</h3><div class="checklist">${checklist}</div><button class="button button-accent button-block js-complete-lesson" type="button" data-course="${course.id}" data-lesson="${lesson.id}" ${completed ? '' : 'disabled'}>${completed ? 'Снять отметку о завершении' : 'Завершить урок'}</button><p class="muted small">Решение о завершении принимаете вы. Сохраните паспорт и работу на компьютере.</p></section>
      <a class="button button-block" href="${next}">${lesson.id < 6 ? 'Следующий урок →' : 'Открыть мой прогресс'}</a>
    </aside></div>
  </div></section>`;
}

export function progressView(courses) {
  const started = courses.map((course) => ({ course, progress: getCourseProgress(course.id) })).filter((item) => item.progress.startedAt);
  if (!started.length) return `<section class="page"><div class="container"><div class="page-head"><div class="eyebrow">Навигация</div><h1>Мой прогресс</h1><p class="lead">Сайт запоминает открытый курс и завершённые уроки только в этом браузере.</p></div><div class="empty-state stack"><h2>Пока нет начатых курсов</h2><p class="muted">Откройте первый урок, и здесь появится кнопка продолжения.</p><a class="button button-primary" href="#/courses">Выбрать курс</a></div></div></section>`;
  return `<section class="page"><div class="container"><div class="page-head"><div class="eyebrow">Навигация</div><h1>Мой прогресс</h1><p class="lead">Эти отметки помогают вернуться к нужному уроку. Содержательный прогресс хранится в ваших файлах.</p></div><div class="course-progress-list">${started.map(({ course, progress }) => { const count = (progress.completedLessons || []).length; const percent = Math.round((count / course.lessons) * 100); return `<article class="panel stack"><div class="cluster"><span class="badge">${count} из ${course.lessons} уроков</span><strong>${escapeHtml(course.title)}</strong></div><progress class="progress" max="100" value="${percent}">${percent}%</progress><div class="cluster"><a class="button button-primary" href="#/course/${course.id}/lesson/${progress.lastOpenedLesson || 1}">Продолжить</a><a class="button" href="#/course/${course.id}">Открыть программу</a></div></article>`; }).join('')}</div><div class="panel stack" style="margin-top:24px"><h2>Сохраняйте паспорт обучения</h2><p>После каждого урока сохраняйте <code>ПАСПОРТ_ОБУЧЕНИЯ.md</code> и итоговый файл на своём компьютере. Они восстановят содержательный прогресс даже после очистки браузера.</p><a class="button" href="#/help">Как восстановить обучение</a></div></div></section>`;
}

export function helpView() {
  return `<section class="page"><div class="container"><div class="page-head"><div class="eyebrow">Поддержка самостоятельного обучения</div><h1>Помощь</h1><p class="lead">Короткие ответы о файлах, нейрокураторе, безопасности и восстановлении прогресса.</p></div><div class="faq"><details open><summary>С чего начать первый курс?</summary><p>Скачайте стартовый комплект, распакуйте его в отдельную папку и откройте урок 1. Для первого шага файлы загружать не нужно.</p></details><details><summary>Где выполняются задания?</summary><p>Обсуждение и проверка проходят в GPTs-нейрокураторе. Контрольные запросы уроков 3–6 запускаются в новом обычном чате ChatGPT, чтобы учебные инструкции не влияли на результат.</p></details><details><summary>Как продолжить в новом диалоге?</summary><p>Загрузите актуальный <code>ПАСПОРТ_ОБУЧЕНИЯ.md</code> и итоговые файлы, перечисленные на странице следующего урока. Нейрокуратор восстановит точку обучения по ним.</p></details><details><summary>Что делать после очистки браузера?</summary><p>Навигационные отметки сайта исчезнут, но учебные результаты останутся в файлах. Откройте нужный курс, затем восстановите обучение по паспорту.</p></details><details><summary>Можно ли загружать рабочие документы?</summary><p>Только если у вас есть право их передавать. Сначала удалите ФИО, контакты, пароли, токены, коммерческие секреты и сведения третьих лиц. Для первого прохождения безопаснее использовать синтетический пример.</p></details><details><summary>Кто решает, можно ли перейти дальше?</summary><p>Вы. Проверка нейрокуратора носит рекомендательный характер. Он объясняет риски и ошибки, но не запрещает переход к следующему уроку.</p></details></div></div></section>`;
}

export function notFoundView() {
  return `<section class="page"><div class="container"><div class="empty-state stack"><div class="eyebrow">Ошибка 404</div><h1>Страница не найдена</h1><p class="muted">Проверьте адрес или вернитесь в каталог курсов.</p><a class="button button-primary" href="#/courses">Открыть каталог</a></div></div></section>`;
}

export function errorView(message) {
  return `<section class="page"><div class="container error-state"><h1>Не удалось загрузить сайт</h1><p>${escapeHtml(message)}</p><button class="button button-primary" type="button" onclick="location.reload()">Повторить</button></div></section>`;
}
