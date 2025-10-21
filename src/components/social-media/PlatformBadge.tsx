import React from 'react';
import { FaTwitter } from 'react-icons/fa';
import { PLATFORM_BY_ID } from '../../constants/platforms';

const PlatformBadge: React.FC<{ id: string }> = ({ id }) => {
  const meta = PLATFORM_BY_ID[id] || { icon: FaTwitter, name: id, colors: { brand: '#9CA3AF' } } as any;
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 text-gray-200 text-[10px] sm:text-xs" title={meta.name}>
      <Icon size={10} className="sm:hidden" style={{ color: (meta.colors?.brand as string) || '#9CA3AF' }} />
      <Icon size={12} className="hidden sm:inline" style={{ color: (meta.colors?.brand as string) || '#9CA3AF' }} />
      <span className="capitalize">{meta.name}</span>
    </span>
  );
};

export default PlatformBadge;


