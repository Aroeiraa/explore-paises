
import React from 'react';

let CountryFlag = ({ flagUrl, countryName }) => (
  <div className="flag-container">
    <img src={flagUrl} alt={`Flag of ${countryName}`} />
  </div>
);

export default CountryFlag;
