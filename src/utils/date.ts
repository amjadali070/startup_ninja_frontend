export const formatDateDDMonYYYY = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day}-${mon}-${year}`;
};

export const formatTimeHHmm = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const buildLocalDate = (dateStr: string, timeStr: string) => {
  if (!dateStr || !timeStr) return new Date('');
  const [y, m, d] = String(dateStr).split('-').map(Number);
  const [hh, mm] = String(timeStr).split(':').map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return new Date('');
  return new Date(y, m - 1, d, hh, mm, 0, 0);
};


