import { type FC } from "react";
import { BiPlus } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";

interface NinjaFinanceHeaderProps {
  onConnectBank: () => void;
  onExport?: () => void;
}

const NinjaFinanceHeader: FC<NinjaFinanceHeaderProps> = ({ onConnectBank, onExport }) => {
  return (
    <div className="mb-6">
      <section className="relative w-full overflow-hidden rounded-[16px] border border-black bg-[url('/images/welcome-bg.png')] bg-cover bg-center bg-no-repeat border-[#ff3b3b47]">
        <div className="absolute inset-0 bg-[#f5212e0d]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-3 px-3 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
          <div className="flex-1 min-w-0">
            <h2 className="font-plus-jakarta w-full text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-[32px] md:text-[26px] md:leading-[36px]">
              Ninja Finance
            </h2>
            <p className="font-plus-jakarta mt-1 text-xs leading-5 text-gray-300 sm:mt-2 sm:text-sm sm:leading-6 md:text-[16px] md:leading-[24px]">
              The Control Center — Real-time liquidity surveillance
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            {onExport && (
              <button
                type="button"
                onClick={onExport}
                className="font-plus-jakarta inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-white/10 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <FiDownload className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            )}
            <button
              type="button"
              onClick={onConnectBank}
              className="font-plus-jakarta inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:shadow-lg sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <BiPlus className="h-4 w-4" />
              <span>Connect Bank</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NinjaFinanceHeader;
