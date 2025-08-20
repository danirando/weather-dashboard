import React, { createContext, useState, useEffect } from "react";

export const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <WeatherContext.Provider value={{ watchlist, setWatchlist }}>
      {children}
    </WeatherContext.Provider>
  );
}
