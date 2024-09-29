import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CountriesList from './CountriesList';
import CountryDetails from './CountryDetails';
import './style.css';

function App() {
  return (
    <Router>
      <div className="bg-blue-600 p-4 text-white">
      </div>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<CountriesList />} />
          <Route path="/country/:cca3" element={<CountryDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

