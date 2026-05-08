import MonthView from '../components/MonthView';
import CheckinBar from '../components/CheckInBar';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : {};
  });
  
    useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tidsregistrering
      </h1>

      <CheckinBar setEntries={setEntries} />
      <div className="border p-4 rounded-xl">
        <MonthView entries={entries} setEntries={setEntries} />
      </div>
    </div>
  )
};

export default Dashboard;