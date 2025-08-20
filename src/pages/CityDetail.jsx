import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaCloudRain, FaSnowflake, FaWind, FaSun, FaTemperatureHigh, FaTemperatureLow, FaTint, FaCompressArrowsAlt } from "react-icons/fa";

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

      <h2>{weather.name}</h2>
      <div className="mb-3">{indicators}</div>

      <div className="mb-4">
        <p><FaTemperatureHigh className="me-2 text-danger" />Temperatura: {weather.main.temp}°C</p>
        <p><FaTemperatureLow className="me-2 text-primary" />Min: {weather.main.temp_min}°C, Max: {weather.main.temp_max}°C</p>
        <p><FaTint className="me-2 text-info" />Umidità: {weather.main.humidity}%</p>
        <p><FaCompressArrowsAlt className="me-2 text-secondary" />Pressione: {weather.main.pressure} hPa</p>
        <p><FaWind className="me-2 text-warning" />Vento: {weather.wind.speed} m/s</p>
        <p>Condizioni: {weather.weather[0].description}</p>
        <p>Visibilità: {weather.visibility} m</p>
      </div>

      <h4>Temperatura oraria</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={hourly}>
          <XAxis dataKey="hour" label={{ value: "Ora", position: "insideBottomRight", offset: -5 }} />
          <YAxis unit="°C" />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h4 className="mt-4">Previsioni prossimi 5 giorni</h4>
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
  );
}
