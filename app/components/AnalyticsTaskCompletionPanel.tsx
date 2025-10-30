"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

const weeklyData = [
  { label: "Mon", completion: 70 },
  { label: "Tue", completion: 85 },
  { label: "Wed", completion: 60 },
  { label: "Thu", completion: 90 },
  { label: "Fri", completion: 75 },
  { label: "Sat", completion: 40 },
  { label: "Sun", completion: 50 },
];

const monthlyData = [
  { label: "Week 1", completion: 65 },
  { label: "Week 2", completion: 80 },
  { label: "Week 3", completion: 72 },
  { label: "Week 4", completion: 88 },
];

const AnalyticsTaskCompletionPanel = () => {
  const [view, setView] = useState<"weekly" | "monthly">("weekly");

  const data = view === "weekly" ? weeklyData : monthlyData;

  return (
    <div className="bg-white rounded-xl px-6 py-6 border-2 border-gray-200 flex flex-col flex-1 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-xl font-bold">Task Completion (%)</p>

        <div className="flex gap-2">
          <Button
            variant={view === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant={view === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("monthly")}
          >
            Monthly
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="completion"
              stroke="var(--primary-main, #13a4ec)"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsTaskCompletionPanel;
