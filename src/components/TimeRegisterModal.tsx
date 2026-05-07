import { useState, useEffect } from "react";

interface Props {
  onSave: (value: TimeEntry) => void;
  onClose: () => void;
  initialEntry?: TimeEntry;
  onDelete?: () => void;
}

interface TimeEntry {
  hours?: number;
  type: string;
  startTime?: string;
  endTime?: string;
}

const TimeRegisterModal = ({
  onSave,
  onClose,
  initialEntry,
  onDelete,
}: Props) => {
  const [value, setValue] = useState("");
  const [type, setType] = useState("work");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (initialEntry) {
      setValue(initialEntry.hours?.toString() || "");
      setType(initialEntry.type);
      setStartTime(initialEntry.startTime || "");
      setEndTime(initialEntry.endTime || "");
    }
  }, [initialEntry]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Registrera tid</h2>
        {type === "work" ? (
          <>
            <p>Starttid:</p>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            <p>Sluttid:</p>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
          </>
        ) : (
          <>
            <p>Ange antal timmar:</p>
            <input
              type="number"
              value={value}
              placeholder="1"
              onChange={(e) => setValue(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
          </>
        )}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="work">Arbete</option>
          <option value="leave">Semester</option>
          <option value="compTime">Komptid</option>
          <option value="sick">Sjuk</option>
          <option value="homeWithChild">Vabb</option>
          <option value="parentalLeave">Föräldraledighet</option>
        </select>
        <button
          onClick={() =>
            onSave(
              type === "work"
                ? {
                    type,
                    hours: 0, // fallback (kan tas bort senare)
                    startTime,
                    endTime,
                  }
                : {
                    type,
                    hours: Number(value),
                  },
            )
          }
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 cursor-pointer"
        >
          Spara
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Avbryt
        </button>
        {initialEntry && (
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-4 py-2 rounded ml-2 cursor-pointer"
          >
            Radera
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeRegisterModal;
