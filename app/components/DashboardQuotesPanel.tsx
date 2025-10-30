import { Quote } from "lucide-react";

type Props = {
  quote: string;
  author: string;
};

const DashboardQuotesPanel = ({ quote, author }: Props) => {
  return (
    <div className="bg-[var(--primary-main)] rounded-xl px-4 py-6 flex flex-col gap-3">
      <Quote color="#ffffff" size={26} />
      <p className="text-white font-semibold text-xl">Quote of the Day</p>
      <p className="text-black text-sm italic">"{quote}"</p>
      <p className="text-xs text-gray-700">- {author}</p>
    </div>
  );
};

export default DashboardQuotesPanel;
