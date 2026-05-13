import { useState, useEffect } from "react";

type TimeEntry = {
  type: string;
  hours?: number;
  startTime?: string;
  endTime?: string;
};

interface Props {
  setEntries: React.Dispatch<
    React.SetStateAction<{
      [key: string]: TimeEntry[];
    }>
  >;
}

const CheckInBar = ({ setEntries }: Props) => {
  const [activeSession, setActiveSession] = useState<{
    date: string;
    startTime: string;
  } | null>(() => {
    const saved = localStorage.getItem("activeSession");
    return saved ? JSON.parse(saved) : null;
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  const calculateHours = (startTime: string, endTime: string) => {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(sh, sm, 0, 0);

    const end = new Date();
    end.setHours(eh, em, 0, 0);

    let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (hours > 5) {
      hours -= 0.5;
    }

    return hours;
  };

  // 💾 spara session
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem("activeSession", JSON.stringify(activeSession));
    } else {
      localStorage.removeItem("activeSession");
    }
  }, [activeSession]);

  // ⏱ live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 🌙 auto checkout vid ny dag
  useEffect(() => {
    if (!activeSession) return;

    const todayKey = new Date().toLocaleDateString("sv-SE");

    if (activeSession.date !== todayKey) {
      const endTime = "23:59";

      const hours = calculateHours(
        activeSession.startTime,
        endTime
      );

      const newEntry = {
        type: "work",
        startTime: activeSession.startTime,
        endTime,
        hours,
      };

      setEntries((prev) => ({
        ...prev,
        [activeSession.date]: [
          ...(prev[activeSession.date] || []),
          newEntry,
        ],
      }));

      setActiveSession(null);
    }
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getElapsedTime = () => {
    if (!activeSession) return 0;

    const nowTime = currentTime.toTimeString().slice(0, 5);

    return calculateHours(activeSession.startTime, nowTime);
  };

  const formattedElapsed = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const today = new Date();
  const todayDay = today.getDate();

  // ✅ CHECK IN
  const handleCheckIn = () => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const todayKey = now.toLocaleDateString("sv-SE");

    setActiveSession({
      date: todayKey,
      startTime: time,
    });
  };

  // ✅ CHECK OUT
  const handleCheckOut = () => {
    if (!activeSession) return;

    const now = new Date();
    const endTime = now.toTimeString().slice(0, 5);
    const hours = getElapsedTime();

    const newEntry = {
      type: "work",
      startTime: activeSession.startTime,
      endTime,
      hours,
    };

    setEntries((prev) => ({
      ...prev,
      [activeSession.date]: [
        ...(prev[activeSession.date] || []),
        newEntry,
      ],
    }));

    setActiveSession(null);
  };

  return (
    <div className="mb-4 p-4 md:p-5 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 border border-gray-300 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500">
          Idag
        </div>
        <div className="text-lg font-semibold">
          {todayDay} {today.toLocaleString("sv-SE", { month: "long" })}
        </div>
        <div className="text-sm text-gray-500">{formattedTime}</div>
      </div>

      <div>
        {activeSession ? (
          <button
            onClick={handleCheckOut}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            Check out
          </button>
        ) : (
          <button
            onClick={handleCheckIn}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            Check in
          </button>
        )}

        {activeSession && (
          <div className="text-sm font-medium text-gray-700 mt-1">
            {formattedElapsed(getElapsedTime())}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInBar;
