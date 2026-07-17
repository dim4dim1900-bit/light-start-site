import { parseRoute, watchRoute } from './router.js';
import { openLesson, setLessonCompleted, getCourseProgress } from './storage.js';
import { renderMarkdown } from './markdown.js';
import { homeView, coursesView, courseView, lessonView, progressView, helpView, notFoundView, errorView } from './views.js';

const app = document.getElementById('app');
const toast = document.getElementById('toast');
const menuButton = document.querySelector('.menu-button');
const mainNav = document.getElementById('main-nav');
let courses = [];
let lessons = [];

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200);
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Не загружен файл ${path}`);
  return response.json();
}

async function render() {
  const route = parseRoute();
  document.querySelectorAll('.main-nav a').forEach((link) => link.removeAttribute('aria-current'));
  const navMatch = route.name === 'courses' || route.name === 'course' || route.name === 'lesson' ? '#/courses' : route.name === 'progress' ? '#/progress' : route.name === 'help' ? '#/help' : null;
  if (navMatch) document.querySelector(`.main-nav a[href="${navMatch}"]`)?.setAttribute('aria-current', 'page');

  if (route.name === 'home') app.innerHTML = homeView(courses);
  else if (route.name === 'courses') app.innerHTML = coursesView(courses);
  else if (route.name === 'course') app.innerHTML = courseView(courses.find((item) => item.id === route.courseId), lessons);
  else if (route.name === 'progress') app.innerHTML = progressView(courses);
  else if (route.name === 'help') app.innerHTML = helpView();
  else if (route.name === 'lesson') await renderLesson(route);
  else app.innerHTML = notFoundView();

  mainNav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'instant' });
  app.focus({ preventScroll: true });
}

async function renderLesson(route) {
  const course = courses.find((item) => item.id === route.courseId);
  const lesson = lessons.find((item) => item.id === route.lessonId);
  const nextLesson = lessons.find((item) => item.id === route.lessonId + 1) || null;
  if (!course || !lesson) {
    app.innerHTML = notFoundView();
    return;
  }
  openLesson(course.id, lesson.id);
  const response = await fetch(lesson.content);
  if (!response.ok) throw new Error(`Не загружен текст урока ${lesson.id}`);
  const markdown = prepareLessonMarkdown(await response.text());
  app.innerHTML = lessonView(course, lesson, nextLesson, renderMarkdown(markdown));
  bindLessonControls(course, lesson);
}

function prepareLessonMarkdown(markdown) {
  const withoutSources = markdown.split(/\n## Источники урока\s*\n/i)[0];
  const cleaned = withoutSources
    .split('\n')
    .map((line) => line.replace(/\s*После проверки сохраните.*$/i, '').trimEnd())
    .filter((line, index, lines) => line.trim() || lines[index - 1]?.trim())
    .join('\n')
    .trim();
  return localizeCourseTerms(replaceInternalPaths(cleaned));
}

function replaceInternalPaths(markdown) {
  const replacements = new Map([
    ['01_sources/course_01/demo_customer_reviews.md', 'учебные_данные/demo_customer_reviews.md'],
    ['01_sources/course_01/demo_customer_reviews_new_week.md', 'учебные_данные/demo_customer_reviews_new_week.md'],
    ['06_assignments/01_ai_fundamentals/templates/task_card.md', '01_урок/task_card_and_baseline.md'],
    ['06_assignments/01_ai_fundamentals/templates/outcome_and_context.md', '02_урок/outcome_and_context.md'],
    ['06_assignments/01_ai_fundamentals/templates/prompt_v1.md', '03_урок/prompt_v1_and_result.md'],
    ['06_assignments/01_ai_fundamentals/templates/quality_matrix_and_prompt_v2.md', '04_урок/quality_matrix_and_prompt_v2.md'],
    ['06_assignments/01_ai_fundamentals/templates/audit_and_revision.md', '05_урок/audit_and_revision.md'],
    ['06_assignments/01_ai_fundamentals/templates/ai_process', '06_урок/ai-process/']
  ]);
  let result = markdown;
  replacements.forEach((replacement, internalPath) => {
    result = result.replaceAll(internalPath, replacement);
  });
  return result;
}

function localizeCourseTerms(markdown) {
  const protectedCode = [];
  let localized = markdown.replace(/`[^`\n]+`/g, (fragment) => {
    const token = `@@COURSE_CODE_${protectedCode.length}@@`;
    protectedCode.push(fragment);
    return token;
  });
  localized = localized
    .replace(/с baseline/gi, 'с исходным результатом')
    .replace(/из baseline/gi, 'из исходного результата')
    .replace(/получения baseline/gi, 'получения исходного результата')
    .replace(/baseline-запрос/gi, 'исходный запрос')
    .replace(/baseline-ответ/gi, 'исходный ответ')
    .replace(/\bbaseline\b/gi, (term) => term[0] === 'B' ? 'Исходный результат' : 'исходный результат');
  return localized.replace(/@@COURSE_CODE_(\d+)@@/g, (_, index) => protectedCode[Number(index)]);
}

function bindLessonControls(course, lesson) {
  const checks = Array.from(document.querySelectorAll('.js-lesson-check'));
  const button = document.querySelector('.js-complete-lesson');
  const alreadyCompleted = (getCourseProgress(course.id).completedLessons || []).includes(lesson.id);
  if (alreadyCompleted) checks.forEach((check) => { check.checked = true; });
  const update = () => {
    const allChecked = checks.every((check) => check.checked);
    button.disabled = !allChecked && !alreadyCompleted;
  };
  checks.forEach((check) => check.addEventListener('change', update));
  button?.addEventListener('click', () => {
    const isCompleted = (getCourseProgress(course.id).completedLessons || []).includes(lesson.id);
    const saved = setLessonCompleted(course.id, lesson.id, !isCompleted);
    if (!saved) showToast('Браузер не разрешил сохранить отметку. Ваши учебные файлы не затронуты.');
    else showToast(isCompleted ? 'Отметка о завершении снята.' : 'Урок отмечен завершённым. Сохраните паспорт и файл урока.');
    render();
  });
  update();
}

document.addEventListener('click', async (event) => {
  const copyButton = event.target.closest('.js-copy');
  if (!copyButton) return;
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copy);
    showToast('Команда скопирована.');
  } catch {
    showToast('Не удалось скопировать автоматически. Выделите команду вручную.');
  }
});

menuButton.addEventListener('click', () => {
  const open = !mainNav.classList.contains('is-open');
  mainNav.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});

async function init() {
  try {
    [courses, lessons] = await Promise.all([
      fetchJson('data/courses.json'),
      fetchJson('data/course-01-lessons.json')
    ]);
    watchRoute(() => render().catch((error) => { app.innerHTML = errorView(error.message); }));
  } catch (error) {
    app.innerHTML = errorView(error.message);
  }
}

init();
