import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddCar from './Pages/AddCar';
import ListCar from './Pages/ListCar';
function App() {

  return (
    <div className="bg-[#f7f7f7] flex w-full h-[99vh] items-center justify-center">
      <Router>
        <Routes>
          <Route path= "*" element = {<Navigate to = '/addcar' />} />
          <Route path= "" element = {<Navigate to = '/addcar' />} />
          <Route path= "/addcar" element = {<AddCar/>} />
          <Route path= "/listcar" element = {<ListCar/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
