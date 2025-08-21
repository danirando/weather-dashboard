import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../assets/css/Card.css";

export default function WeatherCard({ city, onRemove, dragHandleProps }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleRemove = () => {
    onRemove(city.id);
    setShowModal(false);
  };

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
    <div className="card main" onClick={() => navigate(`/city/${city.id}`)}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title">{city.name}</h5>
          <span className="mb-3"
            {...dragHandleProps}
            style={{ cursor: "grab", fontSize: "1.2rem" }}
          >
            ☰
          </span>
        </div>

        {/* Dettagli meteo */}
        <div className="row row-cols-3 g-2 text-center">
          {/* Temperatura */}
          <div className="col">
            <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center p-2">
              <p className="card-text fs-6 mb-0">🌡️ Temperatura</p>
              <small className="fw-bold">{weather.main.temp}°C</small>
            </div>
          </div>

          {/* Umidità */}
          <div className="col">
            <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center p-2">
              <p className="card-text fs-6 mb-0">💧 Umidità</p>
              <small className="fw-bold">{weather.main.humidity}%</small>
            </div>
          </div>

          {/* Meteo */}
          <div className="col">
            <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center p-2">
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt={weather.weather[0].description}
                style={{ width: "30px", height: "30px" }}
              />
              <small className="fw-bold text-capitalize">{weather.weather[0].description}</small>
            </div>
          </div>
        </div>

        {/* Previsioni */}
        <h6 className="mt-3">Previsioni prossimi 5 giorni</h6>
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

        {/* Pulsante Rimuovi */}
        <button
          type="button"
          className="btn btn-danger mt-2"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
        >
          Rimuovi
        </button>

        {/* Modal tramite Portal */}
        {showModal &&
          ReactDOM.createPortal(
            <>
              {/* Backdrop */}
              <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1040 }}
                onClick={() => setShowModal(false)}
              ></div>

              {/* Modal */}
              <div
                className="modal fade show"
                style={{ display: "block", zIndex: 1050 }}
                tabIndex="-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Conferma eliminazione</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      Sei sicuro di voler rimuovere <b>{city.name}</b>?
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Annulla
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove();
                        }}
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>,
            document.body
          )}
      </div>
    </div>
  );
}
