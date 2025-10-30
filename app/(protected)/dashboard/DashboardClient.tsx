// app/(protected)/dashboard/DashboardClient.tsx
"use client";

import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardTasksPanel from "@/components/DashboardTasksPanel";
import DashboardEventsPanel from "@/components/DashboardEventsPanel";
import DashboardQuotesPanel from "@/components/DashboardQuotesPanel";
import DashboardNotesPanel from "@/components/DashboardNotesPanel";

export default function DashboardClient() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <section className="w-full h-full bg-[var(--primary-background)] p-6">
      <DashboardHeader name={session?.user?.name || "Traveller"} />
      <div className="flex gap-8">
        <div className="space-y-8 flex-2">
          <DashboardTasksPanel />
          <DashboardEventsPanel />
        </div>
        <div className="space-y-8 flex-1">
          <DashboardQuotesPanel
            quote="Behold my land in which I grow my fucks and note that it is barren cause I give no fucks"
            author="Chimpazini Bananini"
          />
          <DashboardNotesPanel />
        </div>
      </div>
    </section>
  );
}
