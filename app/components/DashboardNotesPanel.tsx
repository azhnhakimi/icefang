import { NotebookPen, ChevronRight } from "lucide-react";

const mockData: any[] = [
  {
    notesName: "Pikachu used thnderwave",
    notesDetails: "The opposing kyogre is paralyzed!",
  },
  {
    notesName: "Sableye used will-o-wisp",
    notesDetails:
      "The opposing lucario is burned! The opposing lucario is burned! The opposing lucario is burned! The opposing lucario is burned! The opposing lucario is burned!",
  },
  {
    notesName: "Venasaur used spore",
    notesDetails: "The opposing infernape is fast asleep!",
  },
];

type PanelItemProps = {
  notesName: string;
  notesDetails: string;
};

const PanelItem = ({ notesName, notesDetails }: PanelItemProps) => {
  return (
    <div className="bg-[var(--primary-light)] px-4 py-3 rounded-xl flex justify-center items-center gap-3 hover:bg-[var(--primary-variation)] hover:cursor-pointer">
      <div className="p-2 bg-[var(--primary-variation)] rounded-xl ">
        <NotebookPen size={22} className="text-[var(--primary-main)]" />
      </div>
      <div className="flex-1">
        <p className="text-black font-semibold text-medium line-clamp-1">
          {notesName}
        </p>
        <p className="text-sm text-gray-600 line-clamp-1">{notesDetails}</p>
      </div>
      <ChevronRight className="text-[var(--primary-dark)]" size={20} />
    </div>
  );
};

const DashboardNotesPanel = () => {
  return (
    <div className="bg-white rounded-xl p-6 flex flex-col gap-3 border-2 border-gray-200">
      <p className="text-xl font-bold mb-4">Quick Notes</p>
      {mockData.length > 0 ? (
        mockData.map((note, index) => (
          <PanelItem
            key={index}
            notesName={note.notesName}
            notesDetails={note.notesDetails}
          />
        ))
      ) : (
        <p className="text-sm text-gray-500">No notes have been created...</p>
      )}
    </div>
  );
};

export default DashboardNotesPanel;
