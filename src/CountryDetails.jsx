import React, { useState, useEffect } from 'react'; 
import { useParams, Link } from 'react-router-dom'; 
import axios from 'axios'; 
import CountryFlag from './CountryFlag'; 
import CountryInfo from './CountryInfo'; 

let CountryDetails = () => { 
  let { cca3 } = useParams(); // Pega o código do país (cca3) a partir da URL usando 'useParams'.
  let [country, setCountry] = useState(null); // Cria um estado inicial 'country' como null, que armazenará os dados do país.

  useEffect(() => { // useEffect para buscar os dados do país ao carregar o componente ou quando 'cca3' mudar.
    axios.get(`https://restcountries.com/v3.1/alpha/${cca3}`) // Faz a requisição à API para obter informações do país com base no 'cca3'.
      .then(response => setCountry(response.data[0])) // Se a requisição for bem-sucedida, armazena os dados do país no estado.
      .catch(error => console.error('Error loading country details', error)); // Caso haja um erro, exibe uma mensagem no console.
  }, [cca3]); // O efeito roda sempre que 'cca3' mudar.

  if (!country) return <div>Loading...</div>; // Se os dados ainda não foram carregados, exibe uma mensagem de "Carregando...".

  return ( // Retorna a interface de detalhes do país.
    <div className="country-details"> {} 
      <Link to="/" className="back-link">← Voltar</Link> {}
      <div className="details-container"> {/* Contêiner que agrupa a bandeira e as informações do país. */}
        <CountryFlag flagUrl={country.flags.svg} countryName={country.name.common} /> {/* Renderiza o componente 'CountryFlag', passando a URL da bandeira e o nome do país. */}
        <CountryInfo country={country} /> {/* Renderiza o componente 'CountryInfo', passando os dados do país como propriedade. */}
      </div>
    </div>
  );
};

export default CountryDetails; 
