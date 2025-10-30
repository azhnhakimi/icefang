import type { Metadata } from "next";

import AnalyticsHeader from "@/components/AnalyticsHeader";
import AnalyticsRecapPanel from "@/components/AnalyticsRecapPanel";
import AnalyticsTaskCompletionPanel from "@/components/AnalyticsTaskCompletionPanel";
import AnalyticsCompletionPanel from "@/components/AnalyticsCompletionPanel";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Track your productivity and progress accross all activities",
};

const AnalyticsIndexPage = () => {
  return (
    <section className="w-full h-full bg-[var(--primary-background)] p-6 space-y-8">
      <AnalyticsHeader />
      <div className="flex gap-8 items-stretch">
        <div className="flex-[2] flex">
          <AnalyticsRecapPanel />
        </div>
        <div className="flex-[3] flex">
          <AnalyticsTaskCompletionPanel />
        </div>
      </div>
      <AnalyticsCompletionPanel />
    </section>
  );
};

export default AnalyticsIndexPage;
