/**
 * Canonical timezone options used across the app.
 *
 * `value`  – IANA timezone identifier (stored in DB, used for UTC conversion)
 * `label`  – Human-friendly display string shown in the UI
 * `legacy` – Old display-string value that may already be stored in the DB
 *            (allows backward-compatible migration)
 * `offset` – Approximate UTC offset label for display purposes
 */

export interface TimezoneOption {
  value: string;   // IANA id
  label: string;   // display label
  legacy?: string; // old stored value (migration)
  offset: string;  // e.g. "UTC-8"
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  // Americas
  { value: 'America/Los_Angeles', label: 'PST – Pacific Standard Time',       legacy: 'PST (Pacific Standard Time)',       offset: 'UTC-8'  },
  { value: 'America/Denver',      label: 'MST – Mountain Standard Time',      legacy: 'MST (Mountain Standard Time)',      offset: 'UTC-7'  },
  { value: 'America/Chicago',     label: 'CST – Central Standard Time',       legacy: 'CST (Central Standard Time)',       offset: 'UTC-6'  },
  { value: 'America/New_York',    label: 'EST – Eastern Standard Time',       legacy: 'EST (Eastern Standard Time)',       offset: 'UTC-5'  },
  { value: 'America/Sao_Paulo',   label: 'BRT – Brasília Time',               offset: 'UTC-3'  },
  { value: 'America/Argentina/Buenos_Aires', label: 'ART – Argentina Time',   offset: 'UTC-3'  },
  { value: 'America/Toronto',     label: 'EST – Eastern Time (Toronto)',       offset: 'UTC-5'  },
  { value: 'America/Vancouver',   label: 'PST – Pacific Time (Vancouver)',     offset: 'UTC-8'  },
  { value: 'America/Mexico_City', label: 'CST – Central Time (Mexico City)',   offset: 'UTC-6'  },

  // Europe / Africa
  { value: 'Europe/London',       label: 'GMT – Greenwich Mean Time',         legacy: 'GMT (Greenwich Mean Time)',         offset: 'UTC+0'  },
  { value: 'Europe/Paris',        label: 'CET – Central European Time',       legacy: 'CET (Central European Time)',       offset: 'UTC+1'  },
  { value: 'Europe/Berlin',       label: 'CET – Central European Time (Berlin)', offset: 'UTC+1' },
  { value: 'Europe/Moscow',       label: 'MSK – Moscow Standard Time',        offset: 'UTC+3'  },
  { value: 'Africa/Cairo',        label: 'EET – Eastern European Time (Cairo)', offset: 'UTC+2' },
  { value: 'Africa/Johannesburg', label: 'SAST – South Africa Standard Time', offset: 'UTC+2'  },
  { value: 'Africa/Lagos',        label: 'WAT – West Africa Time',            offset: 'UTC+1'  },
  { value: 'Africa/Nairobi',      label: 'EAT – East Africa Time',            offset: 'UTC+3'  },

  // Middle East
  { value: 'Asia/Dubai',          label: 'GST – Gulf Standard Time',          offset: 'UTC+4'  },
  { value: 'Asia/Riyadh',         label: 'AST – Arabia Standard Time',        offset: 'UTC+3'  },
  { value: 'Asia/Tehran',         label: 'IRST – Iran Standard Time',         offset: 'UTC+3:30' },

  // Asia
  { value: 'Asia/Karachi',        label: 'PKT – Pakistan Standard Time',      offset: 'UTC+5'  },
  { value: 'Asia/Kolkata',        label: 'IST – India Standard Time',         offset: 'UTC+5:30' },
  { value: 'Asia/Dhaka',          label: 'BST – Bangladesh Standard Time',    offset: 'UTC+6'  },
  { value: 'Asia/Bangkok',        label: 'ICT – Indochina Time',              offset: 'UTC+7'  },
  { value: 'Asia/Singapore',      label: 'SGT – Singapore Time',              offset: 'UTC+8'  },
  { value: 'Asia/Shanghai',       label: 'CST – China Standard Time',         offset: 'UTC+8'  },
  { value: 'Asia/Tokyo',          label: 'JST – Japan Standard Time',         legacy: 'JST (Japan Standard Time)',         offset: 'UTC+9'  },
  { value: 'Asia/Seoul',          label: 'KST – Korea Standard Time',         offset: 'UTC+9'  },

  // Pacific / Oceania
  { value: 'Australia/Sydney',    label: 'AEST – Australian Eastern Standard Time', legacy: 'AEST (Australian Eastern Standard Time)', offset: 'UTC+10' },
  { value: 'Pacific/Auckland',    label: 'NZST – New Zealand Standard Time',  offset: 'UTC+12' },
  { value: 'Pacific/Honolulu',    label: 'HST – Hawaii Standard Time',        offset: 'UTC-10' },

  // UTC
  { value: 'UTC',                 label: 'UTC – Coordinated Universal Time',  offset: 'UTC+0'  },
];

/** Fallback IANA timezone when the user has not set one yet */
export const FALLBACK_IANA = 'UTC';

/** Group timezones by region for grouped <select> rendering */
export const TIMEZONE_GROUPS: { label: string; options: TimezoneOption[] }[] = [
  {
    label: 'Americas',
    options: TIMEZONE_OPTIONS.filter(o =>
      o.value.startsWith('America/') || o.value.startsWith('Pacific/Honolulu')
    ),
  },
  {
    label: 'Europe & Africa',
    options: TIMEZONE_OPTIONS.filter(o =>
      o.value.startsWith('Europe/') || o.value.startsWith('Africa/')
    ),
  },
  {
    label: 'Middle East',
    options: TIMEZONE_OPTIONS.filter(o =>
      ['Asia/Dubai', 'Asia/Riyadh', 'Asia/Tehran'].includes(o.value)
    ),
  },
  {
    label: 'Asia',
    options: TIMEZONE_OPTIONS.filter(o =>
      o.value.startsWith('Asia/') &&
      !['Asia/Dubai', 'Asia/Riyadh', 'Asia/Tehran'].includes(o.value)
    ),
  },
  {
    label: 'Pacific & Oceania',
    options: TIMEZONE_OPTIONS.filter(o =>
      o.value.startsWith('Australia/') ||
      (o.value.startsWith('Pacific/') && o.value !== 'Pacific/Honolulu')
    ),
  },
  {
    label: 'UTC',
    options: TIMEZONE_OPTIONS.filter(o => o.value === 'UTC'),
  },
];
