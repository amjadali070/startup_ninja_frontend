import { type FC, type ReactNode } from "react";
import { FiPlus, FiDownload } from "react-icons/fi";

interface NinjaSalesHeaderProps {
  onNewDeal?: () => void;
  onExport?: () => void;
  newButtonText?: string;
  newButtonIcon?: ReactNode;
  secondaryButtonText?: string;
  secondaryButtonIcon?: ReactNode;
  onSecondaryAction?: () => void;
  title?: string;
  subtitle?: string;
}

const NinjaSalesHeader: FC<NinjaSalesHeaderProps> = ({ 
  onNewDeal, 
  onExport, 
  newButtonText = "New Lead",
  newButtonIcon = <FiPlus className="h-4 w-4" />,
  secondaryButtonText,
  secondaryButtonIcon,
  onSecondaryAction,
  title = "Ninja Sales",
  subtitle = "The Revenue Engine — Accelerating your pipeline with predictive intelligence."
}) => {
  return (
    <div className="mb-6">
      <section className="relative w-full overflow-hidden rounded-[16px] border border-black bg-[url('/images/welcome-bg.png')] bg-cover bg-center bg-no-repeat border-[#ff3b3b47]">
        <div className="absolute inset-0 bg-[#f5212e0d]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-3 px-3 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-plus-jakarta text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-[32px] md:text-[26px] md:leading-[36px]">
                {title}
              </h2>
              <div className="px-2 py-1 bg-[#EF444415] border border-[#EF444425] rounded-lg hidden md:flex items-center">
                <span className="text-[9px] font-black text-[#EF4444] uppercase tracking-widest leading-none">AI REVENUE ENGINE</span>
              </div>
            </div>
            <p className="font-plus-jakarta text-xs leading-5 text-gray-300 sm:text-sm sm:leading-6 md:text-[16px] md:leading-[24px]">
              {subtitle}
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3">
            {onExport && (
              <button
                type="button"
                onClick={onExport}
                className="font-plus-jakarta inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-white/10 sm:px-4 sm:py-2.5 sm:text-sm whitespace-nowrap"
              >
                <FiDownload className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            )}

            {onSecondaryAction && secondaryButtonText && (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="font-plus-jakarta inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-white/10 sm:px-4 sm:py-2.5 sm:text-sm whitespace-nowrap"
              >
                {secondaryButtonIcon}
                <span>{secondaryButtonText}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNewDeal}
              className="font-plus-jakarta inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-3.5 py-2 text-xs font-medium text-white transition-all duration-200 hover:shadow-lg sm:px-6 sm:py-2.5 sm:text-sm shadow-2xl shadow-[#EF444420] whitespace-nowrap"
            >
              {newButtonIcon}
              <span>{newButtonText}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NinjaSalesHeader;
