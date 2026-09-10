import { type FC, type ReactNode } from "react";

interface LegalPageBannerProps {
  title: string;
  subtitle: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

/**
 * Shared hero banner used across every Ninja Legal page (dashboard + sub-pages), matching
 * the same background-image/border/overlay treatment Social Media Studio and Ninja Ops use
 * for their own module-level headers.
 */
const LegalPageBanner: FC<LegalPageBannerProps> = ({ title, subtitle, action }) => {
  return (
    <div className="mb-6">
      <section className="relative w-full overflow-hidden rounded-[16px] border border-black bg-[url('/images/welcome-bg.png')] bg-cover bg-center bg-no-repeat border-[#ff3b3b47]">
        <div className="absolute inset-0 bg-[#f5212e0d]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-3 px-3 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
          <div className="flex-1 min-w-0">
            <h2 className="font-plus-jakarta w-full text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-[32px] md:text-[26px] md:leading-[36px]">
              {title}
            </h2>
            <p className="font-plus-jakarta mt-1 text-xs leading-5 text-gray-300 sm:mt-2 sm:text-sm sm:leading-6 md:text-[16px] md:leading-[24px]">
              {subtitle}
            </p>
          </div>
          {action && (
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={action.onClick}
                className="font-plus-jakarta inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:shadow-lg sm:px-4 sm:py-2.5 sm:text-sm"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LegalPageBanner;
