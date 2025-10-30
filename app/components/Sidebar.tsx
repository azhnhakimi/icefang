"use client";
import {
  LayoutDashboard,
  ClipboardList,
  NotebookPen,
  Calendar,
  ChartColumnIncreasing,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import LogoutButton from "./LogoutButton";

const ICON_SIZE = 16;

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={ICON_SIZE} />,
    },
    { name: "Tasks", href: "/tasks", icon: <ClipboardList size={ICON_SIZE} /> },
    { name: "Notes", href: "/notes", icon: <NotebookPen size={ICON_SIZE} /> },
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar size={ICON_SIZE} />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <ChartColumnIncreasing size={ICON_SIZE} />,
    },
  ];

  return (
    <aside
      className={clsx(
        "transition-all duration-300 bg-white border-r-2 border-gray-200 flex flex-col",
        expanded ? "w-56" : "w-16"
      )}
    >
      <div
        className={clsx(
          "flex items-center px-4 py-2",
          expanded ? "justify-between" : "justify-center"
        )}
      >
        <span
          className={clsx(
            "font-bold text-lg text-primary",
            !expanded && "hidden"
          )}
        >
          Icefang
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded hover:bg-[var(--primary-active)]"
        >
          {expanded ? (
            <PanelRightOpen size={ICON_SIZE} />
          ) : (
            <PanelRightClose size={ICON_SIZE} />
          )}
        </button>
      </div>

      <nav
        className={`flex-1 p-2 space-y-1 flex flex-col justify-start ${
          expanded ? "items-stretch" : "items-center"
        }`}
      >
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 transition-all",
                isActive
                  ? "bg-[var(--primary-active)] text-[var(--primary-dark)]"
                  : "hover:bg-[var(--primary-active)] text-gray-800",
                expanded
                  ? "rounded-lg px-4 py-2 justify-start"
                  : "rounded-xl p-1 justify-center aspect-square w-10"
              )}
            >
              <span>{item.icon}</span>
              {expanded && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-gray-200 flex justify-center">
        <LogoutButton expanded={expanded} />
      </div>
    </aside>
  );
}
