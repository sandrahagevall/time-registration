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
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Tidsregistrering
      </h1>

      <CheckinBar setEntries={setEntries} />

      <div className="flex flex-col lg:flex-row gap-6">

      <div className="flex-1 bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <MonthView entries={entries} setEntries={setEntries} />
      </div>
      </div>
    </div>
  )
};

export default Dashboard;