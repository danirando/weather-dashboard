import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function WeatherCard({ city, onRemove, dragHandleProps }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await api.get(`/weather/${city.id}`);
        setWeather(res.data);

        const forecastRes = await api.get(`/forecast/${city.id}`);

        // filtriamo 1 previsione al giorno (12:00)
        const dailyForecast = forecastRes.data.list.filter(item =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(dailyForecast);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeather();
  }, [city.id]);

  if (!weather) return <div>Caricamento...</div>;

  return (
    <div className="card" onClick={() => navigate(`/city/${city.id}`)}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title">{city.name}</h5>
          <span
            {...dragHandleProps}
            style={{ cursor: "grab", fontSize: "1.2rem" }}
          >
            ☰
          </span>
        </div>

        {/* Dettagli meteo con icone/emoji */}
        <p className="card-text">🌡️ Temperatura: {weather.main.temp}°C</p>
        <p className="card-text">💧 Umidità: {weather.main.humidity}%</p>
        <p className="card-text d-flex align-items-center gap-2">
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            style={{ width: "30px", height: "30px" }}
          />
          {weather.weather[0].description}
        </p>

        {/* Previsioni */}
     <h6>Previsioni prossimi 5 giorni</h6>
<div className="d-flex justify-content-between text-center">
  {forecast.map((item, index) => (
    <div
      key={index}
      className="p-1 flex-fill"
      style={{
        minWidth: "0",   // per permettere la compressione
        fontSize: "0.8rem",
      }}
    >
      <div>
        {new Date(item.dt_txt).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" })}
      </div>
      <img
        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
        alt={item.weather[0].description}
        style={{ width: "35px", height: "35px" }}
      />
      <div>{Math.round(item.main.temp)}°C</div>
    </div>
  ))}
</div>


        <button
          type="button"
          className="btn btn-danger mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(city.id);
          }}
        >
          Rimuovi
        </button>
      </div>
    </div>
  );
}
