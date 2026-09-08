import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drop-in replacement for useState that persists the value to localStorage
 * (debounced) and restores it on mount. Meant for in-progress input the user
 * would be upset to lose — chat prompts, form drafts — if a session refresh
 * or an expired-session redirect interrupts them mid-input. Call the
 * returned `clearDraft()` after a successful submit so the draft doesn't
 * reappear on the next visit.
 *
 * Value is always a string — for multi-field forms, store
 * `JSON.stringify(formData)` and parse it back out.
 *
 * Note: localStorage is per-browser-profile, not per logged-in user — on a
 * shared machine where multiple accounts log in, drafts aren't isolated
 * between them. Include a user/session id in `key` if that isolation matters
 * for a given surface.
 */
export function useDraftPersistence(
  key: string,
  initialValue = "",
  debounceMs = 500
) {
  const storageKey = `draft:${key}`;
  const [value, setValue] = useState<string>(() => {
    try {
      return localStorage.getItem(storageKey) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      try {
        if (value) {
          localStorage.setItem(storageKey, value);
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {
        // localStorage unavailable (private mode, quota exceeded) — draft
        // persistence is a convenience, not critical, so fail silently.
      }
    }, debounceMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, storageKey, debounceMs]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return [value, setValue, clearDraft] as const;
}
