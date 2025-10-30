"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const ICON_SIZE = 16;

export default function LogoutButton({ expanded }: { expanded: boolean }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={`flex items-center gap-3 transition-all w-full text-left text-gray-800 hover:bg-[var(--primary-active)] rounded-lg ${
        expanded
          ? "px-4 py-2 justify-start"
          : "p-1 justify-center aspect-square w-10 rounded-xl"
      }`}
    >
      <LogOut size={ICON_SIZE} />
      {expanded && <span className="text-sm font-medium">Logout</span>}
    </button>
  );
}
