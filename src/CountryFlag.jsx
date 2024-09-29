
import React from 'react';
//componente funcional que recebe 'flagUrl' e 'countryName' como propriedades.
let CountryFlag = ({ flagUrl, countryName }) => (
  <div className="flag-container">
    <img src={flagUrl} alt={`Flag of ${countryName}`} />
  </div>
);

export default CountryFlag;
