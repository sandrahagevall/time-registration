import { useState } from "react"

interface Props {
  onSave: (value: TimeEntry) => void
  onClose: () => void
}

interface TimeEntry {
  hours: number
  type: string
}

const TimeRegisterModal = ({ onSave, onClose }: Props) => { 
  const [value, setValue] = useState("")
  const [type, setType] = useState("work")

  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Registrera tid</h2>
        <p>Ange antal timmar:</p>
          <input
            type="number"
            value={value}
            placeholder="1"
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 rounded w-full mb-4"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="work">Arbete</option>
          <option value="leave">Ledig</option>
          <option value="sick">Sjuk</option>
        </select>
        <button
          onClick={() => onSave({ hours: Number(value), type })}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 cursor-pointer">
        Spara
      </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">
        Avbryt
      </button>
      </div>
    </div>
  )
}

export default TimeRegisterModal