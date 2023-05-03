import './App.css';
import axios from 'axios'
import {useEffect} from 'react'

function App() {

  useEffect(() => {
    axios.post("http://localhost:9002/test", ({ msg: "test" })).then((res) => {
      console.log(res.data);
    })
  });

  return (
    <div className="App">
      App
    </div>
  );
}

export default App;
