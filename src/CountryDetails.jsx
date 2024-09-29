
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import CountryFlag from './CountryFlag'; // Importação do componente CountryFlag
import CountryInfo from './CountryInfo'; // Importação do componente CountryInfo

let CountryDetails = () => {
  let { cca3 } = useParams();
  let [country, setCountry] = useState(null);

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/alpha/${cca3}`)
      .then(response => setCountry(response.data[0]))
      .catch(error => console.error('Error loading country details', error));
  }, [cca3]);

  if (!country) return <div>Loading...</div>;

  return (
    <div className="country-details">
      <Link to="/" className="back-link">← Voltar</Link>
      <div className="details-container">
        <CountryFlag flagUrl={country.flags.svg} countryName={country.name.common} />
        <CountryInfo country={country} />
      </div>
    </div>
  );
};

export default CountryDetails;
