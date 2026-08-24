"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        toggleCollapsed={() => setCollapsed((value) => !value)}
      />

      <Navbar collapsed={collapsed} setMobileOpen={setMobileOpen} />

      <main
        className={`
          pt-[72px]
          min-h-screen
          transition-all duration-300

          ml-0
          ${collapsed ? "lg:ml-[78px]" : "lg:ml-[260px]"}
        `}
      >
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
