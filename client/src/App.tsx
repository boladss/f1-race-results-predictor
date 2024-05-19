import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios' // for API requests

function App() {
	const [array, setArray] = useState([]);

  const fetchAPI = async () => {
		const response = await axios.get("http://127.0.0.1:5000/api/test");
		console.log(response.data);
		setArray(response.data);
	}
	
	useEffect(() => {
   fetchAPI();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
			<div className="flex-col">
			{array.map((item, index) => (
				<div key={index} className="text-center text-sm p-0 m-1 bg-red-800 rounded-3xl">
					<span>{item}</span>
				</div>
			))}
			</div>
    </div>
  )
}

export default App
