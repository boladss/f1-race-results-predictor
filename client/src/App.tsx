import { useRef, useState, useEffect } from 'react'
import './App.css'
import axios from 'axios' // for API requests

const flaskServer = "http://localhost:5000"

function App() {
	const [years, setYears] = useState([]);
	const [selectedYear, setSelectedYear] = useState(null);
	const [races, setRaces] = useState([]);
	const [selectedRace, setSelectedRace] = useState(null);
	const [drivers, setDrivers] = useState([]);
	// const [selectedDrivers, setSelectedDrivers] = useState([]);
	const [prediction, setPrediction] = useState(null);

  const fetchYears = async () => {
		try {
			const response = await axios.get(`${flaskServer}/years`);
			console.log(response.data);
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
				console.log(response.data);
				setRaces(response.data);
			} catch (error) {
				console.error(`Error fetching races: ${error}`);
			}
		}
	}
	useEffect(() => {
		fetchRaces(selectedYear)
	}, [selectedYear])


	const fetchDrivers = async (selectedRace) => {
		if (selectedRace) {
			try {
				const response = await axios.get(`${flaskServer}/drivers/${selectedRace}`);
				console.log(response.data);
				setDrivers(response.data);
			} catch (error) {
				console.error(`Error fetching drivers: ${error}`);
			}
		}
	}
	useEffect(() => {
		fetchDrivers(selectedRace)
	}, [selectedRace])

	const handlePredict = async() => {
		try {
			const response = await axios.post(`${flaskServer}/predict`, {
				year: selectedYear,
				race: selectedRace,
				drivers: drivers
			});
			console.log("Prediction: ", response.data);
			setPrediction(response.data);
		}	catch (error) {
			console.error(`Error fetching prediction: ${error}`);
		}
	}

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
    <div className="flex items-center justify-center h-screen">
			<div className="flex flex-col max-w-screen-lg space-y-5">
			{/* {years.map((item, index) => (
				<div key={index} className="text-center text-sm p-0 m-1 bg-red-800 rounded-3xl">
					<span>{item}</span>
				</div>
			))} */}
			<h1 className="font-black text-3xl">F1 Race Results Predictor</h1>
				<div>
					<label>Select Year:</label>
					<select onChange={e => setSelectedYear(e.target.value)} className="ml-2 p-3 bg-gray-900">
						<option value="">Select a year</option>
						{years.map(year => (
							<option key={year} value={year}>{year}</option>
						))}
					</select>
				</div>

				<div>
					<label>Select Race:</label>
					<select onChange={e => setSelectedRace(e.target.value)} className="ml-2 p-3 bg-gray-900">
						<option value="">Select a race</option>
						{races.map(race => (
							<option key={race} value={race}>{race}</option>
						))}
					</select>
				</div>

				<div>
					<label>Arrange Drivers:</label>
					{/* <select multiple onChange={e => setSelectedDrivers([...e.target.selectedOptions].map(option => option.value))} value={selectedDrivers} className="bg-gray-900">
						{drivers.map(driver => (
							<option key={driver} value={driver}>{driver}</option>
						))}
					</select> */}
					{drivers.map((driver, index) => (
						<div className="relative flex rounded p-1 m-3 bg-gray-700"
							draggable
							onDragStart={() => (dragDriver.current = index)}
							onDragEnter={() => (draggedOverDriver.current = index)}
							onDragEnd={handleDriverSort}
							onDragOver={(e) => e.preventDefault()}
						>
							<p>{driver}</p>
						</div>
					))}
				</div>

				<button onClick={handlePredict} className="flex bg-gray-900 p-3 text-xl">Predict!</button>
				{prediction && (
					<div>
						<h2 className="font-bold text-xl">Prediction Results:</h2>
						{prediction.map(driver => (
							<option key={driver} value={driver}>{driver}</option>
						))}
					</div>
				)}
			</div>
    </div>
  )
}

export default App
