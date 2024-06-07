import { Race, Driver } from './App.tsx'

interface YearSelectorProps {
  years: number[];
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  setSelectedRace: (race: Race | null) => void;
  setDrivers: (drivers: Driver[]) => void;
  setPrediction: (drivers: Driver[]) => void;
}

export default function YearSelector({years, selectedYear, setSelectedYear, setSelectedRace, setDrivers, setPrediction}: YearSelectorProps) {
	return (
		<div>
			<label>Select Year:</label>
			<select 
				value={selectedYear || undefined}
				onChange={e => {
					setSelectedYear(parseInt(e.target.value));
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