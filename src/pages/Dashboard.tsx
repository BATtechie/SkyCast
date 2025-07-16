import "./Dashboard.css";
import { useState, useEffect } from "react";
import {
  fetchWeatherByCity,
  fetchAQIByCoords,
  fetchUVIndexByCoords,
  fetchHourlyForecast,
  fetchFiveDayForecast,
} from "../services/weatherService";
import {
  Wind,
  Droplet,
  Eye,
  Thermometer,
  WindArrowDown,
  MapPin,
  CalendarDaysIcon,
} from "lucide-react";

const Dashboard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("");
  const [aqi, setAqi] = useState<number | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [fiveDayForecast, setFiveDayForecast] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDefaultCity = async () => {
    try {
      const data = await fetchWeatherByCity("New Delhi");
      setWeather(data);
      setError(null);

      const { lat, lon } = data.coord;

      const [aqiData, uvData, hourlyData, fiveDayData] = await Promise.all([
        fetchAQIByCoords(lat, lon),
        fetchUVIndexByCoords(lat, lon),
        fetchHourlyForecast(lat, lon),
        fetchFiveDayForecast(lat, lon),
      ]);

      setAqi(aqiData);
      setUvIndex(uvData);
      setHourlyForecast(hourlyData);
      setFiveDayForecast(fiveDayData);
    } catch (err) {
      console.error("Failed to fetch default city weather:", err);
      setError("City not found. Please enter a valid city name.");
    }
  };

  const handleSearch = async () => {
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);

      const { lat, lon } = data.coord;

      const [aqiData, uvData, hourlyData, fiveDayData] = await Promise.all([
        fetchAQIByCoords(lat, lon),
        fetchUVIndexByCoords(lat, lon),
        fetchHourlyForecast(lat, lon),
        fetchFiveDayForecast(lat, lon),
      ]);

      setAqi(aqiData);
      setUvIndex(uvData);
      setHourlyForecast(hourlyData);
      setFiveDayForecast(fiveDayData);
    } catch (err) {
      console.error(err);
    }
  };

  // Inside Dashboard component
  useEffect(() => {
    fetchDefaultCity();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search city..."
            className="search-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#ffe5e5",
              color: "#d32f2f",
              border: "1px solid #f5c6cb",
              padding: "12px",
              borderRadius: "6px",
              marginTop: "12px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {!weather && !error && (
          <div
            style={{
              color: "#999",
              padding: "20px",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            🌤️ Weather data not available. Please search for a city to begin.
          </div>
        )}

        {/* Current Weather Card */}
        {weather && (
          <div className="weather-card">
            <div className="weather-card-header">
              <span
                className="location"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <MapPin style={{ color: "#de3e3eff", marginRight: "8px" }} />
                {weather.name}, {weather.sys.country}
              </span>

              <span style={{ display: "flex", alignItems: "center" }}>
                <CalendarDaysIcon
                  style={{ color: "#d6a74aff", marginRight: "8px" }}
                />
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="weather-main">
              <div className="weather-icon">⛅</div>
              <div className="temperature">
                {Math.round(weather.main.temp)}°
              </div>
              <div className="description">
                {weather.weather?.[0]?.description || "N/A"}
              </div>
            </div>

            <div className="weather-stats">
              <div className="weather-info">
                <span>
                  <Thermometer style={{ color: "#b36253ff" }} />
                </span>
                <p>Feels Like</p>
                <span>{Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="weather-info">
                <span>
                  <Droplet style={{ color: "#00BFFF" }} />
                </span>
                <p>Humidity</p>
                <span>{weather.main.humidity}%</span>
              </div>
              <div className="weather-info">
                <span>
                  <Wind style={{ color: "#32CD32" }} />
                </span>
                <p>Wind Speed</p>
                <span>{weather.wind.speed} km/h</span>
              </div>
              <div className="weather-info">
                <span>
                  <Eye style={{ color: "#FFD700" }} />
                </span>
                <p>Visibility</p>
                <span>{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
              <div className="weather-info">
                <span>
                  <WindArrowDown style={{ color: "#5ed0d2ff" }} />
                </span>
                <p>Pressure</p>
                <span>{weather.main.pressure} hPa</span>
              </div>
            </div>

            <div className="weather-bottom">
              <span className="aqi-tag">AQI: {aqi !== null ? aqi : "--"}</span>
              <span className="uv-index">
                UV Index: {uvIndex !== null ? uvIndex : "-"}
              </span>
            </div>
          </div>
        )}

        {/* Hourly Forecast Card */}
        <div className="weather-bottom-section">
          <div className="hourly-forecast-card">
            <div className="section-title">🔴 Hourly Forecast</div>

            {hourlyForecast.length > 0 ? (
              <div className="hourly-scroll">
                {hourlyForecast.map((hour, index) => {
                  const date = new Date(hour.dt * 1000);
                  const time = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div className="hourly-card" key={index}>
                      <div className="hour">{time}</div>
                      <div className="hour-icon">
                        <img
                          className="hour-icon"
                          src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                          alt={hour.weather[0].description}
                        />
                      </div>
                      <div className="hour-temp">
                        {Math.round(hour.main.temp)}°
                      </div>
                      <div className="hour-desc">
                        {hour.weather?.[0]?.description || "N/A"}
                      </div>
                      <div className="hour-details">
                        <div>Feels: {hour.main.feels_like}°</div>
                        <div>Wind: {hour.wind.speed} km/h</div>
                        <div>Humidity: {hour.main.humidity}%</div>
                        <div>Pressure: {hour.main.pressure} hPa</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{ color: "#888", padding: "20px", textAlign: "center" }}
              >
                No hourly forecast data available for this location.
              </div>
            )}
          </div>

          {/* UV Index Card */}
          {/* UV Index Card */}
          <div className="uv-index-card">
            <div className="uv-header">
              <span>⚠️ UV Index</span>
              <span
                className="uv-badge"
                style={{
                  backgroundColor:
                    uvIndex === null
                      ? "#ccc"
                      : uvIndex >= 8
                      ? "#d32f2f"
                      : uvIndex >= 6
                      ? "#f57c00"
                      : uvIndex >= 3
                      ? "#fbc02d"
                      : "#388e3c",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  marginLeft: "8px",
                }}
              >
                {uvIndex === null
                  ? "Unknown"
                  : uvIndex >= 8
                  ? "Very High"
                  : uvIndex >= 6
                  ? "High"
                  : uvIndex >= 3
                  ? "Moderate"
                  : "Low"}
              </span>
            </div>

            <div className="uv-value">{uvIndex !== null ? uvIndex : "--"}</div>

            <div className="uv-label">Current UV Index</div>

            <div className="uv-scale">
              <div className="uv-gradient">
                <div
                  className="uv-dot"
                  style={{
                    left:
                      uvIndex !== null
                        ? `${Math.min((uvIndex / 11) * 100, 100)}%`
                        : "0%",
                  }}
                ></div>
              </div>
              <div className="uv-scale-labels">
                <span>0</span>
                <span>11+</span>
              </div>
            </div>

            <div className="uv-advice">
              <strong>🛡️ Protection Advice</strong>
              <p>
                {uvIndex === null
                  ? "UV Index not available."
                  : uvIndex >= 8
                  ? "Avoid being outside during midday hours. Use SPF 30+ sunscreen, wear protective clothing, and sunglasses."
                  : uvIndex >= 6
                  ? "Reduce time in the sun between 10 a.m. and 4 p.m. Use SPF 30+ and wear a hat and sunglasses."
                  : uvIndex >= 3
                  ? "Wear sunglasses and SPF if outside for extended time."
                  : "Low risk from UV rays for the average person."}
              </p>
            </div>

            <div className="uv-levels">
              <span className="uv-level low">
                0–2
                <br />
                Low
              </span>
              <span className="uv-level moderate">
                3–5
                <br />
                Moderate
              </span>
              <span className="uv-level high">
                6–7
                <br />
                High
              </span>
              <span className="uv-level very-high">
                8–10
                <br />
                Very High
              </span>
              <span className="uv-level extreme">
                11+
                <br />
                Extreme
              </span>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast Card */}
        <div className="seven-day-forecast-card">
          <div style={{ padding: "10px", margin: "10px" }}>
            <h3>5-Day Forecast</h3>
          </div>

          {fiveDayForecast.length > 0 ? (
            fiveDayForecast.map((day, index) => {
              const label =
                index === 0
                  ? "Today"
                  : new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "long",
                    });

              return (
                <div className="forecast-day" key={index}>
                  <div className="forecast-info-left">
                    <div className="day-label">{label}</div>
                    <img
                      className="forecast-icon"
                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      alt={day.description}
                    />
                    <div className="forecast-description">
                      {day.description}
                    </div>
                  </div>

                  <div className="forecast-stats">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <span>
                        <Droplet style={{ color: "#00BFFF" }} />
                      </span>{" "}
                      {day.humidity}%
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <span>
                        <Wind style={{ color: "#32CD32" }} />
                      </span>{" "}
                      {day.wind} km/h
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <span>
                        <Thermometer style={{ color: "#b36253ff" }} />
                      </span>{" "}
                      {day.feels_like} °C
                    </div>
                    {/* <span>{Math.round(weather.main.feels_like)}°C</span> */}
                  </div>

                  <div className="forecast-info-right">
                    <div className="max-temp">Max: {day.temp_max}°</div>
                    <div className="min-temp">Min: {day.temp_min}°</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{ color: "#888", padding: "20px", textAlign: "center" }}
            >
              No 5-day forecast data available for this location.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
