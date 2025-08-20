import React, { createContext, useState, useEffect } from "react";

export const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // funzione per rimuovere una città
  const removeCity = (id) => {
    setWatchlist((prev) => prev.filter((city) => city.id !== id));
  };

  return (
    <WeatherContext.Provider value={{ watchlist, setWatchlist, removeCity }}>
      {children}
    </WeatherContext.Provider>
  );
}
