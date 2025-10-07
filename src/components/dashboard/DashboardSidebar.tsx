import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PiMagicWandBold, PiImageSquareBold } from 'react-icons/pi';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';
import { CgHome } from "react-icons/cg";
import { FaRegFolder } from "react-icons/fa6";
import { PiCirclesThreeBold } from "react-icons/pi";
import { FaRss } from "react-icons/fa";
import { FiMenu, FiX, FiChevronDown, FiMessageSquare, FiGlobe } from 'react-icons/fi';
import { RiOrganizationChart } from 'react-icons/ri';

interface SidebarSubNavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

interface SidebarNavItem {
  label: string;
  to: string;
  icon: ReactNode;
  children?: SidebarSubNavItem[];
}

interface DashboardSidebarProps {
  activePath?: string;
}

const navItems: SidebarNavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <CgHome className="w-5 h-5" />,
  },
  {
    label: 'AI Tools',
    to: '/ai-tools',
    icon: <PiMagicWandBold className="w-5 h-5" />,
    children: [
      { label: 'AI Chat', to: '/ai-tools/chat', icon: <FiMessageSquare className="h-4 w-4" /> },
      { label: 'AI Image', to: '/ai-tools/image', icon: <PiImageSquareBold className="h-4 w-4" /> },
      { label: 'Web Builder', to: '/ai-tools/web-builder', icon: <FiGlobe className="h-4 w-4" /> },
      { label: 'Social Pro', to: '/ai-tools/social-pro', icon: <RiOrganizationChart className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Projects',
    to: '/projects',
    icon: <FaRegFolder className="w-5 h-5" />,
  },
  {
    label: 'Templates',
    to: '/templates',
    icon: <PiCirclesThreeBold className="w-5 h-5" />,
  },
  {
    label: 'Community Feed',
    to: '/community',
    icon: <FaRss className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: <HiOutlineCog6Tooth className="w-5 h-5" />,
  }
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activePath = '/dashboard' }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileCollapsed, _setIsMobileCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setExpandedItems((prev) => {
      const next = { ...prev };
      navItems.forEach((item) => {
        if (!item.children?.length) {
          return;
        }

        const childActive = item.children.some((child) => location.pathname.startsWith(child.to));
        if (location.pathname.startsWith(item.to) || childActive || activePath === item.to) {
          next[item.to] = true;
        }
      });
      return next;
    });
  }, [activePath, location.pathname]);

  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  const hoverBorderGradient = 'linear-gradient(95.04deg, rgba(222, 5, 0, 0.25) 2.93%, rgba(222, 5, 0, 0.05) 107.85%)';

  const applyHoverGradient = (element: HTMLElement) => {
    element.style.border = '1.33px solid transparent';
    element.style.borderImageSource = hoverBorderGradient;
    element.style.borderImageSlice = '1';
  };

  const clearHoverGradient = (element: HTMLElement) => {
    element.style.border = '';
    element.style.borderImageSource = '';
    element.style.borderImageSlice = '';
  };

  const activeNavStyle: CSSProperties = {
    background: '#EF44440D',
    border: '1.33px solid transparent',
    borderImageSource: 'linear-gradient(95.04deg, rgba(222, 5, 0, 0.4) 2.93%, rgba(222, 5, 0, 0.1) 107.85%)',
    borderImageSlice: 1,
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleMobileSidebar}
        className="fixed left-3 top-16 sm:left-4 sm:top-5 z-[60] inline-flex items-center justify-center rounded-full bg-black/40 px-3 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 backdrop-blur-md lg:hidden"
        aria-controls="dashboard-sidebar"
        aria-expanded={isMobileOpen}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        {isMobileOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
      </button>

      {isMobileOpen && (
        <div
          role="presentation"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-30 cursor-pointer backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`pt-5 fixed inset-y-0 left-0 z-40 transform bg-[#0B0B0F] border-r border-white/5 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:flex lg:w-[248px] xl:w-[260px] lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobileOpen ? (isMobileCollapsed ? 'w-[80px]' : 'w-[260px]') : ''}`}
      >
        <div className="flex h-full w-full flex-col px-4 pt-2 lg:pt-4 lg:px-4">
          <div className="flex items-center justify-center">
            <img src="/images/logo.png" alt="Startup Ninja" className="h-16 w-auto" />
          </div>

          <nav className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const children = item.children ?? [];
              const hasChildren = children.length > 0;
              const childActive = children.some((child) => location.pathname.startsWith(child.to));
              const isExpanded = hasChildren ? expandedItems[item.to] ?? false : false;
              const navActive = location.pathname === item.to || activePath === item.to || childActive;
              const dataIsActiveValue = navActive.toString();

              return (
                <div key={item.label} className="space-y-1">
                  <NavLink
                    to={item.to}
                    onClick={() => {
                      if (hasChildren) {
                        setExpandedItems((prev) => ({ ...prev, [item.to]: true }));
                      }
                      closeMobileSidebar();
                    }}
                    className={({ isActive }) => {
                      const isCurrent = isActive || navActive;
                      const baseClasses = `group relative flex items-center ${isMobileOpen && isMobileCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'} rounded-xl border text-sm font-medium transition-all duration-200`;
                      const defaultState = 'border-transparent text-white/60 hover:text-white hover:bg-[#EF44440F]';
                      const activeState = 'text-white shadow-[0_12px_32px_rgba(229,0,0,0.12)]';

                      return `${baseClasses} ${isCurrent ? activeState : defaultState}`.trim();
                    }}
                    style={({ isActive }) => {
                      const isCurrent = isActive || navActive;
                      if (isCurrent) {
                        return activeNavStyle;
                      }

                      return {
                        transition: 'background 0.2s ease, border 0.2s ease',
                      };
                    }}
                    data-is-active={dataIsActiveValue}
                    onMouseEnter={(event) => {
                      const element = event.currentTarget;
                      if (element.dataset.isActive === 'true') {
                        return;
                      }
                      applyHoverGradient(element);
                    }}
                    onMouseLeave={(event) => {
                      const element = event.currentTarget;
                      if (element.dataset.isActive === 'true') {
                        return;
                      }
                      clearHoverGradient(element);
                    }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center text-white">
                      {item.icon}
                    </span>
                    {isMobileOpen && isMobileCollapsed ? null : <span className="truncate">{item.label}</span>}
                    <span className={`ml-auto flex items-center gap-2 ${isMobileOpen && isMobileCollapsed ? 'hidden' : ''}` }>
  
                      {hasChildren ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setExpandedItems((prev) => ({
                              ...prev,
                              [item.to]: !isExpanded,
                            }));
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors duration-200 hover:bg-white/10 focus:outline-none"
                          aria-label={`Toggle ${item.label} menu`}
                        >
                          <FiChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      ) : null}
                    </span>
                  </NavLink>

                  {hasChildren ? (
                    <div
                      className={`ml-12 flex flex-col gap-1 overflow-hidden rounded-xl border border-transparent pl-2 transition-[max-height,opacity] duration-300 ease-in-out ${
                        isExpanded ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 opacity-0'
                      }`}
                      aria-label={`${item.label} submenu`}
                    >
                      {children.map((child) => (
                        <NavLink
                          key={child.label}
                          to={child.to}
                          onClick={closeMobileSidebar}
                          className={({ isActive }) => {
                            const isCurrent = isActive || location.pathname.startsWith(child.to);
                            const baseClasses = `group flex items-center gap-2 rounded-lg border px-1 py-2 text-sm transition-all duration-200`;
                            const defaultState = 'border-transparent text-white/60 hover:text-white hover:bg-[#EF44440F]';
                            const activeState = 'text-white shadow-[0_10px_24px_rgba(229,0,0,0.12)]';
                            return `${baseClasses} ${isCurrent ? activeState : defaultState}`.trim();
                          }}
                          style={({ isActive }) => {
                            const isCurrent = isActive || location.pathname.startsWith(child.to);
                            if (isCurrent) {
                              return activeNavStyle;
                            }

                            return {
                              transition: 'background 0.2s ease, border 0.2s ease',
                            };
                          }}
                          data-is-active={location.pathname.startsWith(child.to).toString()}
                          onMouseEnter={(event) => {
                            const element = event.currentTarget;
                            if (element.dataset.isActive === 'true') {
                              return;
                            }
                            applyHoverGradient(element);
                          }}
                          onMouseLeave={(event) => {
                            const element = event.currentTarget;
                            if (element.dataset.isActive === 'true') {
                              return;
                            }
                            clearHoverGradient(element);
                          }}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white" aria-hidden>
                            {child.icon}
                          </span>
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="mt-8 hidden lg:block text-xs text-white/30">
            © {new Date().getFullYear()} Startup Ninja
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
