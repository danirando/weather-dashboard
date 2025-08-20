import React, { useState, useContext } from "react";
import api from "../api";
import { WeatherContext } from "../context/WeatherContext";
import "../assets/css/SearchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const { watchlist, setWatchlist } = useContext(WeatherContext);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await api.get(`/search/${query}`);
      setResults(res.data);
    } catch (err) {
      alert("Errore ricerca città");
    }
  };

  const addCity = (city) => {
    if (watchlist.length >= 4) {
      setErrorMsg("Puoi aggiungere massimo 4 città");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    const cityId = `${city.lat},${city.lon}`;
    if (watchlist.some((c) => c.id === cityId)) return;

    setWatchlist([...watchlist, { id: cityId, name: city.name, country: city.country }]);
    setResults([]);
    setQuery("");
  };

  return (
    <div className="search-bar-container my-3">
      {errorMsg && <div className="alert alert-warning">{errorMsg}</div>}
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Cerca città..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" onClick={handleSearch}>
          Cerca
        </button>
      </div>
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((city, idx) => (
            <li key={idx} onClick={() => addCity(city)}>
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
