import React from 'react';
import { FaTwitter } from 'react-icons/fa';
import { PLATFORM_BY_ID } from '../../constants/platforms';

const PlatformBadge: React.FC<{ id: string }> = ({ id }) => {
  const meta = PLATFORM_BY_ID[id] || { icon: FaTwitter, name: id, colors: { brand: '#9CA3AF', background: '#9CA3AF' } } as any;
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center justify-center gap-1 px-2 py-1.5 text-gray-200 text-xs w-28" title={meta.name} style={{ background: meta.colors.background, borderRadius: '5.77px' }}>
      <Icon size={14} style={{ color: 'white' }} />
      <span className="capitalize">{meta.name}</span>
    </span>
  );
};

export default PlatformBadge;


