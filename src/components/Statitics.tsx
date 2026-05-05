type TimeEntry = {
  hours: number;
  type: string;
};

type DayEntries = {
  [key: number]: TimeEntry[];
};

interface StatsProps {
  entries: DayEntries;
  year: number;
  month: number;
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

const Statistics = ({ entries, year, month }: StatsProps) => {
  const allEntries = Object.values(entries).flat();

  const weeklyHours = 24;

  const weeklyStats: { [week: number]: number } = {};

  Object.entries(entries).forEach(([day, dayEntries]) => {
    const date = new Date(year, month, Number(day));
    const week = getWeekNumber(date);

    const worked = dayEntries
      .filter((e) => e.type === "work")
      .reduce((sum, e) => sum + e.hours, 0);

    weeklyStats[week] = (weeklyStats[week] || 0) + worked;
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const targetHours = Math.round((daysInMonth / 7) * weeklyHours);

  const workedHours = allEntries
    .filter((entry) => entry.type === "work")
    .reduce((sum, entry) => sum + entry.hours, 0);

  const leaveHours = allEntries
    .filter((entry) => entry.type === "leave")
    .reduce((sum, entry) => sum + entry.hours, 0);

  const sickHours = allEntries
    .filter((entry) => entry.type === "sick")
    .reduce((sum, entry) => sum + entry.hours, 0);

  const balance = workedHours - targetHours;

  return (
    <div className="w-64 bg-white border rounded-xl p-4 shadow-sm h-fit">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">Statistik</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Arbetade</span>
          <span className="font-medium">{workedHours}h</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Per vecka</span>
          <span className="font-medium">24h</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Frånvaro</span>
          <span className="font-medium">{leaveHours}h</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Sjuk</span>
          <span className="font-medium">{sickHours}h</span>
        </div>

        <div className="flex justify-between border-t pt-2 mt-2">
          <span className="text-gray-600">Mål</span>
          <span className="font-medium">{targetHours}h</span>
        </div>
      </div>

      <div className="mt-4 border-t pt-3">
        <h4 className="text-sm font-semibold text-gray-500 mb-2">Veckor</h4>

        {Object.entries(weeklyStats)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([week, hours]) => {
            const diff = hours - weeklyHours;

            return (
              <div key={week} className="flex justify-between text-sm">
                <span>v.{week}</span>
                <span>
                  {hours}h{" "}
                  <span
                    className={
                      diff > 0
                        ? "text-green-600"
                        : diff < 0
                          ? "text-orange-500"
                          : "text-gray-500"
                    }
                  >
                    ({diff > 0 ? "+" : ""}
                    {diff}h)
                  </span>
                </span>
              </div>
            );
          })}
      </div>

      <div className="mt-4 text-sm font-semibold">Totalt: {workedHours}h</div>

      {/* Status */}
      <div className="mt-4 text-sm font-semibold">
        {balance < 0 && (
          <span className="text-orange-500">Kvar: {Math.abs(balance)}h</span>
        )}
        {balance === 0 && <span className="text-blue-500">I fas</span>}
        {balance > 0 && (
          <span className="text-green-600">Övertid: +{balance}h</span>
        )}
      </div>
    </div>
  );
};

export default Statistics;
