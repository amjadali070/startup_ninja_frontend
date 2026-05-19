import { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

const LIVECHAT_LICENSE = 19730364;

declare global {
  interface Window {
    __lc: Record<string, unknown>;
    LiveChatWidget: {
      _q: unknown[][];
      _h: unknown;
      _v: string;
      on(...a: unknown[]): void;
      once(...a: unknown[]): void;
      off(...a: unknown[]): void;
      get(...a: unknown[]): unknown;
      call(...a: unknown[]): void;
      init(): void;
    };
  }
}

export default function LiveChatWidget() {
  const { user } = useAuth();
  const injected = useRef(false);

  // Inject the exact LiveChat embed script once
  useEffect(() => {
    if (injected.current || document.getElementById("lc-tracking")) return;
    injected.current = true;

    window.__lc = window.__lc || {};
    window.__lc.license = LIVECHAT_LICENSE;
    window.__lc.integration_name = "manual_onboarding";
    window.__lc.product_name = "livechat";

    (function (n: Window, t: Document, c: typeof Array.prototype.slice) {
      function i(args: unknown[]) {
        return e._h
          ? (e as unknown as { _h: (...a: unknown[]) => unknown })._h.apply(null, args)
          : e._q.push(args);
      }
      const e = {
        _q: [] as unknown[],
        _h: null as unknown,
        _v: "2.0",
        on: function () { i(["on", c.call(arguments)]); },
        once: function () { i(["once", c.call(arguments)]); },
        off: function () { i(["off", c.call(arguments)]); },
        get: function () {
          if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
          return i(["get", c.call(arguments)]);
        },
        call: function () { i(["call", c.call(arguments)]); },
        init: function () {
          const s = t.createElement("script");
          s.id = "lc-tracking";
          s.async = true;
          s.type = "text/javascript";
          s.src = "https://cdn.livechatinc.com/tracking.js";
          t.head.appendChild(s);
        },
      };
      if (!n.__lc.asyncInit) e.init();
      n.LiveChatWidget = n.LiveChatWidget || (e as unknown as Window["LiveChatWidget"]);
    })(window, document, [].slice);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync visitor identity when user logs in — only non-empty values
  useEffect(() => {
    if (!window.LiveChatWidget) return;
    try {
      if (user?.email) {
        window.LiveChatWidget.call("set_customer_email", user.email);
      }
      const name = (user?.fullname || user?.name || "").trim();
      if (name) {
        window.LiveChatWidget.call("set_customer_name", name);
      }
    } catch {
      // widget not ready yet — queued calls flush on load
    }
  }, [user]);

  return (
    <noscript>
      <a href={`https://www.livechat.com/chat-with/${LIVECHAT_LICENSE}/`} rel="nofollow">
        Chat with us
      </a>
    </noscript>
  );
}
