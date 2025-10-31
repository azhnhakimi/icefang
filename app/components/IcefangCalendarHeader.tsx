import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageProps = {
  handlePrev: () => void;
  handleNext: () => void;
  handleToday: () => void;
  getHeaderLabel: () => string;
  view: "month" | "week" | "day";
  setView: React.Dispatch<React.SetStateAction<"month" | "week" | "day">>;
};

const IcefangCalendarHeader = ({
  handlePrev,
  handleNext,
  handleToday,
  getHeaderLabel,
  view,
  setView,
}: PageProps) => {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-6">
      <div className="flex items-center space-x-4">
        <div className="flex gap-3 items-center justify-between">
          <Button variant="outline" size="icon" onClick={handlePrev}>
            ←
          </Button>
          <div className="text-lg font-semibold">{getHeaderLabel()}</div>
          <Button variant="outline" size="icon" onClick={handleNext}>
            →
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={handleToday}
          className="cursor-pointer text-white bg-[var(--primary-dark)] transition-all duration-300 hover:bg-[var(--primary-dark-hover)]"
        >
          Today
        </Button>
      </div>

      <div className="flex space-x-2 rounded-lg bg-gray-200 p-1">
        {["month", "week", "day"].map((mode) => (
          <Button
            key={mode}
            onClick={() => setView(mode as any)}
            className={cn(
              "transition-all duration-200",
              view === mode
                ? "bg-white text-black hover:bg-white"
                : "bg-gray-200 text-gray-600 hover:cursor-pointer hover:bg-gray-300"
            )}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default IcefangCalendarHeader;
