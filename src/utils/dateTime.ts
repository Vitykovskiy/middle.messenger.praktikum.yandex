export function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  // Проверка «сегодня»
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isToday) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Проверка «текущая неделя»
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // понедельник

  if (date >= startOfWeek) {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' }); // пн, вт, ср...
  }

  // Остальные даты
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
