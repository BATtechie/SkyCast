// import  { useState } from "react";
// import { MapContainer, TileLayer, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "./Maps.css";
// type WeatherLayersProps = {
//   layer: string;
//   setLayer: (value: string) => void;
// };

// const WeatherLayers = ({ layer, setLayer }: WeatherLayersProps) => (
//   <div className="panel weather-layers">
//     <p>🌦️ Weather Layers</p>
//     {[
//       { label: "Temperature", key: "temp_new" },
//       { label: "Precipitation", key: "precipitation_new" },
//       { label: "Clouds", key: "clouds_new" },
//       { label: "Wind", key: "wind_new" },
//       { label: "Pressure", key: "pressure_new" },
//     ].map(({ label, key }) => (
//       <button
//         key={key}
//         className={layer === key ? "active" : ""}
//         onClick={() => setLayer(key)}
//       >
//         {label}
//       </button>
//     ))}
//   </div>
// );

// const MapControls = () => {
//   const map = useMap();

//   return (
//     <div className="panel map-controls">
//       <p>🗺️ Map Controls</p>
//       <button onClick={() => map.setZoom(Math.min(map.getZoom() + 1, 18))}>
//         Zoom In
//       </button>
//       <button onClick={() => map.setZoom(Math.max(map.getZoom() - 1, 1))}>
//         Zoom Out
//       </button>
//       <button onClick={() => map.setView([40.7128, -74.0060], 6)}>
//         Reset View
//       </button>
//     </div>
//   );
// };

// const Maps = () => {
//   const [layer, setLayer] = useState("temp_new");
//   const weatherLayerUrl = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=18ccf23463d3797b6f4a3fc48058c96e`;

//   return (
//     <div className="maps-wrapper">
//       <div className="maps-container">
//         <div className="maps-header">
//           <span className="dot" />
//           <h2>Live Weather Map</h2>
//         </div>

//         <div className="map-area">
//           <MapContainer
//             center={[40.7128, -74.006]}
//             zoom={6}
//             scrollWheelZoom={true}
//             className="leaflet-map"
//           >
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution="&copy; OpenStreetMap contributors"
//             />
//             <TileLayer url={weatherLayerUrl} opacity={0.6} />
//             <MapControls />
//           </MapContainer>

//           <WeatherLayers layer={layer} setLayer={setLayer} />

//           <div className="panel location-info">
//             <p>📍 New York</p>
//             <p>🌡️ 27°C</p>
//             <p>💨 20 km/h</p>
//             <p>💧 41%</p>
//             <p>👁️ 14 km</p>
//           </div>

//           <div className="panel coords-info">
//             <p>Lat: 40.7128</p>
//             <p>Lng: -74.0060</p>
//             {/* You can add dynamic zoom display here later */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Maps;
import InteractiveWeatherMap from "./InteractiveWeatherMap";
import { Earth } from "lucide-react";

const Maps = () => {
  return (
    <div className="maps-wrapper">
      <div className="maps-container">
        <div className="maps-header">
          <span className="dot" />
          <h2 className="map-heading">
            <Earth style={{ color: "#0b4cf2ff", width: "24px", height: "24px" }} />
            Interactive Weather Map
          </h2>
        </div>

        <InteractiveWeatherMap />
      </div>
    </div>
  );
};

export default Maps;

