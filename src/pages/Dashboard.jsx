import React, { useContext } from "react";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";
import { WeatherContext } from "../context/WeatherContext";

export default function Dashboard() {
  const { watchlist, setWatchlist } = useContext(WeatherContext);

  const removeCity = (cityId) => {
    setWatchlist(watchlist.filter((c) => c.id !== cityId));
  };

  return (
    <div className="container my-3">
      <h1>Dashboard Meteo</h1>
      <SearchBar />

      <div className="mt-3">
        {watchlist.map((city) => (
          <WeatherCard key={city.id} city={city} onRemove={removeCity} />
        ))}
      </div>
    </div>
  );
}
