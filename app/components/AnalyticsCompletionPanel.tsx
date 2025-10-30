import AnalyticsCompletionHeatmap from "./AnalyticsCompletionHeatmap";

const sampleData = [
  { date: "2025-10-10", count: 1 },
  { date: "2025-10-11", count: 2 },
  { date: "2025-10-12", count: 3 },
  { date: "2025-10-13", count: 4 },
  { date: "2025-10-14", count: 5 },
];

const AnalyticsCompletionPanel = () => {
  return (
    <div className="bg-white rounded-xl px-4 py-6 border-2 border-gray-200">
      <p className="text-xl font-bold mb-6">Task Completion Heatmap</p>
      <div className="w-full flex justify-center items-center">
        <AnalyticsCompletionHeatmap
          data={sampleData}
          squareSize={14}
          squareGap={6}
        />
      </div>
    </div>
  );
};

export default AnalyticsCompletionPanel;
