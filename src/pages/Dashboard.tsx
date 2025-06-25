import "./Dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

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

      </div>
    </div>
  );
};

export default Dashboard;
