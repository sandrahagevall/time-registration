import { useState } from "react";

interface Props {
  setEntries: React.Dispatch<
    React.SetStateAction<{
      [key: number]: any[];
    }>
  >;
}

const CheckInBar = ({ setEntries }: Props) => {
  const [activeSession, setActiveSession] = useState<{
    day: number;
    startTime: string;
  } | null>(null);

  const today = new Date();
  const todayDay = today.getDate();

  const handleCheckIn = () => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    setActiveSession({
      day: todayDay,
      startTime: time,
    });
  };

  const handleCheckOut = () => {
    if (!activeSession) return;

    const now = new Date();
    const endTime = now.toTimeString().slice(0, 5);

    const newEntry = {
      type: "work",
      startTime: activeSession.startTime,
      endTime,
    };

    setEntries((prev) => ({
      ...prev,
      [activeSession.day]: [...(prev[activeSession.day] || []), newEntry],
    }));

    setActiveSession(null);
  };

  return (
    <div className="mb-4 p-3 rounded-xl bg-white shadow-sm border flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">Idag</div>
        <div className="font-semibold">
          {todayDay} {today.toLocaleString("sv-SE", { month: "long" })}
        </div>
      </div>

      <div>
        {activeSession ? (
          <button
            onClick={handleCheckOut}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Check out
          </button>
        ) : (
          <button
            onClick={handleCheckIn}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Check in
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckInBar;
