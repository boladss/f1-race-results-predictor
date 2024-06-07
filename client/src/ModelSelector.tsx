import { ModelType } from './App.tsx'

interface ModelSelectorProps {
  models: ModelType[]
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
}

export default function ModelSelector({models, selectedModel, setSelectedModel} : ModelSelectorProps) {
	return (
		<div>
			<label>Select Model:</label>
			<select 
				value={selectedModel}
				onChange={e => {
          setSelectedModel(e.target.value as ModelType);
				}} 
				className="ml-2 p-3 bg-gray-800">
				<option value="">Select a race</option>
				{models && models.map(model => (
					<option key={model} value={model}>{model}</option>
				))}
			</select>
		</div>
	)
}