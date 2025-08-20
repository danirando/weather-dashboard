import React, { useState, useContext } from "react";
import api from "../api";
import { WeatherContext } from "../context/WeatherContext";
import "../assets/css/SearchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { watchlist, setWatchlist } = useContext(WeatherContext);

  const handleSearch = async () => {
    // ✅ Validazione input
    if (!query.trim()) {
      setErrorMsg("Inserisci il nome di una città");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.get(`/search/${query.trim()}`);

      if (!res.data || res.data.length === 0) {
        setErrorMsg("Nessuna città trovata");
        setResults([]);
      } else {
        setResults(res.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Errore durante la ricerca. Riprova.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addCity = (city) => {
    if (watchlist.length >= 4) {
      setErrorMsg("Puoi aggiungere massimo 4 città");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    const cityId = `${city.lat},${city.lon}`;
    if (watchlist.some((c) => c.id === cityId)) {
      setErrorMsg("Città già presente nella watchlist");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ricerca anche con Invio
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading} // disabilita il pulsante durante il caricamento
        >
          {loading ? "Caricamento..." : "Cerca"}
        </button>
      </div>

      {results.length > 0 && (
        <ul className="search-results list-group mt-2">
          {results.map((city, idx) => (
            <li
              key={idx}
              className="list-group-item list-group-item-action"
              onClick={() => addCity(city)}
              style={{ cursor: "pointer" }}
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
