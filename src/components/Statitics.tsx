type TimeEntry = {
  type: string;
  hours?: number;
  startTime?: string;
  endTime?: string;
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

const sumByType = (entries: TimeEntry[], type: string) => {
  return entries
    .filter((e) => e.type === type)
    .reduce((sum, e) => sum + getEntryHours(e), 0);
};

const getEntryHours = (entry: TimeEntry) => {
  if (entry.type === "work" && entry.startTime && entry.endTime) {
    const [sh, sm] = entry.startTime.split(":").map(Number);
    const [eh, em] = entry.endTime.split(":").map(Number);

    const start = new Date(0, 0, 0, sh, sm);
    const end = new Date(0, 0, 0, eh, em);

    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  return entry.hours || 0;
};

  const formatHours = (h: number) =>
  Number.isInteger(h) ? h : Number(h.toFixed(1));

const Statistics = ({ entries, year, month }: StatsProps) => {
  const allEntries = Object.values(entries).flat();

  const weeklyHours = 24;

  const weeklyStats: { [week: number]: number } = {};

  Object.entries(entries).forEach(([day, dayEntries]) => {
    const date = new Date(year, month, Number(day));
    const week = getWeekNumber(date);

    const worked = dayEntries
      .filter((e) => e.type === "work")
      .reduce((sum, e) => sum + getEntryHours(e), 0);

    weeklyStats[week] = (weeklyStats[week] || 0) + worked;
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const targetHours = Math.round((daysInMonth / 7) * weeklyHours);

  const workedHours = formatHours(sumByType(allEntries, "work"));
  const leaveHours = formatHours(sumByType(allEntries, "leave"));
  const compTimeHours = formatHours(sumByType(allEntries, "compTime"));
  const sickHours = formatHours(sumByType(allEntries, "sick"));
  const parentalLeaveHours = formatHours(sumByType(allEntries, "parentalLeave"));
  const homeWithChildHours = formatHours(sumByType(allEntries, "homeWithChild"));

  const balance = workedHours - targetHours;

  return (
    <div className="w-full max-w-sm md:w-64 bg-white border rounded-xl p-4 shadow-sm h-fit">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">Statistik</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between hover:bg-gray-50 px-1 rounded">
          <span className="text-gray-600">Arbetade timmar</span>
          <span className="font-medium">{workedHours}h</span>
        </div>

        <div className="flex justify-between hover:bg-gray-50 px-1 rounded">
          <span className="text-gray-600">Per vecka</span>
          <span className="font-medium">24h</span>
        </div>

        <div className="border-t my-3" />

        <div className="flex justify-between hover:bg-gray-50 px-1 rounded">
          <span className="text-gray-600">Semester</span>
          <span className="font-medium">{leaveHours}h</span>
        </div>

        <div className="flex justify-between hover:bg-gray-50 px-1 rounded">
          <span className="text-gray-600">Komptid</span>
          <span className="font-medium">{compTimeHours}h</span>
        </div>

        <div className="flex justify-between hover:bg-gray-50 px-1 rounded">
          <span className="text-gray-600">Sjuk</span>
          <span className="font-medium">{sickHours}h</span>
        </div>

        <div className="flex justify-between hover:bg-gray-50 px-1 rounded">
          <span className="text-gray-600">Vabb</span>
          <span className="font-medium">{homeWithChildHours}h</span>
        </div>

        <div className="flex justify-between hover:bg-gray-50 px-1 rounded">
          <span className="text-gray-600">Föräldraledighet</span>
          <span className="font-medium">{parentalLeaveHours}h</span>
        </div>

        <div className="flex justify-between border-t pt-2 mt-2">
          <span className="text-gray-600">Mål</span>
          <span className="font-medium">{targetHours}h</span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-gray-50">
        <div className="text-sm text-gray-500">Totalt</div>
        <div className="text-lg font-semibold">{workedHours}h</div>

        <div className="mt-2 text-sm font-semibold">
          {balance < 0 && (
            <span className="text-orange-500">{Math.abs(balance)}h kvar</span>
          )}
          {balance === 0 && <span className="text-blue-500">I fas</span>}
          {balance > 0 && (
            <span className="text-green-600">+{balance}h övertid</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
