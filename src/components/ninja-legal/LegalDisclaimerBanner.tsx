import { type FC } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface LegalDisclaimerBannerProps {
  /** Denser inline style for embedding inside a document preview/export, vs. the default card banner */
  variant?: "card" | "inline";
  className?: string;
}

const DISCLAIMER_TEXT =
  "AI-generated draft, not legal advice. This tool assists founders with a starting point — it is not a substitute for a qualified lawyer. Have a lawyer review any document before signing or relying on it, especially for significant money, ongoing obligations, employment, intellectual property, or regulatory matters.";

const LegalDisclaimerBanner: FC<LegalDisclaimerBannerProps> = ({ variant = "card", className = "" }) => {
  if (variant === "inline") {
    return (
      <p className={`text-[10px] leading-relaxed text-gray-500 ${className}`}>
        <strong className="text-gray-700">⚠ Disclaimer:</strong> {DISCLAIMER_TEXT}
      </p>
    );
  }

  return (
    <div className={`flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 ${className}`}>
      <FiAlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-200/90 leading-relaxed">
        <strong className="text-amber-300">Not legal advice.</strong> {DISCLAIMER_TEXT}
      </p>
    </div>
  );
};

export default LegalDisclaimerBanner;
