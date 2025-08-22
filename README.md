Weather App
1. Panoramica del progetto

Weather App è un’applicazione web per consultare il meteo attuale e le previsioni fino a 6 giorni per qualsiasi città.

Backend: Laravel + SQLite (cache persistente)

Frontend: React + Vite + Tailwind CSS

Caratteristiche principali:

Ricerca città tramite OpenWeatherMap Geocoding API

Meteo attuale e previsioni 6 giorni

Cache in-memory + persistente con TTL differenziati

Headers HTTP ottimizzati per cache lato browser

2. Installazione
Backend (Laravel)

Clona la repository:

git clone https://github.com/danirando/weather-backend.git
cd weather-backend


Assicurati che il terminale abbia accesso completo alle cartelle protette su macOS (Preferenze → Sicurezza e Privacy → Privacy → Accesso completo al disco).

Installa le dipendenze:

composer install


Nel file .env inserisci i seguenti campi:

DB_CONNECTION=sqlite
DB_DATABASE=./database/database.sqlite
CACHE_DRIVER=database
OPENWEATHER_KEY=tuo_api_key_openweathermap


Crea il file SQLite (se non esiste):

touch database/database.sqlite


Crea la tabella della cache e applica le migrazioni:

php artisan cache:table
php artisan migrate


Avvia il server:

php artisan serve

Frontend (React + Vite)

Clona la repository:

git clone https://github.com/danirando/weather-frontend.git
cd weather-frontend


Installa le dipendenze:

npm install


Avvia il server di sviluppo:

npm run dev


3. Tecnologie utilizzate

Backend: Laravel, PHP, SQLite

Frontend: React, Vite, Tailwind CSS

API esterne: OpenWeatherMap (Geocoding + Weather + Forecast)

Caching: in-memory + persistente

Gestione stato: React hooks + context

4. Note di sviluppo

Cache differenziata per tipo di dato:

Città → 24h

Meteo attuale → 5 min

Forecast 5 giorni → 1h

Log per cache miss per debug

Headers HTTP configurati per ottimizzare cache browser

Limitazioni:

Limiti di chiamate API con chiave gratuita OpenWeatherMap
Non c'è la possibilità di inserire la percentuale di probabilità di piggia con chiave gratuita.

5. Documentazione API
Endpoint	Metodo	Parametri	Descrizione
/weather/search/{city}	GET	city (stringa)	Ricerca città tramite geocoding
/weather/current/{lat},{lon}	GET	lat, lon	Meteo attuale della città
/weather/forecast/{lat},{lon}	GET	lat, lon	Previsioni meteo 6 giorni

Esempio risposta (getCurrentWeather):

{
  "coord": { "lon": 9.19, "lat": 45.4642 },
  "weather": [
    { "id": 800, "main": "Clear", "description": "sereno", "icon": "01d" }
  ],
  "main": {
    "temp": 22.5,
    "feels_like": 22.0,
    "humidity": 56
  }
}
