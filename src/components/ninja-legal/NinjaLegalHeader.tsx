import { type FC } from "react";
import { BiPlus } from "react-icons/bi";
import LegalPageBanner from "./LegalPageBanner";

interface NinjaLegalHeaderProps {
  onNewContract: () => void;
}

const NinjaLegalHeader: FC<NinjaLegalHeaderProps> = ({ onNewContract }) => {
  return (
    <LegalPageBanner
      title="Ninja Legal"
      subtitle="Your AI Legal Assistant — Draft, Review, and Compare Contracts with Confidence"
      action={{ label: "New Contract", onClick: onNewContract, icon: <BiPlus className="h-4 w-4" /> }}
    />
  );
};

export default NinjaLegalHeader;
