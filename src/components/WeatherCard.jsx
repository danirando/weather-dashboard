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
          <span {...dragHandleProps} style={{ cursor: "grab", fontSize: "1.2rem" }}>☰</span>
        </div>

        <p className="card-text">
          Temperatura: {weather.main.temp}°C <br />
          Umidità: {weather.main.humidity}% <br />
          Condizioni: {weather.weather[0].description}
        </p>

  <h6>Previsioni prossimi 5 giorni</h6>
<div className="d-flex flex-wrap justify-content-between">
  {forecast.map((item, index) => (
    <div
      key={index}
      className="text-center p-2"
      style={{
        flex: "1 1 100px", // larghezza minima 100px, cresce se c'è spazio
        maxWidth: "120px",
        marginBottom: "10px",
      }}
    >
      <div>{new Date(item.dt_txt).toLocaleDateString("it-IT")}</div>
      <img
        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
        alt={item.weather[0].description}
        style={{ width: "50px", height: "50px" }}
      />
      <div>{Math.round(item.main.temp)}°C</div>
    </div>
  ))}
</div>


        <button
          type="button"
          className="btn btn-danger mt-2"
          onClick={(e) => { e.stopPropagation(); onRemove(city.id); }}
        >
          Rimuovi
        </button>
      </div>
    </div>
  );
}
