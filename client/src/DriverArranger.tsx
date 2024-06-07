import { useRef } from 'react'
import { Driver } from './App.tsx'

interface DriverArrangerProps {
  drivers: Driver[];
  setDrivers: (drivers: Driver[]) => void;
  setOriginalFlag: (originalFlag: boolean) => void;
}

export default function DriverArranger({drivers, setDrivers, setOriginalFlag}: DriverArrangerProps) {
	// Draggable list based on Darwin Tech: https://www.youtube.com/watch?v=_nZCvxJOPwU
	const dragDriver = useRef<number | null>(null);
	const draggedOverDriver = useRef<number | null>(null);

	function handleDriverSort() {
    if (dragDriver.current === null || draggedOverDriver.current === null) return;
		const driversClone = [...drivers];

    // Now predicting
    setOriginalFlag(false);

    // Remove and insert the dragged item
    const [movedItem] = driversClone.splice(dragDriver.current, 1);
    driversClone.splice(draggedOverDriver.current, 0, movedItem);

    // Update grid values
    driversClone.forEach((driver, index) => {
      driver.grid = index + 1;
    })

    // Update drivers list
    setDrivers(driversClone);

    dragDriver.current = null;
    draggedOverDriver.current = null;
	}
	
	return (
		<div>
			<h2 className="font-bold text-xl mb-2 text-center">Arrange Drivers:</h2>
			<table>
			{drivers && drivers.map((driver, index) => (
				<tr className="relative flex rounded p-1 m-1 bg-gray-800"
				draggable
				onDragStart={() => (dragDriver.current = index)}
				onDragEnter={() => (draggedOverDriver.current = index)}
				onDragEnd={handleDriverSort}
				onDragOver={(e) => e.preventDefault()}
				>
					<td className="flex w-7 m-0 justify-center bg-gray-700 rounded px-1" >{index+1}</td>
					<td key={driver.driverId} className="pl-2">{driver.name}</td>
				</tr>
			))}
			</table>
		</div>
	)
}