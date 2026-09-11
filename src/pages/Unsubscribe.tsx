import { type FC, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { userService } from "../services/user";
import LoadingSpinner from "../components/LoadingSpinner";

// ─── States ──────────────────────────────────────────────────────────────────
type Status = "loading" | "success" | "already" | "invalid" | "error";

// ─── Minimal brand logo (text fallback) ──────────────────────────────────────
const Logo: FC = () => (
  <Link to="/" className="inline-flex items-center gap-2 group">
    <span className="text-white font-extrabold text-xl tracking-tight group-hover:text-red-400 transition-colors">
      Startup<span className="text-red-500">Ninja</span>
    </span>
  </Link>
);

// ─── Icon components (inline SVG — no extra deps) ────────────────────────────
const IconCheck: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#16a34a" fillOpacity="0.15" />
    <path
      d="M7 12.5l3.5 3.5 6.5-7"
      stroke="#22c55e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconInfo: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#2563eb" fillOpacity="0.15" />
    <path
      d="M12 8v4m0 4h.01"
      stroke="#60a5fa"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconWarning: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#dc2626" fillOpacity="0.15" />
    <path
      d="M12 8v4m0 4h.01"
      stroke="#f87171"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconSpinner: FC = () => <LoadingSpinner />;

// ─── Content map ─────────────────────────────────────────────────────────────
const CONTENT: Record<
  Status,
  {
    Icon: FC;
    title: string;
    body: (email?: string) => string;
    accent: string;
  }
> = {
  loading: {
    Icon: IconSpinner,
    title: "Processing…",
    body: () => "Please wait while we update your email preferences.",
    accent: "text-gray-400",
  },
  success: {
    Icon: IconCheck,
    title: "You've been unsubscribed",
    body: (email) =>
      email
        ? `${email} has been removed from our mailing list. You won't receive any more marketing emails from us.`
        : "You have been successfully removed from our mailing list.",
    accent: "text-green-400",
  },
  already: {
    Icon: IconInfo,
    title: "Already unsubscribed",
    body: (email) =>
      email
        ? `${email} is already unsubscribed from our emails. No further action is needed.`
        : "This address is already unsubscribed from our emails.",
    accent: "text-blue-400",
  },
  invalid: {
    Icon: IconWarning,
    title: "Invalid or expired link",
    body: () =>
      "This unsubscribe link is invalid or has been tampered with. Please use the link directly from your email.",
    accent: "text-red-400",
  },
  error: {
    Icon: IconWarning,
    title: "Something went wrong",
    body: () =>
      "We couldn't process your request right now. Please try again later or contact support.",
    accent: "text-red-400",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const Unsubscribe: FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState<string | undefined>();
  const [message, setMessage] = useState<string>("");
  const calledRef = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-invoke
    if (calledRef.current) return;
    calledRef.current = true;

    if (!token) {
      setStatus("invalid");
      return;
    }

    const run = async () => {
      try {
        const res = await userService.unsubscribe(token);

        if (res.success) {
          setEmail(res.email);
          setStatus(res.alreadyUnsubscribed ? "already" : "success");
        } else {
          const msg = res.message?.toLowerCase() ?? "";
          if (msg.includes("invalid") || msg.includes("tampered") || msg.includes("token")) {
            setStatus("invalid");
          } else if (msg.includes("not found")) {
            setStatus("invalid");
          } else {
            setStatus("error");
          }
          setMessage(res.message ?? "");
        }
      } catch {
        setStatus("error");
      }
    };

    run();
  }, [token]);

  const content = CONTENT[status];
  const { Icon } = content;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* ── Top bar ── */}
      <header className="w-full border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Logo />
        </div>
      </header>

      {/* ── Main card ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-[#111111] shadow-2xl overflow-hidden">
            {/* Accent bar */}
            <div
              className={`h-1 w-full ${
                status === "success"
                  ? "bg-green-500"
                  : status === "already"
                  ? "bg-blue-500"
                  : status === "loading"
                  ? "bg-gradient-to-r from-red-600 to-red-400 animate-pulse"
                  : "bg-red-600"
              }`}
            />

            <div className="px-8 py-10 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <Icon />
              </div>

              {/* Title */}
              <h1
                className={`text-xl font-bold mb-3 ${content.accent}`}
              >
                {content.title}
              </h1>

              {/* Body */}
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {message || content.body(email)}
              </p>

              {/* Actions */}
              {status !== "loading" && (
                <div className="flex flex-col gap-3">
                  {/* Go to homepage */}
                  <Link
                    to="/"
                    className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
                  >
                    Back to homepage
                  </Link>

                  {/* Re-subscribe hint — only shown on success */}
                  {status === "success" && (
                    <p className="text-xs text-gray-600 mt-1">
                      Changed your mind?{" "}
                      <Link
                        to="/settings"
                        className="text-gray-400 hover:text-white underline transition-colors"
                      >
                        Re-subscribe in Settings
                      </Link>
                    </p>
                  )}

                  {/* Contact support on error */}
                  {status === "error" && (
                    <a
                      href="mailto:support@startupninja.ai"
                      className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
                    >
                      Contact support
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fine print */}
          <p className="text-center text-xs text-gray-600 mt-6">
            © {new Date().getFullYear()} Startup Ninja. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Unsubscribe;
