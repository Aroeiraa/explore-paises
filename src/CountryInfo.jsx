
import React from 'react';

let CountryInfo = ({ country }) => (
  <div className="info-container">
    <h1>{country.name.official}</h1>
    <p><strong>Name:</strong> {country.name.common}</p>
    <p><strong>Capital:</strong> {country.capital?.[0] || 'Not available'}</p>
    <p><strong>Region:</strong> {country.region}</p>
    <p><strong>Sub-region:</strong> {country.subregion || 'Not available'}</p>
    <p><strong>Population:</strong> {country.population.toLocaleString() || 'Not available'}</p>
    <p><strong>Area:</strong> {country.area.toLocaleString() || 'Not available'} km²</p>
    <p><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'Not available'}</p>
    <p><strong>Currencies:</strong> {country.currencies ? Object.values(country.currencies).map(currency => currency.name).join(', ') : 'Not available'}</p>
    <p><strong>Timezone:</strong> {country.timezones[0] || 'Not available'}</p>
    <p><strong>Internet Domain:</strong> {country.tld[0] || 'Not available'}</p>
    <p><strong>Dialing Code:</strong> {country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '') || 'Not available'}</p>
  </div>
);

export default CountryInfo;
