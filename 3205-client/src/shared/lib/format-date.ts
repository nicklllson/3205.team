const formatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'short',
  timeStyle: 'medium',
});

export const formatDateTime = (iso: string): string => formatter.format(new Date(iso));
