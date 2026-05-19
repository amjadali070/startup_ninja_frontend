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

/**
 * Convert a date+time string in a given IANA timezone to a UTC ISO string.
 * e.g. buildUTCFromTimezone('2025-06-01', '14:30', 'America/New_York') → '2025-06-01T18:30:00.000Z'
 *
 * Falls back to treating the input as local browser time if the timezone is
 * invalid or the Intl API is unavailable.
 */
export const buildUTCFromTimezone = (
  dateStr: string,
  timeStr: string,
  ianaTimezone: string
): string => {
  if (!dateStr || !timeStr) return '';

  try {
    // Build a wall-clock datetime string in the target timezone and parse it
    // using Intl to find the UTC equivalent.
    const localISOLike = `${dateStr}T${timeStr}:00`;

    // Use Intl.DateTimeFormat to find the UTC offset at that moment in the
    // given timezone by formatting a candidate UTC date and comparing.
    // We iterate with a binary-search-style approach using the offset hint.
    const candidateDate = new Date(localISOLike + 'Z'); // treat as UTC first

    // Get the offset by formatting the candidate in the target timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: ianaTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(candidateDate);
    const get = (type: string) => parts.find(p => p.type === type)?.value ?? '0';

    const tzYear = parseInt(get('year'), 10);
    const tzMonth = parseInt(get('month'), 10) - 1;
    const tzDay = parseInt(get('day'), 10);
    const tzHour = parseInt(get('hour'), 10) % 24; // handle 24 → 0
    const tzMin = parseInt(get('minute'), 10);
    const tzSec = parseInt(get('second'), 10);

    // Difference between what the formatter shows and what we want
    const [wantYear, wantMonth, wantDay] = dateStr.split('-').map(Number);
    const [wantHour, wantMin] = timeStr.split(':').map(Number);

    const wantMs = Date.UTC(wantYear, wantMonth - 1, wantDay, wantHour, wantMin, 0);
    const gotMs = Date.UTC(tzYear, tzMonth, tzDay, tzHour, tzMin, tzSec);

    // offset = UTC_candidate - tz_displayed  →  actual_UTC = want + offset
    const offsetMs = candidateDate.getTime() - gotMs;
    const actualUTC = new Date(wantMs + offsetMs);

    return actualUTC.toISOString();
  } catch {
    // Fallback: treat as local browser time
    const fallback = buildLocalDate(dateStr, timeStr);
    return fallback.toISOString();
  }
};

/**
 * Format a UTC ISO string for display in a given IANA timezone.
 * Returns "DD-Mon-YYYY at HH:mm (TZ)" format.
 */
export const formatInTimezone = (
  iso: string,
  ianaTimezone: string,
  showTz = true
): string => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    const datePart = new Intl.DateTimeFormat('en-GB', {
      timeZone: ianaTimezone,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
    const timePart = new Intl.DateTimeFormat('en-GB', {
      timeZone: ianaTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
    const tzLabel = showTz
      ? ` (${ianaTimezone.split('/').pop()?.replace('_', ' ') ?? ianaTimezone})`
      : '';
    return `${datePart} at ${timePart}${tzLabel}`;
  } catch {
    return formatDateDDMonYYYY(iso) + ' at ' + formatTimeHHmm(iso);
  }
};


