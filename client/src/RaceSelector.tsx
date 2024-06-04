import { Race, Driver } from './App.tsx'

interface RaceSelectorProps {
  races: Race[] | null;
  selectedRace: Race | null;
  setSelectedRace: (race: Race | null) => void;
  setDrivers: (drivers: Driver[]) => void;
  setPrediction: (drivers: Driver[]) => void;
}

export default function RaceSelector({races, selectedRace, setSelectedRace, setDrivers, setPrediction}: RaceSelectorProps) {
	return (
		<div>
			<label>Select Race:</label>
			<select 
				value={selectedRace ? selectedRace.round : -1}
				onChange={e => {
          const selectedRaceRound = parseInt(e.target.value);
          const race = races?.find(race => race.round === selectedRaceRound)
					setSelectedRace(race || null);
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