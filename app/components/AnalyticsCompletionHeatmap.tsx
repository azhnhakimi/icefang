"use client";

import React, { useMemo } from "react";
import {
  format,
  subYears,
  addDays,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  differenceInCalendarDays,
  getMonth,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DayPoint = {
  date: string; // ISO yyyy-mm-dd
  count: number;
};

type Props = {
  data?: DayPoint[];
  from?: Date;
  to?: Date;
  colors?: [string, string, string, string, string];
  squareSize?: number;
  squareGap?: number;
};

const DEFAULT_COLORS: [string, string, string, string, string] = [
  "#EBEDF0",
  "#13a4ec",
  "#067fc3",
  "#06659e",
  "#0a5582",
];

function getColorForCount(
  count: number,
  colors: [string, string, string, string, string]
) {
  if (count <= 0) return colors[0];
  if (count === 1) return colors[1];
  if (count === 2) return colors[2];
  if (count <= 3) return colors[3];
  return colors[4];
}

export default function AnalyticsCompletionHeatmap({
  data = [],
  from,
  to,
  colors = DEFAULT_COLORS,
  squareSize = 12,
  squareGap = 4,
}: Props) {
  const end = to ?? new Date();
  const start = from ?? subYears(end, 1);

  // Map date strings to counts
  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of data) {
      map.set(d.date, (map.get(d.date) ?? 0) + d.count);
    }
    return map;
  }, [data]);

  // Build weeks array
  const weeks = useMemo(() => {
    const first = startOfWeek(start, { weekStartsOn: 0 });
    const last = endOfWeek(end, { weekStartsOn: 0 });

    const allDays = eachDayOfInterval({ start: first, end: last });
    const totalDays = differenceInCalendarDays(last, first) + 1;
    const numWeeks = Math.ceil(totalDays / 7);

    const weeksArr: Date[][] = [];
    for (let w = 0; w < numWeeks; w++) {
      const weekStartIndex = w * 7;
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        const idx = weekStartIndex + d;
        if (idx < allDays.length) week.push(allDays[idx]);
        else
          week.push(
            addDays(allDays[allDays.length - 1], idx - (allDays.length - 1))
          );
      }
      weeksArr.push(week);
    }
    return weeksArr;
  }, [start, end]);

  // Get positions for month labels
  const monthLabels = useMemo(() => {
    const labels: { index: number; name: string }[] = [];
    for (let i = 0; i < weeks.length; i++) {
      const firstDay = weeks[i][0];
      if (firstDay.getDate() <= 7) {
        const monthName = format(firstDay, "MMM");
        // Only push if not same as previous
        if (!labels.length || labels[labels.length - 1].name !== monthName) {
          labels.push({ index: i, name: monthName });
        }
      }
    }
    return labels;
  }, [weeks]);

  // const dayLabels = ["Sun", "Tue", "Thu", "Sat"];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="contrib-heatmap">
        {/* Month header */}
        <div className="flex ml-[40px] mb-5 relative">
          {monthLabels.map((m, i) => (
            <div
              key={i}
              className="absolute text-xs text-gray-600"
              style={{
                left: `${m.index * (squareSize + squareGap)}px`,
              }}
            >
              {m.name}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {/* Day column */}
          <div
            className="flex flex-col justify-between text-xs text-gray-600 mr-1"
            style={{
              height: (squareSize + squareGap) * 7 - squareGap,
            }}
          >
            {dayLabels.map((label, idx) => (
              <span
                key={idx}
                style={{
                  height: squareSize + squareGap,
                  lineHeight: `${squareSize + squareGap}px`,
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Week columns */}
          <div className="flex" style={{ gap: squareGap }}>
            {weeks.map((week, wi) => (
              <div
                key={wi}
                className="flex flex-col"
                style={{ gap: squareGap }}
              >
                {week.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const count = dataMap.get(dateKey) ?? 0;
                  const color = getColorForCount(count, colors);
                  const label = `${count} task${
                    count === 1 ? "" : "s"
                  } on ${format(day, "LLL d, yyyy")}`;
                  const isVisible = day <= end && day >= start;

                  return (
                    <Tooltip key={dateKey}>
                      <TooltipTrigger asChild>
                        <div
                          role="img"
                          aria-label={label}
                          className="rounded-xs transition-all duration-150 hover:scale-110 cursor-pointer"
                          style={{
                            width: squareSize,
                            height: squareSize,
                            backgroundColor: isVisible ? color : "transparent",
                            minWidth: squareSize,
                            minHeight: squareSize,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="px-3 py-2 text-xs">
                        {label}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {colors.map((c, i) => (
              <span
                key={i}
                className="rounded-xs"
                style={{
                  width: squareSize,
                  height: squareSize,
                  backgroundColor: c,
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
