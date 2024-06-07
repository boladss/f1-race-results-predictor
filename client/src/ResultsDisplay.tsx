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
          const placesGained = driver.grid - (index+1);
          let bgColorClass = 'bg-gray-800';

          switch(true) {
            case placesGained >= 5: bgColorClass = `bg-green-600/100`; break;
            case placesGained >= 3: bgColorClass = `bg-green-600/75`; break;
            case placesGained >= 1: bgColorClass = `bg-green-600/50`; break;
            case placesGained <= -5: bgColorClass = `bg-red-600/100`; break;
            case placesGained <= -3: bgColorClass = `bg-red-600/75`; break;
            case placesGained <= -1: bgColorClass = `bg-red-600/50`; break;
            default: bgColorClass = 'bg-gray-800'; break;
          }

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


