type TimeEntry = {
  hours: number
  type: string
};

type DayEntries = {
  [key: number]: TimeEntry[]
};

interface StatsProps {
  entries: DayEntries
  targetHours: number
};

const Statistics = ({ entries, targetHours }: StatsProps) => {
  const allEntries = Object.values(entries).flat();

  const workedHours = allEntries.filter(entry => entry.type === "work").reduce((sum, entry) => sum + entry.hours, 0)
  const leaveHours = allEntries.filter(entry => entry.type === "leave").reduce((sum, entry) => sum + entry.hours, 0)
  const sickHours = allEntries.filter(entry => entry.type === "sick").reduce((sum, entry) => sum + entry.hours, 0)

  const balance = workedHours - targetHours
  
  return (
   <div className="w-64 bg-white border rounded-xl p-4 shadow-sm h-fit">
  <h3 className="text-sm font-semibold text-gray-500 mb-3">
    Statistik
  </h3>

  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-600">Arbetade</span>
      <span className="font-medium">{workedHours}h</span>
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

  {/* Status */}
  <div className="mt-4 text-sm font-semibold">
    {balance < 0 && (
      <span className="text-orange-500">
        Kvar: {Math.abs(balance)}h
      </span>
    )}
    {balance === 0 && (
      <span className="text-blue-500">I fas</span>
    )}
    {balance > 0 && (
      <span className="text-green-600">
        Övertid: +{balance}h
      </span>
    )}
  </div>
</div>
  );
};

export default Statistics