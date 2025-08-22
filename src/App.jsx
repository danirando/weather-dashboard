import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext";
import Dashboard from "./pages/Dashboard";
import CityDetail from "./pages/CityDetail";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  return (
    <WeatherProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/city/:id" element={<CityDetail />} />
          <Route path="/error" element={<ErrorPage />} />
          {/* catch-all per 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </WeatherProvider>
  );
}
