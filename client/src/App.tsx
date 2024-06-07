import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios' // for API requests
import YearSelector from './YearSelector.tsx'
import RaceSelector from './RaceSelector.tsx'
import DriverArranger from './DriverArranger.tsx'
import ResultsDisplay from './ResultsDisplay.tsx'
import ModelSelector from './ModelSelector.tsx'

const flaskServer = "http://localhost:5000"

export type ModelType = "GBR" | "MLP" | "CLF" | "NB";

export interface Race {
	round: number;
	name: string;
}

export interface Driver {
	driverId: number;
	grid: number; 
	position: number;
	name: string;
}

function App() {
	const [years, setYears] = useState<number[]>([]);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [races, setRaces] = useState<Race[]>([]);
	const [selectedRace, setSelectedRace] = useState<Race | null>(null);
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [prediction, setPrediction] = useState<Driver[]>([]);
	const [originalFlag, setOriginalFlag] = useState<boolean>(true); // Indicates that the fetched order is still the original order, show actual results

	const models: ModelType[] = ["GBR", "MLP", "CLF", "NB"];
	const [selectedModel, setSelectedModel] = useState<ModelType>("GBR" as ModelType);

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
				setOriginalFlag(true);

				const drivers = response.data.sort((a: Driver, b: Driver) => a.grid - b.grid) // Ascending order
	
				// Adjust grid positions
				drivers.forEach((driver: Driver, index: number) => {
					driver.grid = index + 1;
				})
				console.log("FETCHED: ", drivers);

				setDrivers(drivers) 
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
				drivers: drivers,
				model: selectedModel
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
			<div className="flex justify-center m-10 space-x-10">
				<div className="flex float-start flex-col space-y-5">
					<h1 className="font-black text-3xl">F1 Race Results Predictor</h1>
					<YearSelector years={years} selectedYear={selectedYear} setSelectedYear={setSelectedYear} setSelectedRace={setSelectedRace} setDrivers={setDrivers} setPrediction={setPrediction} />
					<RaceSelector races={races} selectedRace={selectedRace} setSelectedRace={setSelectedRace} setDrivers={setDrivers} setPrediction={setPrediction} />			
					<ModelSelector models={models} selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
					<button onClick={handlePredict} disabled={!drivers.length} className="bg-gray-800 p-3 text-xl rounded-3xl">Predict!</button>		
					<button onClick={handleClearInput} className="bg-gray-800 p-3 text-l rounded-3xl">Clear inputs</button>		
					<div className="flex flex-row items-start space-x-3">
						<div className=" inline-block space-y-2 text-xs">
							<div className="text-gray-300">Model Legend: </div>
							<div className="inline-block bg-gray-800 p-1 rounded">GBR</div> Gradient boosting regression <br/>
							<div className="inline-block bg-gray-800 p-1 rounded">MLP</div> Multi-layer perceptron regressor<br/>
							<div className="inline-block bg-gray-800 p-1 rounded">CLF</div> Decision tree classifier<br/>
							<div className="inline-block bg-gray-800 p-1 rounded">NB</div> Naive Bayes classifier<br/>
						</div>
						<div className="inline-block space-y-2 text-xs">
							<div className="text-gray-300">Prediction Legend:</div>
							<div className="inline-block bg-green-600 p-1 rounded">Gained Places</div> <br/>
							<div className="inline-block bg-red-600 p-1 rounded">Lost Places</div>
						</div>
					</div>
				</div>

				<div className="flex flex-row space-x-10">
					<DriverArranger drivers={drivers} setDrivers={setDrivers}  setOriginalFlag={setOriginalFlag}/>
					{originalFlag === true && 
						<ResultsDisplay driversRef={drivers} originalFlag={true} />}
					{prediction.length !== 0 && 
						<ResultsDisplay driversRef={prediction} originalFlag={false}/>}
				</div>

			</div>
		</>
}

export default App
