import { Check, Lightbulb, CalendarCheck2 } from "lucide-react";

const ICON_SIZE = 16;

const AnalyticsRecapPanel = () => {
  return (
    <div className="bg-white rounded-xl px-4 py-6 border-2 border-gray-200 flex-1 h-full">
      <p className="text-xl font-bold mb-6">Weekly Recap</p>
      <div className="flex flex-col justify-start items-start gap-3">
        <div className="flex justify-start items-center gap-3">
          <div className="p-2 rounded-full bg-[#DCFCE7]">
            <Check size={ICON_SIZE} color="#00C24C" />
          </div>
          <p>
            You completed <span className="font-bold">12 tasks</span> this week.
          </p>
        </div>

        <div className="flex justify-start items-center gap-3">
          <div className="p-2 rounded-full bg-[#FFEDD5]">
            <Lightbulb size={ICON_SIZE} color="#F96300" />
          </div>
          <p>
            You created <span className="font-bold">24 notes</span>, capturing
            new ideas.
          </p>
        </div>

        <div className="flex justify-start items-center gap-3">
          <div className="p-2 rounded-full bg-[#D0EDFB]">
            <CalendarCheck2 size={ICON_SIZE} color="#00A1EB" />
          </div>
          <p>
            You attended <span className="font-bold">7 events</span> this week.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsRecapPanel;
