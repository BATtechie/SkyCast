// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useEffect, useState } from "react";

// // Fix marker icon issue in React-Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// const WeatherMap = () => {
//   const [weatherMarkers, setWeatherMarkers] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchWeatherCities = async () => {
//       const cities = [
//         { name: "Delhi", lat: 28.61, lon: 77.21 },
//         { name: "Mumbai", lat: 19.07, lon: 72.87 },
//         { name: "Bangalore", lat: 12.97, lon: 77.59 },
//         { name: "Chennai", lat: 13.08, lon: 80.27 },
//       ];

//       const API_KEY = "YOUR_OPENWEATHER_API_KEY";
//       const data = await Promise.all(
//         cities.map(async (city) => {
//           const res = await fetch(
//             `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
//           );
//           const json = await res.json();
//           return {
//             ...city,
//             temp: json.main.temp,
//             desc: json.weather[0].description,
//             aqi: await fetchAQI(city.lat, city.lon, API_KEY),
//           };
//         })
//       );

//       setWeatherMarkers(data);
//     };

//     fetchWeatherCities();
//   }, []);

//   const fetchAQI = async (lat: number, lon: number, apiKey: string) => {
//     const res = await fetch(
//       `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
//     );
//     const json = await res.json();
//     return json.list[0]?.main.aqi || "-";
//   };

//   return (
//     <div style={{ height: "600px", borderRadius: "20px", overflow: "hidden" }}>
//       <MapContainer
//         center={[20.59, 78.96]} // India center
//         zoom={5}
//         scrollWheelZoom={true}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="http://osm.org">OpenStreetMap</a> contributors'
//         />

//         {weatherMarkers.map((marker, index) => (
//           <Marker key={index} position={[marker.lat, marker.lon]}>
//             <Popup>
//               <strong>{marker.name}</strong>
//               <br />
//               🌡 Temp: {marker.temp}°C
//               <br />
//               ☁ {marker.desc}
//               <br />
//               AQI: {marker.aqi}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// export default WeatherMap;
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
