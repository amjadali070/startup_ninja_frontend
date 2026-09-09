import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { FiLinkedin } from 'react-icons/fi';

// Theme colors centralization (match existing usage)
export const THEME_COLORS = {
  red: '#D60000',
  redHover: '#b80000',
  white: '#FFFFFF',
  grayBorder: '#1E1E1E',
  lightred: '#DE05001A',
};

export type PlatformId = 'facebook' | 'instagram' | 'x' | 'linkedin' | 'twitter';

export interface PlatformMeta {
  id: PlatformId;
  name: string;
  icon: any; // React.ElementType but keep loose to avoid type issues across files
  colors: {
    brand: string;
    selectedBg: string; // tailwind class
    unselectedBg: string; // tailwind class
    selectedBorder: string; // tailwind class
    unselectedBorder: string; // tailwind class
    iconColor: string; // tailwind class
    textColor: string; // tailwind class
    background: string; // CSS background value
  };
}

export const PLATFORM_LIST: PlatformMeta[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: FiLinkedin,
    colors: {
      brand: '#0A66C2',
      unselectedBg: 'bg-[#0A66C2]/10',
      selectedBg: 'bg-gradient-to-r from-[#0A66C2] to-[#004182] shadow-[inset_0_-8px_24px_rgba(0,0,0,0.35)]',
      unselectedBorder: 'border-[#0A66C2]/30',
      selectedBorder: 'border-[#004182]/80',
      iconColor: 'text-white',
      textColor: 'text-white',
      background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), linear-gradient(90deg, #0077B5 0%, #005986 100%)',
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: FaFacebook,
    colors: {
      brand: '#1877F2',
      unselectedBg: 'bg-[#1877F2]/10',
      selectedBg: 'bg-gradient-to-r from-[#1877F2] to-[#0b5bd3] shadow-[inset_0_-8px_24px_rgba(0,0,0,0.35)]',
      unselectedBorder: 'border-[#1877F2]/30',
      selectedBorder: 'border-[#0b5bd3]/80',
      iconColor: 'text-white',
      textColor: 'text-white',
      background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), linear-gradient(90deg, #1776F0 0%, #0C5CB8 100%)',
    },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: FaInstagram,
    colors: {
      brand: '#E4405F',
      unselectedBg: 'bg-gradient-to-br from-[#E4405F]/10 to-[#F77737]/10',
      selectedBg: 'bg-gradient-to-r from-[#E4405F] via-[#F77737] to-[#7B2CBF] shadow-[inset_0_-8px_24px_rgba(0,0,0,0.35)]',
      unselectedBorder: 'border-[#E4405F]/30',
      selectedBorder: 'border-white/30',
      iconColor: 'text-white',
      textColor: 'text-white',
      background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), linear-gradient(90deg, #E04163 0%, #863CB1 100%)',
    },
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: FaTwitter,
    colors: {
      brand: '#1DA1F2',
      unselectedBg: 'bg-white/10',
      selectedBg: 'bg-[#1DA1F2] shadow-[inset_0_-8px_24px_rgba(0,0,0,0.35)]',
      unselectedBorder: 'border-white/30',
      selectedBorder: 'border-[#1590d8]/80',
      iconColor: 'text-white',
      textColor: 'text-white',
      background: '#FFFFFF0D',
    },
  },
];

export const PLATFORM_BY_ID = PLATFORM_LIST.reduce<Record<string, PlatformMeta>>((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {});

// Content and media limits per platform (used in scheduling/publish validation and guidance)
export const CAPTION_LIMITS: Record<string, number> = {
  x: 280,
  twitter: 280,
  facebook: 63206,
  instagram: 2200,
  linkedin: 3000,
};

export const IMAGE_SIZE_LIMIT_MB: Record<string, number> = {
  x: 5,
  twitter: 5,
  facebook: 8,
  instagram: 8,
  linkedin: 5,
};

export const IMAGE_REQUIRED: Record<string, boolean> = {
  instagram: true,
  facebook: false,
  x: false,
  twitter: false,
  linkedin: false,
};


