"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Lightbulb,
  LogOut,
  Map,
  Settings,
  Wifi,
  X,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  toggleCollapsed: () => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    name: "Campuses",
    href: "/campuses",
    icon: Map,
  },
  {
    name: "Buildings",
    href: "/buildings",
    icon: Building2,
  },
  {
    name: "Access Points",
    href: "/access-points",
    icon: Wifi,
  },
  {
    name: "Monitoring",
    href: "/monitoring",
    icon: Activity,
  },
  {
    name: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    name: "Recommendations",
    href: "/recommendations",
    icon: Lightbulb,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

export default function Sidebar({
  collapsed,
  mobileOpen,
  setMobileOpen,
  toggleCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Remove authentication token
    localStorage.removeItem("token");

    // Remove stored user information if it exists
    localStorage.removeItem("user");

    // Close mobile sidebar
    setMobileOpen(false);

    // Redirect to login
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen
          bg-slate-950 text-white
          border-r border-slate-800
          transition-all duration-300
          flex flex-col

          ${collapsed ? "lg:w-[78px]" : "lg:w-[260px]"}

          w-[270px]

          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-[72px] px-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Wifi size={22} />
            </div>

            {!collapsed && (
              <div className="whitespace-nowrap">
                <h1 className="font-semibold text-sm">Wi-Fi Monitor</h1>

                <p className="text-[11px] text-slate-400">Network Management</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.name : undefined}
                  className={`
                    group flex items-center gap-2
                    rounded-xl px-3 py-2
                    text-sm font-medium
                    transition-colors

                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }

                    ${collapsed ? "lg:justify-center" : ""}
                  `}
                >
                  <Icon size={19} className="shrink-0" />

                  <span
                    className={`
                      whitespace-nowrap
                      ${collapsed ? "lg:hidden" : ""}
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 p-3 space-y-1">
          {/* Settings */}
          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            className={`
              flex items-center gap-2
              rounded-xl px-3 py-2
              text-sm text-slate-400
              hover:bg-slate-900 hover:text-white
              ${collapsed ? "lg:justify-center" : ""}
            `}
          >
            <Settings size={19} />

            <span className={collapsed ? "lg:hidden" : ""}>Settings</span>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-2
              rounded-xl px-3 py-2
              text-sm text-red-400
              hover:bg-red-500/10
              cursor-pointer
              ${collapsed ? "lg:justify-center" : ""}
            `}
          >
            <LogOut size={19} />

            <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
          </button>

          {/* Collapse */}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden lg:flex w-full items-center justify-center mt-2 p-2 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-white"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
