"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";

interface NavbarProps {
  collapsed: boolean;
  setMobileOpen: (value: boolean) => void;
}

export default function Navbar({ collapsed, setMobileOpen }: NavbarProps) {
  return (
    <header
      className={`
        fixed top-0 right-0 z-30
        h-[72px]
        bg-white/95 backdrop-blur
        border-b border-slate-200
        transition-all duration-300

        left-0
        ${collapsed ? "lg:left-[78px]" : "lg:left-[260px]"}
      `}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <Menu size={22} />
          </button>

          <div className="hidden md:flex items-center w-[280px] lg:w-[340px]">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-xl text-slate-500 bg-slate-100 border border-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-300 focus:bg-white"
              />
            </div>
          </div>

          <div className="md:hidden">
            <h1 className="font-semibold text-slate-800">Wi-Fi Monitor</h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification */}
          <button className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-600">
            <Bell size={20} />

            <span className="absolute right-2 top-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </button>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          {/* User */}
          <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              A
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800">
                Administrator
              </p>

              <p className="text-[11px] text-slate-500">Network Admin</p>
            </div>

            <ChevronDown size={16} className="hidden sm:block text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
