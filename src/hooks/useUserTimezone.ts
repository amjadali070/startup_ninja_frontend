/**
 * useUserTimezone
 *
 * Reads the user's saved timezone preference and exposes:
 *  - ianaTimezone: a valid IANA timezone string (e.g. "America/Los_Angeles")
 *  - displayLabel: human-friendly label (e.g. "PST – America/Los_Angeles")
 *  - isSet: whether the user has explicitly saved a timezone
 *  - refresh: re-fetch from the API
 *
 * The resolved timezone is cached in localStorage under "userTimezone" so it
 * is available synchronously on the first render (no loading flash).
 */

import { useCallback, useEffect, useState } from 'react';
import { userService } from '../services/user';
import { TIMEZONE_OPTIONS, FALLBACK_IANA } from '../constants/timezones';

const STORAGE_KEY = 'userTimezone';

export interface UserTimezoneResult {
  ianaTimezone: string;
  displayLabel: string;
  isSet: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const resolveIana = (stored: string): string => {
  if (!stored) return '';
  // If it already looks like an IANA id (contains '/') use it directly
  if (stored.includes('/')) return stored;
  // Otherwise look it up in the options map (legacy display-string values)
  const match = TIMEZONE_OPTIONS.find(
    (o) => o.value === stored || o.label === stored || o.legacy === stored
  );
  return match?.value ?? '';
};

export const useUserTimezone = (): UserTimezoneResult => {
  const cached = localStorage.getItem(STORAGE_KEY) ?? '';
  const [rawTimezone, setRawTimezone] = useState<string>(cached);
  const [loading, setLoading] = useState(!cached);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getPreferences();
      if (res.success && res.data?.timezone) {
        const tz = res.data.timezone;
        setRawTimezone(tz);
        localStorage.setItem(STORAGE_KEY, tz);
      }
    } catch {
      // silently ignore – fallback to cached/empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cached) {
      fetch();
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ianaTimezone = resolveIana(rawTimezone) || FALLBACK_IANA;
  const isSet = !!resolveIana(rawTimezone);

  const option = TIMEZONE_OPTIONS.find((o) => o.value === ianaTimezone);
  const displayLabel = option?.label ?? ianaTimezone;

  return { ianaTimezone, displayLabel, isSet, loading, refresh: fetch };
};
