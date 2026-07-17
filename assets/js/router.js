export function parseRoute() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const parts = raw.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'courses' && parts.length === 1) return { name: 'courses' };
  if (parts[0] === 'course' && parts[1] && parts[2] === 'lesson' && parts[3]) {
    return { name: 'lesson', courseId: parts[1], lessonId: Number(parts[3]) };
  }
  if (parts[0] === 'course' && parts[1]) return { name: 'course', courseId: parts[1] };
  if (parts[0] === 'progress') return { name: 'progress' };
  if (parts[0] === 'help') return { name: 'help' };
  return { name: 'notFound' };
}

export function watchRoute(handler) {
  window.addEventListener('hashchange', handler);
  handler();
}
