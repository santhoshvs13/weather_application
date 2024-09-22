import { useDeferredValue, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import WeatherAnalysis from './components/weatheranalysis/WeatherAnalysis';
// import Trend from './components/trend/Trend';
import Favorites from './components/favourites/Favourites';
import './App.css'




function App() {
  
  return (
    <Router> {/* Make sure the Router wraps your entire app */}
    <>
    <div className="App">
        <Navbar /><br></br>
        <Routes>
          <Route path="/" element={<WeatherAnalysis />} />
          <Route path="/favorites" element={<Favorites />} />
          {/* <Route path="/trend" element={<Trend />} /> */}
        </Routes>
      </div>
    </>
    </Router>
      
  )
}

export default App
