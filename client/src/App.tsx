import { useRef, useState, useEffect } from 'react'
import './App.css'
import axios from 'axios' // for API requests

const flaskServer = "http://localhost:5000"

function YearSelector({years, selectedYear, setSelectedYear, setRaces, setSelectedRace, setDrivers, setPrediction}) {
	return (
		<div>
			<label>Select Year:</label>
			<select 
				value={selectedYear || null}
				onChange={e => {
					setSelectedYear(parseInt(e.target.value));
					setRaces=([]);
					setSelectedRace(null);
					setDrivers([]);
					setPrediction([]);
				}} 
				className="ml-2 p-3 bg-gray-800">
				<option value="">Select a year</option>
				{years.map(year => (
					<option key={year} value={year}>{year}</option>
				))}
			</select>
		</div>
	)
}

function RaceSelector({races, selectedRace, setSelectedRace, setDrivers, setPrediction}) {
	return (
		<div>
			<label>Select Race:</label>
			<select 
				value={selectedRace || null}
				onChange={e => {
					setSelectedRace(e.target.value);
					setDrivers([]);
					setPrediction([]);
				}} 
				className="ml-2 p-3 bg-gray-800">
				<option value="">Select a race</option>
				{races && races.map(race => (
					<option key={race.round} value={race.round}>{race.name}</option>
				))}
			</select>
		</div>
	)
}

function DriverArranger({drivers, setDrivers}) {
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
					<td key={driver.driverId} value={driver.driverId} className="pl-2">{driver.name}</td>
				</tr>
			))}
			</table>
		</div>
	)
}

function App() {
	const [years, setYears] = useState([]);
	const [selectedYear, setSelectedYear] = useState(null);
	const [races, setRaces] = useState([]);
	const [selectedRace, setSelectedRace] = useState(null);
	const [drivers, setDrivers] = useState([]);
	const [prediction, setPrediction] = useState([]);

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

	const fetchRaces = async (selectedYear) => {
		if (selectedYear) {
			try {
				const response = await axios.get(`${flaskServer}/races/${selectedYear}`);
				// console.log(response.data);
				setRaces(response.data);
			} catch (error) {
				console.error(`Error fetching races: ${error}`);
			}
		}
	}
	useEffect(() => {
		fetchRaces(selectedYear)
	}, [selectedYear])


	const fetchDrivers = async (selectedYear, selectedRace) => {
		if (selectedRace) {
			try {
				const response = await axios.get(`${flaskServer}/drivers/${selectedYear}/${selectedRace}`);
				// console.log(response.data);
				setDrivers(response.data.sort((a,b) => a.grid - b.grid)) // Ascending order
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
					{/* {years.map((item, index) => (
						<div key={index} className="text-center text-sm p-0 m-1 bg-red-800 rounded-3xl">
						<span>{item}</span>
						</div>
					))} */}
					<h1 className="font-black text-3xl">F1 Race Results Predictor</h1>
					<YearSelector years={years} selectedYear={selectedYear} setSelectedYear={setSelectedYear} setRaces={setRaces} setSelectedRace={setSelectedRace} setDrivers={setDrivers} setPrediction={setPrediction} />
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
								{prediction.map((driver, index) => (
								<tr className="relative flex rounded p-1 m-1 bg-gray-800">
									<td className="flex w-7 m-0 justify-center bg-gray-700 rounded px-1" >{index+1}</td>
									<td key={driver.driverId} value={driver.driverId} className="pl-2">{driver.name}</td>
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
