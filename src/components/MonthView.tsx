import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import TimeRegisterModal from "./TimeRegisterModal";
import Statistics from "./Statitics";

type TimeEntry = {
  type: string;
  hours?: number;
  startTime?: string;
  endTime?: string;
};

const MonthView = () => {
  const [entries, setEntries] = useState<{
    [key: number]: TimeEntry[];
  }>(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : {};
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  console.log("RENDER editIndex:", editIndex);

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  const currentDate = new Date();
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

  const getWeekTotal = (week: Date[]) => {
    return week.reduce((sum, date) => {
      if (date.getMonth() !== month) return sum;

      const day = date.getDate();

      const dayTotal =
        entries[day]
          ?.filter((e) => e.type === "work")
          .reduce((s, e) => s + getEntryHours(e), 0) ?? 0;

      return sum + dayTotal;
    }, 0);
  };

  const getEntryHours = (entry: {
    hours?: number;
    startTime?: string;
    endTime?: string;
    type: string;
  }) => {
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
      <h2 className="text-xl font-bold mb-4">
        {currentDate.toLocaleString("sv-SE", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* VÄNSTER: Kalender + rubrik */}
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            {weeks.map((week, i) => {
              const weekNumber = getWeekNumber(week[0]);
              const weekTotal = getWeekTotal(week);
              const diff = weekTotal - weeklyHours;
              const hasHours = weekTotal > 0;

              return (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-2 md:gap-4 bg-gray-50 md:bg-transparent rounded-lg p-2 md:p-0"
                >
                  {/* VECKONUMMER */}
                  <div className="text-xs text-gray-500 mb-1 md:mb-0 md:w-10 md:pt-2">
                    v.{weekNumber}
                  </div>

                  {/* DAGAR */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3 flex-1">
                    {week.map((date, index) => {
                      const day = date.getDate();
                      const isCurrentMonth = date.getMonth() === month;

                      return (
                        <div
                          key={index}
                          className={`h-28 md:h-24 border rounded-lg p-2 relative bg-white ${
                            !isCurrentMonth ? "opacity-30" : ""
                          }`}
                        >
                          <div className="text-sm font-semibold">{day}</div>

                          {isCurrentMonth && (
                            <>
                              <div className="text-xs text-gray-500">
                                {entries[day]
                                  ?.filter((e) => e.type === "work")
                                  .reduce(
                                    (sum, e) => sum + getEntryHours(e),
                                    0,
                                  ) ?? 0}
                                h
                              </div>

                              {entries[day]?.map((entry, i) => (
                                <div
                                  key={i}
                                  onClick={() => {
                                    console.log("CLICKED ENTRY INDEX:", i);
                                    setSelectedDay(day);
                                    setEditIndex(i);
                                    setShowModal(true);
                                  }}
                                  className="cursor-pointer p-1 rounded hover:bg-gray-100 text-xs"
                                >
                                  {entry.type === "work" &&
                                  entry.startTime &&
                                  entry.endTime ? (
                                    <>
                                      {getEntryHours(entry)}h ({entry.startTime}
                                      -{entry.endTime})
                                    </>
                                  ) : (
                                    <>
                                      {getEntryHours(entry)}h - {entry.type}
                                    </>
                                  )}
                                </div>
                              ))}

                              <div className="absolute bottom-2 right-2">
                                <Plus
                                  onClick={() => {
                                    setSelectedDay(day);
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
                    <div>{weekTotal}h</div>
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
                        ({diff > 0 && `+${diff}h övertid`}
                        {diff < 0 && `${Math.abs(diff)}h kvar`}
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
              console.log("SAVING editIndex:", editIndex);
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
            onClose={() => setShowModal(false)}
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
