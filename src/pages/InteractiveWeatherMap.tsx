
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./Maps.css" 

const layerOptions = [
  { label: "Temperature", key: "temp_new" },
  { label: "Precipitation", key: "precipitation_new" },
  { label: "Wind", key: "wind_new" },
  { label: "Air Pollution", key: "air_pollution" },
];

const InteractiveWeatherMap = () => {
  const [layer, setLayer] = useState("temp_new");
  const API_KEY = "0ff9914403129255dcec384cb93fe671";

  return (
    <div>
      <div className="panel weather-layers">
        {layerOptions.map(({ label, key }) => (
          <button key={key} onClick={() => setLayer(key)} className={layer === key ? "active" : ""}>
            {label}
          </button>
        ))}
      </div>

      <MapContainer center={[20.59, 78.96]} zoom={4} style={{ height: "600px", marginTop: "10px" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <TileLayer
          url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={0.6}
        />
      </MapContainer>
    </div>
  );
};

export default InteractiveWeatherMap;
