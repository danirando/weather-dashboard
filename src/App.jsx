import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext";
import Dashboard from "./pages/Dashboard";
import CityDetail from "./pages/CityDetail"; // pagina che svilupperai

function App() {
  return (
    <WeatherProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/city/:id" element={<CityDetail />} />
        </Routes>
      </Router>
    </WeatherProvider>
  );
}

export default App;
