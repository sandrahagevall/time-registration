import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import TimeRegisterModal from "./TimeRegisterModal";
import Statistics from "./Statitics";
import exportToExcel from "../utils/exportToExcel";

type TimeEntry = {
  type: string;
  hours?: number;
  startTime?: string;
  endTime?: string;
};

interface Props {
  entries: {
    [key: string]: TimeEntry[];
  };
  setEntries: React.Dispatch<
    React.SetStateAction<{
      [key: string]: TimeEntry[];
    }>
  >;
}

const MonthView = ({ entries, setEntries }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);

  // gör måndag = 0
  const dayOfWeek = (firstOfMonth.getDay() + 6) % 7;

  // hitta måndagen innan månaden börjar
  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - dayOfWeek);

  const weeks: Date[][] = [];

  let current = new Date(startDate);

  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];

    for (let d = 0; d < 7; d++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    weeks.push(week);
  }

  const getWeekNumber = (date: Date) => {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((tempDate.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7,
      )
    );
  };

  const weeklyHours = 24;

  const formatHours = (h: number) =>
    Number.isInteger(h) ? h : Number(h.toFixed(1));

  const getWeekTotal = (week: Date[]) => {
    return week.reduce((sum, date) => {
      if (date.getMonth() !== month) return sum;

      const key = date.toLocaleDateString("sv-SE");

      const dayTotal =
        entries[key]
          ?.filter((e) => e.type === "work")
          .reduce((s, e) => s + getEntryHours(e), 0) ?? 0;

      return sum + dayTotal;
    }, 0);
  };

  const getEntryHours = (entry: TimeEntry) => {
    if (entry.hours !== undefined) {
      return entry.hours;
    }

    if (entry.type === "work" && entry.startTime && entry.endTime) {
      const [sh, sm] = entry.startTime.split(":").map(Number);
      const [eh, em] = entry.endTime.split(":").map(Number);

      const start = new Date(0, 0, 0, sh, sm);
      const end = new Date(0, 0, 0, eh, em);

      return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    return entry.hours || 0;
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
        onClick={() => exportToExcel(entries)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6 cursor-pointer"
      >
        Exportera till Excel
      </button>
      </div>
      <div className="flex items-center justify-center gap-6 mb-12">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
            )
          }
          className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 
           transition border border-transparent hover:border-gray-200 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("sv-SE", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
            )
          }
          className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 
           transition border border-transparent hover:border-gray-200 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* VÄNSTER: Kalender + rubrik */}
        <div className="flex-1">
          <div className="flex flex-col gap-3 md:gap-4">
            {weeks.map((week, i) => {
              const weekNumber = getWeekNumber(week[0]);
              const weekTotal = getWeekTotal(week);
              const diff = weekTotal - weeklyHours;
              const hasHours = weekTotal > 0;

              return (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-2 md:gap-4 bg-gray-50 md:bg-transparent rounded-xl p-3 md:p-0"
                >
                  {/* VECKONUMMER */}
                  <div className="text-xs text-gray-500 mb-1 md:mb-0 md:w-10 md:pt-2">
                    v.{weekNumber}
                  </div>

                  {/* DAGAR */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2 md:gap-3 flex-1">
                    {week.map((date, index) => {
                      const day = date.getDate();
                      const key = date.toLocaleDateString("sv-SE");
                      const today = new Date().toLocaleDateString("sv-SE");
                      const isToday = key === today;
                      const isCurrentMonth = date.getMonth() === month;

                      return (
                        <div
                          key={index}
                          className={`h-28 border border-gray-300 rounded-xl p-2 relative bg-white shadow-sm hover:shadow-md transition ${
                            !isCurrentMonth ? "opacity-30" : ""
                          } ${isToday ? "border-blue-500 ring-2 ring-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.35)]" : ""}`}
                        >
                          <div className="text-sm font-semibold text-gray-800">
                            {day} 
                          </div>

                          {isCurrentMonth && (
                            <>
                              <div className="text-xs text-gray-500 mt-0.5 px-0.5">
                                {formatHours(
                                  entries[key]
                                    ?.filter((e) => e.type === "work")
                                    .reduce(
                                      (sum, e) => sum + getEntryHours(e),
                                      0,
                                    ) ?? 0,
                                )}
                                h
                              </div>

                              {entries[key]?.map((entry, i) => (
                                <div
                                  key={i}
                                  onClick={() => {
                                    setSelectedDay(key);
                                    setEditIndex(i);
                                    setShowModal(true);
                                  }}
                                  className="cursor-pointer p-1 rounded hover:bg-gray-100 text-xs"
                                >
                                  {entry.type === "work" &&
                                  entry.startTime &&
                                  entry.endTime ? (
                                    <>
                                      {entry.startTime}-{entry.endTime}
                                    </>
                                  ) : (
                                    <>
                                      {formatHours(getEntryHours(entry))}h -{" "}
                                      {entry.type}
                                    </>
                                  )}
                                </div>
                              ))}

                              <div className="absolute bottom-2 right-2">
                                <Plus
                                  onClick={() => {
                                    setSelectedDay(key);
                                    setEditIndex(null);
                                    setShowModal(true);
                                  }}
                                  className="w-5 h-5 text-blue-500 cursor-pointer hover:scale-110 bg-white rounded-full shadow p-0.5"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* VECKOSALDO */}
                  <div className="w-20 text-xs text-right pt-2">
                    <div>{formatHours(weekTotal)}h</div>
                    <div className="w-full bg-gray-200 h-1.5 rounded mt-1">
                      <div
                        className="h-1.5 rounded bg-blue-500"
                        style={{
                          width: `${Math.min((weekTotal / weeklyHours) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    {hasHours && (
                      <div
                        className={
                          diff > 0
                            ? "text-green-600"
                            : diff < 0
                              ? "text-orange-500"
                              : "text-gray-500"
                        }
                      >
                        ({diff > 0 && `+${formatHours(diff)}h övertid`}
                        {diff < 0 && `${formatHours(Math.abs(diff))}h kvar`}
                        {diff === 0 && "klart"})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HÖGER: Statistik */}
        <div className="w-full md:w-64 flex justify-center md:justify-end">
          <Statistics entries={entries} year={year} month={month} />
        </div>

        {/* Modal (oförändrad) */}
        {showModal && (
          <TimeRegisterModal
            onSave={(value) => {
              if (!selectedDay) return;

              setEntries((prev) => {
                const dayEntries = [...(prev[selectedDay] || [])];
                if (editIndex !== null) {
                  dayEntries[editIndex] = value;
                } else {
                  dayEntries.push(value);
                }
                return {
                  ...prev,
                  [selectedDay]: dayEntries,
                };
              });
              setShowModal(false);
              setEditIndex(null);
            }}
            onDelete={() => {
              if (selectedDay === null || editIndex === null) return;

              setEntries((prev) => {
                const dayEntries = [...(prev[selectedDay] || [])];

                dayEntries.splice(editIndex, 1);

                return {
                  ...prev,
                  [selectedDay]: dayEntries,
                };
              });

              setShowModal(false);
              setEditIndex(null);
            }}
            onClose={() => {
              setShowModal(false);
              setEditIndex(null);
            }}
            initialEntry={
              selectedDay !== null && editIndex !== null
                ? entries[selectedDay]?.[editIndex]
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default MonthView;
