import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CountriesList = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedSubregion, setSelectedSubregion] = useState('All');
  const [selectedPopulation, setSelectedPopulation] = useState('All');
  const [selectedSorting, setSelectedSorting] = useState('name');
  const [subregions, setSubregions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginated, setIsPaginated] = useState(false);
  const countriesPerPage = 20;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get('https://restcountries.com/v3.1/all');
        const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setAllCountries(sortedCountries);
        setSubregions([...new Set(sortedCountries.map(c => c.subregion).filter(Boolean))]);
        setDisplayedCountries(sortedCountries.slice(0, countriesPerPage));
      } catch (error) {
        console.error("Error fetching countries list", error);
      }
    };

    fetchCountries();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setCurrentPage(1);
  };
  const handleSubregionChange = (e) => {
    setSelectedSubregion(e.target.value);
    setCurrentPage(1);
  };
  const handlePopulationChange = (e) => {
    setSelectedPopulation(e.target.value);
    setCurrentPage(1);
  };
  const handleSortingChange = (e) => {
    setSelectedSorting(e.target.value);
    setCurrentPage(1);
  };
  const togglePagination = () => {
    setIsPaginated(prev => !prev);
    setCurrentPage(1);
  };

  const filterByPopulation = (population) => {
    switch (selectedPopulation) {
      case '<1M': return population < 1000000;
      case '1M-10M': return population >= 1000000 && population < 10000000;
      case '10M-100M': return population >= 10000000 && population < 100000000;
      case '100M-1B': return population >= 100000000 && population < 1000000000;
      case '>1B': return population >= 1000000000;
      default: return true;
    }
  };

  const sortCountries = (countries) => {
    return countries.sort((a, b) => {
      switch (selectedSorting) {
        case 'population': return a.population - b.population;
        case 'area': return a.area - b.area;
        default: return a.name.common.localeCompare(b.name.common);
      }
    });
  };

  const getFilteredCountries = () => {
    return sortCountries(
      allCountries.filter(c => {
        const matchesSearch = c.name.common.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
        const matchesSubregion = selectedSubregion === 'All' || c.subregion === selectedSubregion;
        const matchesPopulation = filterByPopulation(c.population);
        return matchesSearch && matchesRegion && matchesSubregion && matchesPopulation;
      })
    );
  };

  useEffect(() => {
    const filteredCountries = getFilteredCountries();
    if (isPaginated) {
      setDisplayedCountries(filteredCountries.slice((currentPage - 1) * countriesPerPage, currentPage * countriesPerPage));
    } else {
      setDisplayedCountries(filteredCountries.slice(0, currentPage * countriesPerPage));
    }
  }, [searchTerm, selectedRegion, selectedSubregion, selectedPopulation, selectedSorting, currentPage, isPaginated]);

  const loadMoreCountries = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    if (!isPaginated) {
      const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
          loadMoreCountries();
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isPaginated]);

  const pageNumbers = [];
  const totalCountries = getFilteredCountries().length;
  const totalPages = Math.ceil(totalCountries / countriesPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search country"
          value={searchTerm}
          onChange={handleSearchChange}
          style={inputStyle}
        />

        <select value={selectedRegion} onChange={handleRegionChange} style={inputStyle}>
          <option value="All">All Continents</option>
          {['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'].map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>

        <select value={selectedSubregion} onChange={handleSubregionChange} style={inputStyle}>
          <option value="All">All Subregions</option>
          {subregions.map(subregion => (
            <option key={subregion} value={subregion}>{subregion}</option>
          ))}
        </select>

        <select value={selectedPopulation} onChange={handlePopulationChange} style={inputStyle}>
          <option value="All">All Populations</option>
          <option value="<1M">&lt; 1M</option>
          <option value="1M-10M">1M - 10M</option>
          <option value="10M-100M">10M - 100M</option>
          <option value="100M-1B">100M - 1B</option>
          <option value=">1B">&gt; 1B</option>
        </select>

        <select value={selectedSorting} onChange={handleSortingChange} style={inputStyle}>
          <option value="name">Sort by Name</option>
          <option value="population">Sort by Population</option>
          <option value="area">Sort by Area</option>
        </select>

        <button onClick={togglePagination} style={{ marginLeft: '10px' }}>
          {isPaginated ? 'Switch to Infinite Scroll' : 'Switch to Pagination'}
        </button>
      </div>

      <div className="grid">
        {displayedCountries.map(country => (
          <div key={country.cca3} className="country-card">
            <Link to={`/country/${country.cca3}`}>
              <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} />
              <h3>{country.name.common}</h3>
            </Link>
          </div>
        ))}
      </div>

      {isPaginated && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              style={{
                ...paginationButtonStyle,
                backgroundColor: currentPage === number ? '#007BFF' : '#ddd'
              }}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  padding: '10px',
  width: '18%',
  marginRight: '10px',
  borderRadius: '15px',
};

const paginationButtonStyle = {
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  margin: '0 5px',
  border: 'none',
  transition: 'background-color 0.3s ease',
};

export default CountriesList;
