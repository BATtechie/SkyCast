import "./Dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search city..."
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>

        {/* Current Weather Card */}
        <div className="weather-card">
          <div className="weather-card-header">
            <span className="location">📍 New York, US</span>
            <span className="date">📅 Sunday, June 22, 2025</span>
          </div>

          <div className="weather-main">
            <div className="weather-icon">⛅</div>
            <div className="temperature">27°</div>
            <div className="description">Few Clouds</div>
          </div>

          <div className="weather-stats">
            <div className="weather-info">
              <span>🌡️</span>
              <p>Feels Like</p>
              <span>26°C</span>
            </div>
            <div className="weather-info">
              <span>💧</span>
              <p>Humidity</p>
              <span>69%</span>
            </div>
            <div className="weather-info">
              <span>💨</span>
              <p>Wind Speed</p>
              <span>5 km/h</span>
            </div>
            <div className="weather-info">
              <span>👁️</span>
              <p>Visibility</p>
              <span>8 km</span>
            </div>
            <div className="weather-info">
              <span>⚡</span>
              <p>Pressure</p>
              <span>1041 hPa</span>
            </div>
          </div>

          <div className="weather-bottom">
            <span className="aqi-tag">AQI: 3 (Moderate)</span>
            <span className="uv-index">UV Index: 5</span>
          </div>
        </div>

        {/* Hourly Forecast Card */}
        <div className="weather-bottom-section">
          <div className="hourly-forecast-card">
            <div style={{ padding: "10px", margin: "10px" }}>
              <h3>🔴 24-Hour Forecast</h3>
              <br />
            </div>
            <div className="hourly-scroll">
              {[...Array(24)].map((_, index) => (
                <div className="hourly-card" key={index}>
                  <div className="hour">10 PM</div>
                  <div className="hour-icon">⛅</div>
                  <div className="hour-temp">18°</div>
                  <div className="hour-desc">Few Clouds</div>
                  <div className="hour-details">
                    <div>Feels: 17°</div>
                    <div>Wind: 10 km/h</div>
                    <div>Vis: 10 km</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UV Index Card */}
          <div className="uv-index-card">
            <div className="uv-header">
              <span>⚠️ UV Index</span>
              <span className="uv-badge">Very High</span>
            </div>
            <div className="uv-value">8</div>
            <div className="uv-label">Current UV Index</div>
            <div className="uv-scale">
              <div className="uv-gradient">
                <div className="uv-dot" style={{ left: "70%" }}></div>
              </div>
              <div className="uv-scale-labels">
                <span>0</span>
                <span>11+</span>
              </div>
            </div>
            <div className="uv-advice">
              <strong>🛡️ Protection Advice</strong>
              <p>
                Avoid going out during midday. Use SPF 30+ and protective
                clothing.
              </p>
            </div>
            <div className="uv-levels">
              <span className="uv-level low">
                0–2
                <br />
                Low
              </span>
              <span className="uv-level moderate">
                3–7
                <br />
                Moderate
              </span>
              <span className="uv-level high">
                8–11+
                <br />
                High
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Card */}
        <div className="seven-day-forecast-card">
          <div style={{ padding: "10px", margin: "10px" }}>
            <h3>📅 7-Day Forecast</h3>
          </div>
          {[...Array(7)].map((_, index) => (
            <div className="forecast-day" key={index}>
              <div className="forecast-info-left">
                <div className="day-label">
                  {index === 0 ? "Today" : `Day ${index + 1}`}
                </div>
                <div className="forecast-icon">⛅</div>
                <div className="forecast-description">
                  Few Clouds
                  <br />
                  <small>Feels like 19°</small>
                </div>
              </div>
              <div className="forecast-stats">
                <div>💧 47%</div>
                <div>💨 13 km/h</div>
                <div>🌞 UV 5</div>
              </div>
              <div className="forecast-info-right">
                <span className="aqi-badge">AQI 2</span>
                <div className="max-temp">Max: 21</div>
                <div className="min-temp">Min: 15</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
