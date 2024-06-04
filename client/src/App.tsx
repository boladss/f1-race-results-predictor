import { useRef, useState, useEffect } from 'react'
import './App.css'
import axios from 'axios' // for API requests
import YearSelector from './YearSelector.tsx'
import RaceSelector from './RaceSelector.tsx'

const flaskServer = "http://localhost:5000"

export interface Race {
	round: number;
	name: string;
}

export interface Driver {
	driverId: number;
	grid: number; 
	name: string;
}


function DriverArranger({drivers, setDrivers}: {drivers: Driver[], setDrivers: (drivers: Driver[] ) => void}) {
	// Draggable list based on Darwin Tech: https://www.youtube.com/watch?v=_nZCvxJOPwU
	const dragDriver = useRef<number>(0);
	const draggedOverDriver = useRef<number>(0);

	function handleDriverSort() {
		const driversClone = [...drivers];

		// Swap positions
		const temp = driversClone[dragDriver.current];
		driversClone[dragDriver.current] = driversClone[draggedOverDriver.current];
		driversClone[draggedOverDriver.current] = temp;
		
		setDrivers(driversClone);
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

function App() {
	const [years, setYears] = useState<number[]>([]);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [races, setRaces] = useState<Race[]>([]);
	const [selectedRace, setSelectedRace] = useState<Race | null>(null);
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [prediction, setPrediction] = useState<Driver[]>([]);

  const fetchYears = async () => {
		try {
			const response = await axios.get(`${flaskServer}/years`);
			// console.log(response.data);
			setYears(response.data);
		} catch (error) {
			console.error(`Error fetching years: ${error}`);
		}
	}
	useEffect(() => {
		fetchYears()
	}, [])

	const fetchRaces = async (selectedYear: number | null) => {
		if (selectedYear) {
			try {
				const response = await axios.get(`${flaskServer}/races/${selectedYear}`);
				// console.log(response.data);
				setRaces(response.data.sort((a: Race, b: Race) => a.round - b.round));
			} catch (error) {
				console.error(`Error fetching races: ${error}`);
			}
		}
	}
	useEffect(() => {
		fetchRaces(selectedYear)
	}, [selectedYear])


	const fetchDrivers = async (selectedYear: number | null, selectedRace: Race | null) => {
		if (selectedRace) {
			try {
				const response = await axios.get(`${flaskServer}/drivers/${selectedYear}/${selectedRace.round}`);
				// console.log(response.data);
				setDrivers(response.data.sort((a: Driver, b: Driver) => a.grid - b.grid)) // Ascending order
			} catch (error) {
				console.error(`Error fetching drivers: ${error}`);
			}
		}
	}
	useEffect(() => {
		fetchDrivers(selectedYear, selectedRace)
	}, [selectedYear, selectedRace])

	const handlePredict = async() => {
		try {
			const response = await axios.post(`${flaskServer}/predict`, {
				year: selectedYear,
				race: selectedRace,
				drivers: drivers
			});
			// console.log("Prediction: ", response.data);
			setPrediction(response.data);
		}	catch (error) {
			console.error(`Error fetching prediction: ${error}`);
		}
	};

	const handleClearInput = async() => {
		setYears([]);
		setSelectedYear(null);
		setRaces([]);
		setSelectedRace(null);
		setDrivers([]);
		setPrediction([]);
		await fetchYears();
	};

  return <>
			<div className="flex m-10 space-x-10">
				<div className="flex float-start flex-col space-y-5">
					<h1 className="font-black text-3xl">F1 Race Results Predictor</h1>
					<YearSelector years={years} selectedYear={selectedYear} setSelectedYear={setSelectedYear} setSelectedRace={setSelectedRace} setDrivers={setDrivers} setPrediction={setPrediction} />
					<RaceSelector races={races} selectedRace={selectedRace} setSelectedRace={setSelectedRace} setDrivers={setDrivers} setPrediction={setPrediction} />			
					<button onClick={handlePredict} disabled={!drivers.length} className="bg-gray-800 p-3 text-xl rounded-3xl">Predict!</button>		
					<button onClick={handleClearInput} className="bg-gray-800 p-3 text-l rounded-3xl">Clear inputs</button>		
				</div>

				<div className="flex flex-row space-x-10">
					<DriverArranger drivers={drivers} setDrivers={setDrivers} />

					{prediction && (
						<div>
							<h2 className="font-bold text-xl mb-2 text-center">Prediction Results:</h2>
							<table>
								{prediction.map((driver: Driver, index: number) => (
								<tr className="relative flex rounded p-1 m-1 bg-gray-800">
									<td className="flex w-7 m-0 justify-center bg-gray-700 rounded px-1" >{index+1}</td>
									<td key={driver.driverId} className="pl-2">{driver.name}</td>
								</tr>
								))}
							</table>
						</div>
					)}
				</div>

			</div>
		</>
}

export default App
