import React, { useState } from 'react';
import './App.css';

function RecipeFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setError('Please enter a recipe or ingredient');
      return;
    }
    setError('');

    try {
      const results = await fetchRecipesFromAPI(searchQuery);
      if (results && results.meals && results.meals.length > 0) {
        setSearchResults(results.meals);
      } else {
        setError('Please enter a valid recipe or ingredient');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error occurred during search:', error);
      setError('An error occurred during the search. Please try again later.');
    }
  };

  const fetchRecipesFromAPI = async (query) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch recipes from API');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <h1 className="heading">Recipe Finder</h1>
      <button className="dark-mode-button" onClick={toggleDarkMode}>
        {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter a recipe or ingredient"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results:</h2>
          <ul className="recipes-list">
            {searchResults.map((recipe) => (
              <li key={recipe.idMeal} className="recipe-item">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-image" />
                <h3 className="recipe-name">{recipe.strMeal}</h3>
                <p className="recipe-category">{recipe.strCategory}</p>
                <p className="recipe-area">{recipe.strArea}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RecipeFinder;
