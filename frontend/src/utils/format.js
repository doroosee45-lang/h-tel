export function formatCurrency(amount, currency = 'CDF') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount || 0));
}

export function formatDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

export function formatDateTime(value) {
  return formatDate(value, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function sentenceCase(value) {
  if (!value) return '—';
  return String(value).replace(/_/g, ' ');
}

export function fullName(person) {
  if (!person) return '—';
  const parts = [person.firstName, person.lastName].filter(Boolean);
  return parts.join(' ') || person.name || person.email || '—';
}
