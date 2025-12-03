import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

export const WEB_BUILDER_SERVICE_URL = import.meta.env.VITE_WEB_BUILDER_SERVICE_URL;

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

export const PLAN_FEATURES = {
  Free: [
    "Limited AI Chat access",
    "50 AI credits/month",
    "Basic Image Generation",
    "1 Website project",
    "Startup Ninja subdomain",
    "Basic Social Media scheduling",
  ],
  Basic: [
    "Limited AI Chat access",
    "100 AI credits/month",
    "Standard Image Generation",
    "3 Website projects",
    "Startup Ninja subdomain",
    "Standard Social Media scheduling",
  ],
  Pro: [
    "Unlimited AI Chat",
    "500 AI credits/month",
    "Advanced Image Generation",
    "Unlimited website projects",
    "Custom domain support",
    "Full Social Media Pro access",
    "Priority email support",
    "SEO optimization tools",
  ],
  Enterprise: [
    "Everything in Pro",
    "2000 AI credits/month",
    "White-label options",
    "Team management (up to 10 users)",
    "Advanced analytics",
    "Priority phone support",
    "Custom integrations",
    "Dedicated account manager",
    "SLA guarantee",
  ],
};
