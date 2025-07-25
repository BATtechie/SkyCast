import { useEffect, useState } from "react";
import {
  fetchWeatherByCity,
  fetchAQIByCoords,
  fetchUVIndexByCoords,
} from "../services/weatherService";
import "./Alerts.css";
import {
  Thermometer,
  Wind,
  Cloudy,
  Sun,
  BellRing,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";


export interface WeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  visibility: number;
  coord: { lat: number; lon: number };
}

export interface AQIData { 
  main: { aqi: number };
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}


interface AlertSettings {
  temperature: {
    enabled: boolean;
    threshold: number; 
    operator: "above" | "below" | "both"; 
    showNotification: boolean; 
    testMessage: string; 
  };
  windSpeed: {
    enabled: boolean;
    threshold: number; 
    showNotification: boolean;
    testMessage: string;
  };
  airQuality: {
    enabled: boolean;
    threshold: number;
    showNotification: boolean;
    testMessage: string;
  };
  uvIndex: {
    enabled: boolean;
    threshold: number; 
    showNotification: boolean;
    testMessage: string;
  };
}

const Alerts = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [currentAqi, setCurrentAqi] = useState<number | null>(null);
  const [currentUvIndex, setCurrentUvIndex] = useState<number | null>(null);
  const [localAlerts, setLocalAlerts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchedCity, setSearchedCity] = useState<string>('Loading City...');
  const [showNoAlertsMessage, setShowNoAlertsMessage] = useState(true);


  const [alertSettings, setAlertSettings] = useState<AlertSettings>(() => { 
    const savedSettings = localStorage.getItem("alertSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          temperature: { enabled: true, threshold: 30, operator: "above", showNotification: false, testMessage: '' },
          windSpeed: { enabled: true, threshold: 40, showNotification: false, testMessage: '' },
          airQuality: { enabled: true, threshold: 4, showNotification: false, testMessage: '' }, 
          uvIndex: { enabled: true, threshold: 8, showNotification: false, testMessage: '' },
        };
  });

 
  useEffect(() => {
    localStorage.setItem("alertSettings", JSON.stringify(alertSettings));
  }, [alertSettings]);


  useEffect(() => {
    const fetchAlertDataForCity = async () => {
      const lastCity = localStorage.getItem('lastSearchedCity');
      const cityToFetch = lastCity || 'New Delhi'; 
      setSearchedCity(cityToFetch);

      try {
        const weatherData = await fetchWeatherByCity(cityToFetch);
        setCurrentWeather(weatherData);

        const { lat, lon } = weatherData.coord;
        const aqiData = await fetchAQIByCoords(lat, lon);
        const uvData = await fetchUVIndexByCoords(lat, lon);

        setCurrentAqi(aqiData);
        setCurrentUvIndex(uvData);
        setError(null);
      } catch (err) {
        console.error(`Error fetching current weather data for ${cityToFetch}:`, err);
        setError(`Could not load current weather data for alert checks for ${cityToFetch}. Please ensure the city name is valid.`);
        setCurrentWeather(null);
        setCurrentAqi(null);
        setCurrentUvIndex(null);
      }
    };

    const handleStorageChange = () => {
      fetchAlertDataForCity();
    };

    fetchAlertDataForCity();

    const intervalId = setInterval(fetchAlertDataForCity, 5 * 60 * 1000);

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

 
  useEffect(() => {
    const triggeredAlerts: string[] = [];

  
    if (currentWeather && alertSettings.temperature.enabled) {
      const temp = Math.round(currentWeather.main.temp);
      const threshold = alertSettings.temperature.threshold;
      const operator = alertSettings.temperature.operator;

      let shouldAlert = false;
      if (operator === "above" && temp >= threshold) {
        shouldAlert = true;
      } else if (operator === "below" && temp <= threshold) {
        shouldAlert = true;
      } else if (operator === "both") {
        
        const highThresholdForBoth = 35; 
        const lowThresholdForBoth = 0;   
        if (temp >= highThresholdForBoth || temp <= lowThresholdForBoth) {
          shouldAlert = true;
        }
      }

      if (shouldAlert) {
        triggeredAlerts.push(
          `Temperature Alert: Current temperature in ${searchedCity} is ${temp}°C. Threshold: ${
            operator === "above" ? "Above" : operator === "below" ? "Below" : "Extreme"
          } ${threshold}°C.`
        );
      }
    }

    
    if (currentWeather && alertSettings.windSpeed.enabled) {
      const wind = Math.round(currentWeather.wind.speed * 3.6); 
      if (wind >= alertSettings.windSpeed.threshold) {
        triggeredAlerts.push(
          `Wind Speed Alert: Current wind speed in ${searchedCity} is ${wind} km/h. Threshold: Above ${alertSettings.windSpeed.threshold} km/h.`
        );
      }
    }

    
    if (currentAqi !== null && alertSettings.airQuality.enabled) {
      if (currentAqi >= alertSettings.airQuality.threshold) {
        triggeredAlerts.push(
          `Air Quality Alert: Current AQI in ${searchedCity} is ${currentAqi}. Threshold: AQI Level ${alertSettings.airQuality.threshold} or above.`
        );
      }
    }

    
    if (currentUvIndex !== null && alertSettings.uvIndex.enabled) {
      if (currentUvIndex >= alertSettings.uvIndex.threshold) {
        triggeredAlerts.push(
          `UV Index Alert: Current UV Index in ${searchedCity} is ${currentUvIndex}. Threshold: UV Index above ${alertSettings.uvIndex.threshold}.`
        );
      }
    } 

    setLocalAlerts(triggeredAlerts);
  }, [currentWeather, currentAqi, currentUvIndex, alertSettings, searchedCity]);

  
  const handleTemperatureOperatorChange = (
    operator: "above" | "below" | "both"
  ) => {
    setAlertSettings((prevSettings) => ({
      ...prevSettings,
      temperature: {
        ...prevSettings.temperature,
        operator: operator,
        
        threshold:
          operator === "above"
            ? 30 
            : operator === "below"
            ? 0
            : 35,
      },
    }));
  };

  const handleToggle = (alertType: keyof AlertSettings) => {
    setAlertSettings((prevSettings) => ({
      ...prevSettings,
      [alertType]: {
        ...prevSettings[alertType],
        enabled: !prevSettings[alertType].enabled,
      },
    }));
  };

  const handleThresholdChange = (
    alertType: keyof AlertSettings,
    value: string
  ) => {
    setAlertSettings((prevSettings) => ({
      ...prevSettings,
      [alertType]: {
        ...prevSettings[alertType],
        threshold: Number(value),
      },
    }));
  };

  const handleTestAlert = (alertType: keyof AlertSettings, message: string) => {
    setAlertSettings((prevSettings) => ({ 
      ...prevSettings,
      [alertType]: {
        ...prevSettings[alertType],
        showNotification: true,
        testMessage: message,
      },
    }));

    setTimeout(() => {
      setAlertSettings((prevSettings) => ({
        ...prevSettings,
        [alertType]: {
          ...prevSettings[alertType],
          showNotification: false,
          testMessage: '',
        },
      }));
    }, 3000);
  };

  const Notification = ({ message, show, onClose }: { message: string; show: boolean; onClose: () => void; }) => {
    return show ? (
      <div className="test-notification">
        {message}
        <button className="close-notification-button" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    ) : null;
  };

  const handleCloseNoAlertsMessage = () => {
    setShowNoAlertsMessage(false);
  };

  return (
    <div className="alerts-container">
      <h2>Alert Settings for {searchedCity}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="active-alerts-section">
        <h3>❗ Active Weather Alerts for {searchedCity}</h3>
        {localAlerts.length > 0 ? (
          localAlerts.map((alertMsg, index) => (
            <div key={index} className="active-alert-item">
              {alertMsg}
            </div>
          ))
        ) : (
          showNoAlertsMessage && (
            <div className="no-active-alerts-message">
              No active alerts at the moment for {searchedCity}.
              <button className="close-no-alerts-message-button" onClick={handleCloseNoAlertsMessage}>
                <X size={16} />
              </button>
            </div>
          )
        )}
      </div>

      <div className="alert-cards-grid">

        <div className="alert-card">
          <div className="alert-card-header">
            <Thermometer color="#ef4444" size={28} />
            <h3>Temperature Alert</h3>
          </div>
          <p className="alert-description">
            Get notified when temperature reaches extreme levels
          </p>


          <div className="alert-operator-selection">
            <label>
              <input
                type="radio"
                name="tempOperator"
                value="above"
                checked={alertSettings.temperature.operator === "above"}
                onChange={() => handleTemperatureOperatorChange("above")}
              />{" "}
              Above
            </label>
            <label>
              <input
                type="radio"
                name="tempOperator"
                value="below"
                checked={alertSettings.temperature.operator === "below"}
                onChange={() => handleTemperatureOperatorChange("below")}
              />{" "}
              Below
            </label>
            <label>
              <input
                type="radio"
                name="tempOperator"
                value="both"
                checked={alertSettings.temperature.operator === "both"}
                onChange={() => handleTemperatureOperatorChange("both")}
              />{" "}
              Both (Hot & Cold)
            </label>
          </div>

          <div className="alert-threshold">
            Threshold:{" "}

            {alertSettings.temperature.operator === "above" && (
              <select
                value={alertSettings.temperature.threshold}
                onChange={(e) => handleThresholdChange("temperature", e.target.value)}
              >
                <option value={35}>35°C</option>
                <option value={30}>30°C</option>
                <option value={25}>25°C</option>
              </select>
            )}
            {alertSettings.temperature.operator === "below" && (
              <select
                value={alertSettings.temperature.threshold}
                onChange={(e) => handleThresholdChange("temperature", e.target.value)}
              >
                <option value={0}>0°C</option>
                <option value={-5}>-5°C</option>
                <option value={-10}>-10°C</option>
              </select>
            )}
            {alertSettings.temperature.operator === "both" && (
              <select
                value={alertSettings.temperature.threshold} 
                onChange={(e) => handleThresholdChange("temperature", e.target.value)}
              >
                 <option value={35}>Hot: 35°C / Cold: 0°C</option>
                 <option value={30}>Hot: 30°C / Cold: -5°C</option>
              </select>

            )}
          </div>

          <div className="alert-actions">
            <div className="toggle-switch">
              {alertSettings.temperature.enabled ? (
                <ToggleRight size={30} color="#4CAF50" onClick={() => handleToggle("temperature")} className="toggle-icon" />
              ) : (
                <ToggleLeft size={30} color="#757575" onClick={() => handleToggle("temperature")} className="toggle-icon" />
              )}
              <span>Enabled</span>
            </div>
            <button
              className="test-alert-button"
              onClick={() => handleTestAlert("temperature", `Temperature alert test notification for ${searchedCity}!`)}
            >
              <BellRing size={16} /> Test Alert
            </button>
          </div>
          <Notification
            message={alertSettings.temperature.testMessage}
            show={alertSettings.temperature.showNotification}
            onClose={() => setAlertSettings(prev => ({ ...prev, temperature: { ...prev.temperature, showNotification: false, testMessage: '' }}))}
          />
        </div>


        <div className="alert-card">
          <div className="alert-card-header">
            <Wind color="#60a5fa" size={28} />
            <h3>Wind Speed Alert</h3>
          </div>
          <p className="alert-description">
            Alerts for high wind conditions that may affect travel
          </p>
          <div className="alert-threshold">
            Threshold:{" "}
            <select
              value={alertSettings.windSpeed.threshold}
              onChange={(e) => handleThresholdChange("windSpeed", e.target.value)}
            >
              <option value={30}>Above 30 km/h</option>
              <option value={40}>Above 40 km/h</option>
              <option value={50}>Above 50 km/h</option>
              <option value={60}>Above 60 km/h</option>
            </select>
          </div>

          <div className="alert-actions">
            <div className="toggle-switch">
              {alertSettings.windSpeed.enabled ? (
                <ToggleRight size={30} color="#4CAF50" onClick={() => handleToggle("windSpeed")} className="toggle-icon" />
              ) : (
                <ToggleLeft size={30} color="#757575" onClick={() => handleToggle("windSpeed")} className="toggle-icon" />
              )}
              <span>Enabled</span>
            </div>
            <button
              className="test-alert-button"
              onClick={() => handleTestAlert("windSpeed", `Wind speed alert test notification for ${searchedCity}!`)}
            >
              <BellRing size={16} /> Test Alert
            </button>
          </div>
          <Notification
            message={alertSettings.windSpeed.testMessage}
            show={alertSettings.windSpeed.showNotification}
            onClose={() => setAlertSettings(prev => ({ ...prev, windSpeed: { ...prev.windSpeed, showNotification: false, testMessage: '' }}))}
          />
        </div>


        <div className="alert-card">
          <div className="alert-card-header">
            <Cloudy color="#a78bfa" size={28} />
            <h3>Air Quality Alert</h3>
          </div>
          <p className="alert-description">
            AQI alerts when air quality becomes unhealthy
          </p>
          <div className="alert-threshold">
            Threshold:{" "}
            <select
              value={alertSettings.airQuality.threshold}
              onChange={(e) => handleThresholdChange("airQuality", e.target.value)}
            >
              <option value={2}>AQI Level 2 or above</option>
              <option value={3}>AQI Level 3 or above</option>
              <option value={4}>AQI Level 4 or above</option>
              <option value={5}>AQI Level 5 (Very Poor) or above</option>
            </select>
          </div>

          <div className="alert-actions">
            <div className="toggle-switch">
              {alertSettings.airQuality.enabled ? (
                <ToggleRight size={30} color="#4CAF50" onClick={() => handleToggle("airQuality")} className="toggle-icon" />
              ) : (
                <ToggleLeft size={30} color="#757575" onClick={() => handleToggle("airQuality")} className="toggle-icon" />
              )}
              <span>Enabled</span>
            </div>
            <button
              className="test-alert-button"
              onClick={() => handleTestAlert("airQuality", `Air Quality alert test notification for ${searchedCity}!`)}
            >
              <BellRing size={16} /> Test Alert
            </button>
          </div>
          <Notification
            message={alertSettings.airQuality.testMessage}
            show={alertSettings.airQuality.showNotification}
            onClose={() => setAlertSettings(prev => ({ ...prev, airQuality: { ...prev.airQuality, showNotification: false, testMessage: '' }}))}
          />
        </div>


        <div className="alert-card">
          <div className="alert-card-header">
            <Sun color="#facc15" size={28} />
            <h3>UV Index Alert</h3>
          </div>
          <p className="alert-description">
            UV warnings for dangerous sun exposure levels
          </p>
          <div className="alert-threshold">
            Threshold:{" "}
            <select
              value={alertSettings.uvIndex.threshold}
              onChange={(e) => handleThresholdChange("uvIndex", e.target.value)}
            >
              <option value={6}>UV Index above 6</option>
              <option value={8}>UV Index above 8</option>
              <option value={10}>UV Index above 10</option>
            </select>
          </div>

          <div className="alert-actions">
            <div className="toggle-switch">
              {alertSettings.uvIndex.enabled ? (
                <ToggleRight size={30} color="#4CAF50" onClick={() => handleToggle("uvIndex")} className="toggle-icon" />
              ) : (
                <ToggleLeft size={30} color="#757575" onClick={() => handleToggle("uvIndex")} className="toggle-icon" />
              )}
              <span>Enabled</span>
            </div>
            <button
              className="test-alert-button"
              onClick={() => handleTestAlert("uvIndex", `UV Index alert test notification for ${searchedCity}!`)}
            >
              <BellRing size={16} /> Test Alert
            </button>
          </div>
          <Notification
            message={alertSettings.uvIndex.testMessage}
            show={alertSettings.uvIndex.showNotification}
            onClose={() => setAlertSettings(prev => ({ ...prev, uvIndex: { ...prev.uvIndex, showNotification: false, testMessage: '' }}))}
          />
        </div>
      </div>
    </div>
  );
};

export default Alerts;