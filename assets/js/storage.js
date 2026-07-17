const STORAGE_KEY = 'light_start_progress_v1';

function blankState() {
  return { schemaVersion: 1, courses: {} };
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    if (parsed?.schemaVersion !== 1 || typeof parsed.courses !== 'object') return blankState();
    return parsed;
  } catch {
    return blankState();
  }
}

function write(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function getCourseProgress(courseId) {
  const state = read();
  return state.courses[courseId] || { startedAt: null, lastOpenedLesson: 1, completedLessons: [], updatedAt: null };
}

export function openLesson(courseId, lessonId) {
  const state = read();
  const current = state.courses[courseId] || { startedAt: new Date().toISOString(), completedLessons: [] };
  state.courses[courseId] = {
    ...current,
    startedAt: current.startedAt || new Date().toISOString(),
    lastOpenedLesson: Number(lessonId),
    completedLessons: Array.from(new Set(current.completedLessons || [])),
    updatedAt: new Date().toISOString()
  };
  return write(state);
}

export function setLessonCompleted(courseId, lessonId, completed) {
  const state = read();
  const current = state.courses[courseId] || { startedAt: new Date().toISOString(), lastOpenedLesson: Number(lessonId), completedLessons: [] };
  const completedLessons = new Set(current.completedLessons || []);
  if (completed) completedLessons.add(Number(lessonId));
  else completedLessons.delete(Number(lessonId));
  state.courses[courseId] = {
    ...current,
    startedAt: current.startedAt || new Date().toISOString(),
    lastOpenedLesson: Number(lessonId),
    completedLessons: Array.from(completedLessons).sort((a, b) => a - b),
    updatedAt: new Date().toISOString()
  };
  return write(state);
}

export function resetProgress() {
  return write(blankState());
}
