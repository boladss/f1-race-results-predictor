import { Driver } from './App.tsx'

export default function ResultsDisplay({ driversRef, originalFlag }: { driversRef: Driver[], originalFlag: boolean }) {
  const title = originalFlag?  "Actual Results:" : "Prediction Results:";
  let drivers = [...driversRef]; // Prevent modifying original driver arrangement
  if (originalFlag) {
    drivers = drivers.sort((a: Driver, b: Driver) => a.position - b.position)
  }

  return (
    <div>
      <h2 className="font-bold text-xl mb-2 text-center">{title}</h2>
      <table>
        {drivers.map((driver: Driver, index: number) => {
          const difference = index+1 - driver.grid;
          let bgColorClass = 'bg-gray-800';
          if (difference < 0) bgColorClass = 'bg-green-600'
          if (difference > 0) bgColorClass = 'bg-red-600'
          return (
            <tr className={`relative flex rounded p-1 m-1 ${bgColorClass}`}>
              <td className="flex w-7 m-0 justify-center bg-gray-700 rounded px-1" >{index+1}</td>
              <td key={driver.driverId} className="pl-2">{driver.name}</td>
            </tr>
          )
        })}
      </table>
    </div>
)
}


