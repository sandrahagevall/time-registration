import MonthView from '../components/MonthView'

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tidsregistrering
      </h1>

      <div className="border p-4 rounded-xl">
        <MonthView />
      </div>
    </div>
  )
}

export default Dashboard