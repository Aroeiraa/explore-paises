import React, { useState, useEffect, useCallback } from 'react';
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
  const [isPaginated, setIsPaginated] = useState(false); // Define se é scroll infinito ou paginado
  const countriesPerPage = 20; // Quantidade de países por página

  // Busca os países ao montar o componente
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get('https://restcountries.com/v3.1/all');
        const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setAllCountries(sortedCountries);
        setSubregions([...new Set(sortedCountries.map(c => c.subregion).filter(Boolean))]);
        setDisplayedCountries(sortedCountries.slice(0, countriesPerPage)); // Exibe a primeira "página"
      } catch (error) {
        console.error("Error fetching countries list", error);
      }
    };

    fetchCountries();
  }, []);

  // Funções de manipulação dos filtros
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setCurrentPage(1); // Reinicia a página ao mudar o filtro
  };
  const handleSubregionChange = (e) => {
    setSelectedSubregion(e.target.value);
    setCurrentPage(1); // Reinicia a página ao mudar o filtro
  };
  const handlePopulationChange = (e) => {
    setSelectedPopulation(e.target.value);
    setCurrentPage(1); // Reinicia a página ao mudar o filtro
  };
  const handleSortingChange = (e) => {
    setSelectedSorting(e.target.value);
    setCurrentPage(1); // Reinicia a página ao mudar a ordenação
  };

  // Função para alternar entre scroll infinito e paginação
  const togglePagination = () => {
    setIsPaginated(prev => !prev);
    setCurrentPage(1); // Reinicia a contagem de páginas
  };

  // Filtro de população
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

  // Ordenação de países
  const sortCountries = (countries) => {
    return countries.sort((a, b) => {
      switch (selectedSorting) {
        case 'population': return a.population - b.population;
        case 'area': return a.area - b.area;
        default: return a.name.common.localeCompare(b.name.common);
      }
    });
  };

  // Aplica os filtros e retorna a lista de países filtrada
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

  // Atualiza os países exibidos quando qualquer filtro muda
  useEffect(() => {
    const filteredCountries = getFilteredCountries();
    if (isPaginated) {
      setDisplayedCountries(filteredCountries.slice((currentPage - 1) * countriesPerPage, currentPage * countriesPerPage));
    } else {
      setDisplayedCountries(filteredCountries.slice(0, currentPage * countriesPerPage));
    }
  }, [searchTerm, selectedRegion, selectedSubregion, selectedPopulation, selectedSorting, currentPage, isPaginated]);

  // Carrega mais países no scroll
  const loadMoreCountries = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  // Detecta scroll até o final da página
  useEffect(() => {
    if (!isPaginated) {
      const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
          loadMoreCountries();
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll); // Limpa o evento ao desmontar
    }
  }, [isPaginated]);

  // Renderização
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

        <button n onClick={togglePagination} style={{ marginLeft: '10px' }}>
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

      {/* Paginação manual */}
      {isPaginated && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => setCurrentPage(prev => prev + 1)}>Load More</button>
        </div>
      )}
    </div>
  );
};

// Estilo para inputs e selects
const inputStyle = {
  padding: '10px',
  width: '18%',
  marginRight: '10px',
  borderRadius: '15px',
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '25px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',}

  const paginationButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  };

export default CountriesList;
