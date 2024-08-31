import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchPokemonData = async () => {
      setIsLoading(true);
      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${ITEMS_PER_PAGE}`);
        const data = await response.json();
        setPokemonData(data.results);
        setFilteredData(data.results);
        setTotalPages(Math.ceil(1302 / ITEMS_PER_PAGE)); // Total Pokémon / ITEMS_PER_PAGE
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, [page]);

  useEffect(() => {
    setFilteredData(
      pokemonData.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, pokemonData]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="app">
      <h1>Pokémon React App</h1>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="pokemon-list">
            {filteredData.map(pokemon => (
              <div key={pokemon.name} className="pokemon-card">
                <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split('/')[6]}.png`}
                  alt={pokemon.name}
                />
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
