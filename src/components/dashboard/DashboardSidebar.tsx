import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { PiMagicWandBold, PiStackSimple } from 'react-icons/pi';
import { HiOutlineSquares2X2, HiOutlineCog6Tooth } from 'react-icons/hi2';
import { MdOutlineFeed } from 'react-icons/md';

interface SidebarNavItem {
  label: string;
  to: string;
  icon: ReactNode;
  badge?: string;
}

interface DashboardSidebarProps {
  activePath?: string;
}

const navItems: SidebarNavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <RxDashboard className="w-5 h-5" />,
  },
  {
    label: 'AI Tools',
    to: '/ai-tools',
    icon: <PiMagicWandBold className="w-5 h-5" />,
    badge: '12',
  },
  {
    label: 'Projects',
    to: '/projects',
    icon: <PiStackSimple className="w-5 h-5" />,
  },
  {
    label: 'Templates',
    to: '/templates',
    icon: <HiOutlineSquares2X2 className="w-5 h-5" />,
  },
  {
    label: 'Community Feed',
    to: '/community',
    icon: <MdOutlineFeed className="w-5 h-5" />,
  },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activePath = '/dashboard' }) => {
  return (
    <aside className="hidden lg:flex w-[248px] xl:w-[260px] bg-[#0B0B0F] border-r border-white/5">
      <div className="flex flex-col w-full h-screen px-6 pt-8 pb-10">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Startup Ninja" className="w-auto" />
        </div>

        <nav className="mt-12 flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => {
                const isCurrent = isActive || activePath === item.to;
                const baseClasses = 'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200';
                const defaultState = 'text-white/60 hover:text-white hover:bg-white/5';
                const activeState = 'text-white bg-white/10 shadow-[0_12px_32px_rgba(229,0,0,0.12)] border border-white/10';

                return `${baseClasses} ${isCurrent ? activeState : defaultState}`.trim();
              }}
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-white">
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto inline-flex items-center justify-center rounded-full bg-[#E50000]/20 text-[#FF6161] text-[11px] font-semibold px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/5 pt-6 mt-6">
          <NavLink
            to="/settings"
            className={({ isActive }) => {
              const baseClasses = 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200';
              const defaultState = 'text-white/60 hover:text-white hover:bg-white/5';
              const activeState = 'text-white bg-white/10 shadow-[0_12px_32px_rgba(229,0,0,0.12)] border border-white/10';

              return `${baseClasses} ${isActive ? activeState : defaultState}`.trim();
            }}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-white">
              <HiOutlineCog6Tooth className="w-5 h-5" />
            </span>
            Settings
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
