import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

export const WEB_BUILDER_SERVICE_URL = import.meta.env
  .VITE_WEB_BUILDER_SERVICE_URL;

export const PLATFORM_META: Record<
  string,
  { icon: React.ElementType; color: string; name: string; bgClass: string }
> = {
  facebook: {
    icon: FaFacebook,
    color: "#1877F2",
    name: "Facebook",
    bgClass: "bg-[#1877F2]/10",
  },
  instagram: {
    icon: FaInstagram,
    color: "#E4405F",
    name: "Instagram",
    bgClass: "bg-[#E4405F]/10",
  },
  x: {
    icon: FaXTwitter,
    color: "#000000",
    name: "X",
    bgClass: "bg-gray-800/20",
  },
  twitter: {
    icon: FaXTwitter,
    color: "#1DA1F2",
    name: "Twitter",
    bgClass: "bg-[#1DA1F2]/10",
  },
  linkedin: {
    icon: FaLinkedin,
    color: "#0A66C2",
    name: "LinkedIn",
    bgClass: "bg-[#0A66C2]/10",
  },
};

