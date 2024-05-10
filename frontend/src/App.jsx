import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [responseText, setResponseText] = useState('');
  
  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:8001/getRandomWord');
      setResponseText(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <div>
      <h1>Backend Response:</h1>
      <button onClick={fetchData}>Fetch Data</button>
      <p>{responseText}</p>
    </div>
  );
}

export default App;


