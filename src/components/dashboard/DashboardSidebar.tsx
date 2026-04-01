import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { PiImageSquareBold } from "react-icons/pi";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { CgHome } from "react-icons/cg";
import {
  FiMenu,
  FiX,
  FiMessageSquare,
  FiGlobe,
  FiChevronLeft,
  FiChevronRight,
  FiCheckSquare,
  FiTrendingUp,
} from "react-icons/fi";
import { RiMoneyDollarBoxFill, RiOrganizationChart, RiFundsLine } from "react-icons/ri";
import { UserProfile } from "../../services/user";
import { TbApi } from "react-icons/tb";
import { FaGavel, FaUsers } from "react-icons/fa";


interface SidebarSection {
  sectionLabel?: string;
  items: SidebarNavItem[];
}

interface SidebarNavItem {
  label: string;
  to: string;
  icon: ReactNode;
  admin: boolean;
  end?: boolean;
}

interface DashboardSidebarProps {
  activePath?: string;
  userData: UserProfile | null;
}

const navSections: SidebarSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: <CgHome className="w-5 h-5" />,
        admin: false,
        end: true,
      },
    ],
  },
  {
    items: [
      {
        label: "Dashboard",
        to: "/admin-dashboard",
        icon: <CgHome className="w-5 h-5" />,
        admin: true,
        end: true,
      },
      {
        label: "User Management",
        to: "/admin-dashboard/users",
        icon: <FaUsers className="w-5 h-5" />,
        admin: true,
      },
      {
        label: "Plans & Price Management",
        to: "/admin-dashboard/plans",
        icon: <RiMoneyDollarBoxFill className="w-5 h-5" />,
        admin: true,
      },
      {
        label: "API Management",
        to: "/admin-dashboard/api-management",
        icon: <TbApi className="w-5 h-5" />,
        admin: true,
      },
    ],
  },
  {
    sectionLabel: "Tools",
    items: [
      {
        label: "AI Chat",
        to: "/ai-tools/chat",
        icon: <FiMessageSquare className="w-5 h-5" />,
        admin: false,
      },
      {
        label: "AI Image",
        to: "/ai-tools/image-gen",
        icon: <PiImageSquareBold className="w-5 h-5" />,
        admin: false,
      },
      {
        label: "Web Builder",
        to: "/ai-tools/web-builder",
        icon: <FiGlobe className="w-5 h-5" />,
        admin: false,
      },
      {
        label: "Social Pro",
        to: "/ai-tools/social-pro",
        icon: <RiOrganizationChart className="w-5 h-5" />,
        admin: false,
      },
      {
        label: "Ninja Legal",
        to: "/ai-tools/legal",
        icon: <FaGavel className="w-5 h-5" />,
        admin: false,
      },
      {
        label: "Ninja Finance",
        to: "/ai-tools/finance",
        icon: <RiFundsLine className="w-5 h-5" />,
        admin: false,
      },
      {
        label: "Ninja Ops",
        to: "/ai-tools/ops",
        icon: <FiCheckSquare className="w-5 h-5" />,
        admin: false,
      },
      {
        label: "Ninja Sales",
        to: "/ai-tools/sales",
        icon: <FiTrendingUp className="w-5 h-5" />,
        admin: false,
      },
    ],
  },
  {
    items: [
      {
        label: "Settings",
        to: "/settings",
        icon: <HiOutlineCog6Tooth className="w-5 h-5" />,
        admin: false,
      },
    ],
  },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activePath = "/dashboard",
  userData,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Flatten sections and filter by admin role
  const filteredSections = navSections
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        userData?.role === "admin" ? item.admin : !item.admin
      )
    }))
    .filter(section => section.items.length > 0);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dashboard_sidebar_collapsed");
      if (stored === "1") {
        setIsCollapsed(true);
      }
    } catch { }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "dashboard_sidebar_collapsed",
        isCollapsed ? "1" : "0"
      );
    } catch { }
  }, [isCollapsed]);


  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileOpen(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const hoverBorderGradient =
    "linear-gradient(95.04deg, rgba(222, 5, 0, 0.25) 2.93%, rgba(222, 5, 0, 0.05) 107.85%)";

  const applyHoverGradient = (element: HTMLElement) => {
    element.style.border = "1.33px solid transparent";
    element.style.borderImageSource = hoverBorderGradient;
    element.style.borderImageSlice = "1";
  };

  const clearHoverGradient = (element: HTMLElement) => {
    element.style.border = "";
    element.style.borderImageSource = "";
    element.style.borderImageSlice = "";
  };

  const activeNavStyle: CSSProperties = {
    background: "#EF44440D",
    border: "1.33px solid transparent",
    borderImageSource:
      "linear-gradient(95.04deg, rgba(222, 5, 0, 0.4) 2.93%, rgba(222, 5, 0, 0.1) 107.85%)",
    borderImageSlice: 1,
  };

  return (
    <>
      {/* Hamburger button - only shows when sidebar is closed */}
      {!isMobileOpen && (
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="fixed left-3 top-3 sm:left-4 z-[60] inline-flex items-center justify-center px-3 py-2 text-sm font-semibold text-white lg:hidden"
          aria-controls="dashboard-sidebar"
          aria-expanded={false}
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      )}

      {isMobileOpen && (
        <div
          role="presentation"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-30 cursor-pointer backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`pt-5 fixed inset-y-0 left-0 z-40 transform bg-[#0B0B0F] border-r border-white/5 transition-all duration-300 ease-in-out lg:static lg:z-auto lg:flex lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } ${isMobileOpen ? "w-[260px]" : ""} ${isCollapsed ? "lg:w-[80px]" : "lg:w-[248px] xl:w-[260px]"
          }`}
      >
        <div className="flex h-full w-full flex-col px-3 pt-2 lg:pt-3 lg:px-3">
          <div
            className={
              isCollapsed
                ? "flex flex-col items-center gap-3"
                : "flex items-center justify-between gap-2 mb-6"
            }
          >
            {isCollapsed ? (
              <>
                <Link
                  to={
                    userData?.role === "admin"
                      ? "/admin-dashboard"
                      : "/dashboard"
                  }
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-all duration-300 ease-in-out mt-2 animate-[fadeIn_0.3s_ease-in-out,scaleIn_0.3s_ease-in-out]"
                >
                  <img
                    src="/svg/ninja-icon.svg"
                    alt="Startup Ninja"
                    className="h-12 w-12 transition-all duration-300 ease-in-out"
                  />
                </Link>
                <button
                  type="button"
                  onClick={toggleCollapse}
                  className="hidden lg:flex items-center justify-center rounded-xl border border-transparent text-white/60 hover:text-white hover:bg-[#EF44440F] px-2 py-2 transition-all duration-300 ease-in-out animate-[fadeIn_0.3s_ease-in-out_0.1s_both,slideInLeft_0.3s_ease-in-out_0.1s_both]"
                  aria-label="Expand sidebar"
                  title="Expand"
                  onMouseEnter={(event) => {
                    applyHoverGradient(event.currentTarget);
                  }}
                  onMouseLeave={(event) => {
                    clearHoverGradient(event.currentTarget);
                  }}
                >
                  <span className="flex h-7 w-7 items-center justify-center text-white transition-transform duration-300 hover:scale-110">
                    <FiChevronRight className="h-5 w-5" />
                  </span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Link
                    to={
                      userData?.role === "admin"
                        ? "/admin-dashboard"
                        : "/dashboard"
                    }
                    className="flex-1 min-w-0 transition-all duration-300 ease-in-out animate-[fadeIn_0.3s_ease-in-out,scaleIn_0.3s_ease-in-out]"
                  >
                    <img
                      src="/svg/ninja-logo.svg"
                      alt="Startup Ninja"
                      className="h-14 w-auto max-w-[180px] transition-all duration-300 ease-in-out"
                    />
                  </Link>
                  {isMobileOpen && (
                    <button
                      type="button"
                      onClick={closeMobileSidebar}
                      className="lg:hidden inline-flex items-center justify-center rounded-full text-white p-2 transition-all"
                      aria-label="Close sidebar"
                      title="Close sidebar"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={toggleCollapse}
                  className="hidden lg:inline-flex flex-shrink-0 items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/80 p-2 transition-all duration-300 ease-in-out animate-[fadeIn_0.3s_ease-in-out_0.1s_both,slideInRight_0.3s_ease-in-out_0.1s_both]"
                  aria-label="Collapse sidebar"
                  title="Collapse"
                >
                  <FiChevronLeft className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                </button>
              </>
            )}
          </div>

          <nav className="flex-1 space-y-1.5 overflow-hidden pr-1">
            {filteredSections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={`space-y-1.5 ${section.sectionLabel && !isCollapsed
                  ? 'pt-4 pb-4 mb-2 border-t-2 border-b-2 border-white/10'
                  : ''
                  }`}
              >
                {/* Section Label (if exists) */}
                {section.sectionLabel && !isCollapsed && (
                  <div className="px-3 pt-1 pb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {section.sectionLabel}
                    </p>
                  </div>
                )}

                {/* Section Items */}
                {section.items.map((item) => {
                  const navActive =
                    location.pathname === item.to ||
                    activePath === item.to ||
                    location.pathname.startsWith(item.to);
                  const dataIsActiveValue = navActive.toString();

                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      end={item.end}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) => {
                        const isCurrent = isActive || navActive;
                        const baseClasses = `group relative flex items-center ${isCollapsed
                          ? "justify-center px-2 py-2"
                          : "gap-2 px-3 py-2"
                          } rounded-xl border text-xs font-medium transition-all duration-300 ease-in-out`;
                        const defaultState =
                          "border-transparent text-white/60 hover:text-white hover:bg-[#EF44440F]";
                        const activeState =
                          "text-white shadow-[0_12px_32px_rgba(229,0,0,0.12)]";

                        return `${baseClasses} ${isCurrent ? activeState : defaultState
                          }`.trim();
                      }}
                      style={({ isActive }) => {
                        const isCurrent = isActive || navActive;
                        if (isCurrent) {
                          return activeNavStyle;
                        }

                        return {
                          transition: "background 0.2s ease, border 0.2s ease",
                        };
                      }}
                      data-is-active={dataIsActiveValue}
                      onMouseEnter={(event) => {
                        const element = event.currentTarget;
                        if (element.dataset.isActive === "true") {
                          return;
                        }
                        applyHoverGradient(element);
                      }}
                      onMouseLeave={(event) => {
                        const element = event.currentTarget;
                        if (element.dataset.isActive === "true") {
                          return;
                        }
                        clearHoverGradient(element);
                      }}
                    >
                      <span className="flex h-7 w-7 items-center justify-center text-white transition-transform duration-300 ease-in-out group-hover:scale-110">
                        {item.icon}
                      </span>
                      {isCollapsed ? null : (
                        <span className="truncate transition-all duration-300 ease-in-out opacity-0 animate-[fadeIn_0.3s_ease-in-out_0.15s_forwards,slideInLeft_0.3s_ease-in-out_0.15s_forwards]">
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="mt-6 hidden lg:block text-[10px] text-white/30">
            © {new Date().getFullYear()} Startup Ninja
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
