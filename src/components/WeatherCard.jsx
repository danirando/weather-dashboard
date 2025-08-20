import React, { useEffect, useState } from "react";
import api from "../api";

export default function WeatherCard({ city, onRemove }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await api.get(`/weather/${city.id}`);
        setWeather(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeather();
  }, [city.id]);

  if (!weather) return <div>Caricamento...</div>;

  return (
    <div className="card my-3">
      <div className="card-body">
        <h5 className="card-title">{city.name}</h5>
        <p className="card-text">
          Temperatura: {weather.main.temp}°C <br />
          Umidità: {weather.main.humidity}% <br />
          Condizioni: {weather.weather[0].description}
        </p>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onRemove(city.id)} // usa removeCity dal parent
        >
          Rimuovi
        </button>
      </div>
    </div>
  );
}
