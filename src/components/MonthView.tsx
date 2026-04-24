import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import TimeRegisterModal from "./TimeRegisterModal";
import Statistics from "./Statitics";

const MonthView = () => {
  const [entries, setEntries] = useState<{
    [key: number]: { hours: number; type: string }[];
  }>(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : {};
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  //Antal dagar i månaden
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Vilken dag månaden börjar (0=söndag)
  const firstDay = new Date(year, month, 1).getDay();

  // gör måndag = 0 istället
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const days: (number | null)[] = [];

  // tomma rutor i början
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }

  // riktiga dagar
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {currentDate.toLocaleString("sv-SE", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* VÄNSTER: Kalender + rubrik */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div key={index} className="h-24 border rounded-lg p-2">
                {day && (
                  <>
                    <div className="text-sm font-semibold">{day}</div>

                    <div className="text-xs text-gray-500">
                      {entries[day]
                        ?.filter((entry) => entry.type === "work")
                        .reduce(
                          (sum, entry) => sum + (Number(entry.hours) || 0),
                          0,
                        ) ?? 0}
                      h
                    </div>

                    {entries[day]?.map((entry, i) => (
                      <div key={i} className="text-[10px] text-gray-400">
                        {entry.hours}h - {entry.type}
                      </div>
                    ))}

                    <div className="flex justify-end mt-4">
                      <Plus
                        onClick={() => {
                          setSelectedDay(day);
                          setShowModal(true);
                        }}
                        className="w-5 h-5 text-blue-500 font-bold cursor-pointer hover:scale-110"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HÖGER: Statistik */}
        <div className="w-full md:w-64">
          <Statistics entries={entries} targetHours={80} />
        </div>

        {/* Modal (oförändrad) */}
        {showModal && (
          <TimeRegisterModal
            onSave={(value) => {
              if (!selectedDay) return;
              setEntries((prev) => ({
                ...prev,
                [selectedDay]: [...(prev[selectedDay] || []), value],
              }));
              setShowModal(false);
            }}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MonthView;
