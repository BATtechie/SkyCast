// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Maps from "./pages/Maps";
import "leaflet/dist/leaflet.css";
import WeatherMap from "./pages/InteractiveWeatherMap";
const App = () => {
  return (
    <BrowserRouter>
    <main>
      <Navbar/>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/weather" element={<WeatherMap/>} />
      </Routes>
    </main>
    </BrowserRouter>
  );
};

export default App;
