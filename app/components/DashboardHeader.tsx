type PageProps = {
  name: String;
};

const DashboardHeader = ({ name }: PageProps) => {
  return (
    <div className="w-full mb-8">
      <p className="text-black text-2xl font-semibold">
        Good day, <span className="text-black text-4xl font-bold">{name}</span>
      </p>
      <p className="text-sm text-gray-500">
        Welcome back! Here's your snapshot for the day.
      </p>
    </div>
  );
};

export default DashboardHeader;
