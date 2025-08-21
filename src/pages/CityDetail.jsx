import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaCloudRain, FaSnowflake, FaWind, FaSun, FaTemperatureHigh, FaTemperatureLow, FaTint, FaCompressArrowsAlt } from "react-icons/fa";
import "../assets/css/Detail.css"

export default function CityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const resWeather = await api.get(`/weather/${id}`);
        setWeather(resWeather.data);

        const resForecast = await api.get(`/forecast/${id}`);
        setHourly(
          resForecast.data.list.map(item => ({
            hour: new Date(item.dt * 1000).getHours(),
            temp: item.main.temp
          }))
        );

        // Previsioni 5 giorni raggruppate per giorno
        const dailyMap = {};
        resForecast.data.list.forEach(item => {
          const date = new Date(item.dt * 1000);
          const day = date.toLocaleDateString("it-IT");
          if (!dailyMap[day]) dailyMap[day] = [];
          dailyMap[day].push(item);
        });

        const dailyArray = Object.keys(dailyMap).map(day => {
          const items = dailyMap[day];
          const temps = items.map(i => i.main.temp);
          const icons = items.map(i => i.weather[0].icon);
          const descriptions = items.map(i => i.weather[0].description);
          return {
            day,
            min: Math.min(...temps),
            max: Math.max(...temps),
            icon: icons[0],
            description: descriptions[0],
          };
        });
        setForecast(dailyArray);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [id]);

  if (loading) return <div>Caricamento dettagli...</div>;
  if (!weather) return <div>Meteo non disponibile</div>;

  // Indicatori meteo principali
  const weatherMain = weather.weather[0].main.toLowerCase();
  const indicators = [];
  if (weatherMain.includes("rain")) indicators.push(<FaCloudRain key="rain" title="Pioggia" className="text-primary me-2" />);
  if (weatherMain.includes("snow")) indicators.push(<FaSnowflake key="snow" title="Neve" className="text-info me-2" />);
  if (weather.wind.speed > 10) indicators.push(<FaWind key="wind" title="Vento forte" className="text-warning me-2" />);
  if (!indicators.length) indicators.push(<FaSun key="sun" title="Sole" className="text-warning me-2" />);

  return (
    <div className="container my-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Torna indietro</button>
     <div className="custom-container">
       
        <h2>{weather.name}</h2>
      <div className="mb-3"></div>

 <div className="weather-info">
  {/* Condizione principale */}
  <div className="text-center mb-3">
    <h3 className="fw-bold text-capitalize">
      {weather.weather[0].description} {indicators && <span>{indicators}</span>}
    </h3>
  </div>

  {/* Info in cards */}
  <div className="row g-2 text-center">
    {/* Temperatura attuale */}
    <div className="col-4">
      <div className="card shadow-sm p-3 h-100 d-flex flex-column justify-content-center">
        <FaTemperatureHigh className="mb-1 text-danger mx-auto" size={24} />
        <small className="text-muted">Temperatura</small>
        <strong>{weather.main.temp}°C</strong>
      </div>
    </div>

    {/* Min / Max */}
    <div className="col-4">
      <div className="card shadow-sm p-3 h-100 d-flex flex-column justify-content-center">
        <FaTemperatureLow className="mb-1 text-primary mx-auto" size={24} />
        <small className="text-muted">Min / Max</small>
        <strong>{weather.main.temp_min}°C / {weather.main.temp_max}°C</strong>
      </div>
    </div>

    {/* Umidità */}
    <div className="col-4">
      <div className="card shadow-sm p-3 h-100 d-flex flex-column justify-content-center">
        <FaTint className="mb-1 text-info mx-auto" size={24} />
        <small className="text-muted">Umidità</small>
        <strong>{weather.main.humidity}%</strong>
      </div>
    </div>

    {/* Pressione */}
    <div className="col-4">
      <div className="card shadow-sm p-3 h-100 d-flex flex-column justify-content-center">
        <FaCompressArrowsAlt className="mb-1 text-secondary mx-auto" size={24} />
        <small className="text-muted">Pressione</small>
        <strong>{weather.main.pressure} hPa</strong>
      </div>
    </div>

    {/* Vento */}
    <div className="col-4">
      <div className="card shadow-sm p-3 h-100 d-flex flex-column justify-content-center">
        <FaWind className="mb-1 text-warning mx-auto" size={24} />
        <small className="text-muted">Vento</small>
        <strong>{weather.wind.speed} m/s</strong>
      </div>
    </div>

    {/* Visibilità */}
    <div className="col-4">
      <div className="card shadow-sm p-3 h-100 d-flex flex-column justify-content-center">
        <small className="text-muted">Visibilità</small>
        <strong>{weather.visibility} m</strong>
      </div>
    </div>
  </div>
</div>


     </div>
     
<div className="custom-container white">

<h4>Temperatura oraria</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={hourly}>
          <XAxis dataKey="hour" label={{ value: "Ora", position: "insideBottomRight", offset: -5 }} />
          <YAxis unit="°C" />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

</div>
      
<div className="custom-container">

         <h4>Previsioni prossimi 6 giorni</h4>
      <div className="d-flex flex-wrap justify-content-center gap-3">
  {forecast.map((item, idx) => (
    <div
      key={idx}
      className="card text-center flex-grow-1 flex-shrink-1"
      style={{ minWidth: "120px", maxWidth: "150px" }}
    >
      <div className="card-body p-2">
        <h6 className="card-title mb-1">{item.day}</h6>
        <img
          src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
          alt={item.description}
          className="mb-1"
          style={{ width: "50px", height: "50px" }}
        />
        <p className="mb-1">{Math.round(item.min)}° / {Math.round(item.max)}°C</p>
        <small className="text-muted">{item.description}</small>
      </div>
    </div>
  ))}
</div>

</div>
 
<div className="custom-container">

{/* RADAR METEO */}
<h4>Radar meteo</h4>
<div  style={{ width: "100%", height: "500px" }}>
  <iframe
    title="Radar Meteo"
    width="100%"
    height="100%"
    src={`https://embed.windy.com/embed2.html?lat=${weather.coord.lat}&lon=${weather.coord.lon}&zoom=7&overlay=radar`}
    frameBorder="0"
  />
</div>


</div>


    </div>
  );
}
