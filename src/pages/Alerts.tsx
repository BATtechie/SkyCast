import { useEffect, useState } from "react";
import {
  // fetchWeatherAlerts,
  fetchWeatherByCity, // We'll need current weather to check against thresholds
  fetchAQIByCoords,
  fetchUVIndexByCoords,
} from "../services/weatherService"; // Ensure these services are available
import "./Alerts.css";
import {
  Thermometer,
  Wind,
  Cloudy, // Using Cloudy for AQI, could also use specific icon if available
  Sun,
  BellRing, // For the "Test Alert" button
  ToggleLeft, // For disabled toggle
  ToggleRight, // For enabled toggle
} from "lucide-react";

// Existing types from your Dashboard.tsx might be helpful
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
  // Define a proper interface for AQI if your service returns more than a number
  // For now, assuming fetchAQIByCoords returns a number
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

// Define the structure for a user's alert settings
interface AlertSettings {
  temperature: {
    enabled: boolean;
    threshold: number; // For temperature, let's use Celsius
    operator: "above" | "below" | "both"; // e.g., above 30C or below 0C
    showNotification: boolean; // To trigger temporary notification for testing
  };
  windSpeed: {
    enabled: boolean;
    threshold: number; // in km/h
    showNotification: boolean;
  };
  airQuality: {
    enabled: boolean;
    threshold: number; // AQI level (1-5)
    showNotification: boolean;
  };
  uvIndex: {
    enabled: boolean;
    threshold: number; // UV index number
    showNotification: boolean;
  };
}

const Alerts = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [currentAqi, setCurrentAqi] = useState<number | null>(null);
  const [currentUvIndex, setCurrentUvIndex] = useState<number | null>(null);
  const [localAlerts, setLocalAlerts] = useState<string[]>([]); // For triggered alerts
  const [error, setError] = useState<string | null>(null);

  // Initialize alert settings with default thresholds and enabled status
  const [alertSettings, setAlertSettings] = useState<AlertSettings>(() => {
    // Load from localStorage or set defaults
    const savedSettings = localStorage.getItem("alertSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          temperature: { enabled: true, threshold: 30, operator: "above", showNotification: false },
          windSpeed: { enabled: true, threshold: 40, showNotification: false },
          airQuality: { enabled: true, threshold: 4, showNotification: false }, // AQI Level 4 or above
          uvIndex: { enabled: true, threshold: 8, showNotification: false },
        };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("alertSettings", JSON.stringify(alertSettings));
  }, [alertSettings]);

  // Fetch current weather data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const city = "Sonipat"; // Or get from user's preferred location
        const weatherData = await fetchWeatherByCity(city);
        setCurrentWeather(weatherData);

        const { lat, lon } = weatherData.coord;
        const aqiData = await fetchAQIByCoords(lat, lon);
        const uvData = await fetchUVIndexByCoords(lat, lon);

        setCurrentAqi(aqiData);
        setCurrentUvIndex(uvData);
      } catch (err) {
        console.error("Error fetching current weather data:", err);
        setError("Could not load current weather data for alert checks.");
      }
    };
    fetchData();

    // Set up interval to refetch data periodically (e.g., every 5 minutes)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(intervalId);
  }, []); // Run once on mount

  // Function to check conditions and generate local alerts
  useEffect(() => {
    const triggeredAlerts: string[] = [];

    // Temperature Alert Check
    if (currentWeather && alertSettings.temperature.enabled) {
      const temp = Math.round(currentWeather.main.temp);
      if (
        (alertSettings.temperature.operator === "above" &&
          temp >= alertSettings.temperature.threshold) ||
        (alertSettings.temperature.operator === "below" &&
          temp <= alertSettings.temperature.threshold) ||
        (alertSettings.temperature.operator === "both" &&
          (temp >= alertSettings.temperature.threshold || temp <= 0)) // Example for 'both'
      ) {
        triggeredAlerts.push(
          `Temperature Alert: Current temperature is ${temp}°C. Threshold: ${
            alertSettings.temperature.operator === "above" ? "Above" : "Below"
          } ${alertSettings.temperature.threshold}°C.`
        );
      }
    }

    // Wind Speed Alert Check
    if (currentWeather && alertSettings.windSpeed.enabled) {
      const wind = Math.round(currentWeather.wind.speed * 3.6); // Convert m/s to km/h
      if (wind >= alertSettings.windSpeed.threshold) {
        triggeredAlerts.push(
          `Wind Speed Alert: Current wind speed is ${wind} km/h. Threshold: Above ${alertSettings.windSpeed.threshold} km/h.`
        );
      }
    }

    // Air Quality Alert Check (assuming AQI 1-5, 5 being worst)
    if (currentAqi !== null && alertSettings.airQuality.enabled) {
      if (currentAqi >= alertSettings.airQuality.threshold) {
        triggeredAlerts.push(
          `Air Quality Alert: Current AQI is ${currentAqi}. Threshold: AQI Level ${alertSettings.airQuality.threshold} or above.`
        );
      }
    }

    // UV Index Alert Check
    if (currentUvIndex !== null && alertSettings.uvIndex.enabled) {
      if (currentUvIndex >= alertSettings.uvIndex.threshold) {
        triggeredAlerts.push(
          `UV Index Alert: Current UV Index is ${currentUvIndex}. Threshold: UV Index above ${alertSettings.uvIndex.threshold}.`
        );
      }
    }

    // "Severe Weather" (always show if detected from OpenWeatherMap alerts)
    // This is where you'd integrate real API alerts
    // For demonstration, let's simulate a critical alert based on `alerts`
    // (Note: your old `fetchWeatherAlerts` needs to be imported if you still use it)
    /*
    if (alerts.length > 0) { // Assuming `alerts` state from your old code
      // Check for critical events like "storm", "hurricane", "tornado" etc.
      const criticalEvents = alerts.filter(alert =>
        alert.event.toLowerCase().includes('storm') ||
        alert.event.toLowerCase().includes('hurricane') ||
        alert.event.toLowerCase().includes('tornado') ||
        alert.event.toLowerCase().includes('extreme')
      );
      if (criticalEvents.length > 0) {
        criticalEvents.forEach(alert => {
          triggeredAlerts.push(`CRITICAL: ${alert.event} - ${alert.description}`);
        });
      }
    }
    */

    setLocalAlerts(triggeredAlerts);
  }, [currentWeather, currentAqi, currentUvIndex, alertSettings]); // Re-run when these change

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
      },
    }));

    setTimeout(() => {
      setAlertSettings((prevSettings) => ({
        ...prevSettings,
        [alertType]: {
          ...prevSettings[alertType],
          showNotification: false,
        },
      }));
    }, 3000); // Notification visible for 3 seconds
  };

  // Helper for displaying temporary notifications
  const Notification = ({ message, show }: { message: string; show: boolean }) => {
    return show ? <div className="test-notification">{message}</div> : null;
  };


  return (
    <div className="alerts-container">
      <h2>Alert Settings</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Display active local alerts */}
      {/* Display active local alerts */}
      <div className="active-alerts-section"> {/* Removed conditional rendering here to always show the section */}
        <h3>❗ Active Weather Alerts</h3>
        {localAlerts.length > 0 ? (
          localAlerts.map((alertMsg, index) => (
            <div key={index} className="active-alert-item">
              {alertMsg}
            </div>
          ))
        ) : (
          <div className="no-active-alerts-message">
            No active alerts at the moment.
          </div>
        )}
      </div>

      <div className="alert-cards-grid">
        {/* Temperature Alert Card */}
        <div className="alert-card">
          <div className="alert-card-header">
            <Thermometer color="#ef4444" size={28} />
            <h3>Temperature Alert</h3>
          </div>
          <p className="alert-description">
            Get notified when temperature reaches extreme levels
          </p>
          <div className="alert-threshold">
            Threshold:{" "}
            <select
              value={alertSettings.temperature.threshold}
              onChange={(e) => handleThresholdChange("temperature", e.target.value)}
            >
              <option value={35}>Above 45°C</option>
              <option value={30}>Above 30°C</option>
              <option value={25}>Above 25°C</option>
              <option value={0}>Below 0°C</option>
              <option value={-5}>Below -5°C</option>
              <option value={-10}>Below -10°C</option>
            </select>
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
              onClick={() => handleTestAlert("temperature", "Temperature alert test notification!")}
            >
              <BellRing size={16} /> Test Alert
            </button>
          </div>
          <Notification
            message="Temperature alert test notification!"
            show={alertSettings.temperature.showNotification}
          />
        </div>

        {/* Wind Speed Alert Card */}
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
              onClick={() => handleTestAlert("windSpeed", "Wind speed alert test notification!")}
            >
              <BellRing size={16} /> Test Alert
            </button>
          </div>
          <Notification
            message="Wind speed alert test notification!"
            show={alertSettings.windSpeed.showNotification}
          />
        </div>

        {/* Air Quality Alert Card */}
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
              onClick={() => handleTestAlert("airQuality", "Air Quality alert test notification!")}
            >
              <BellRing size={16} /> Test Alert
            </button>
          </div>
          <Notification
            message="Air Quality alert test notification!"
            show={alertSettings.airQuality.showNotification}
          />
        </div>

        {/* UV Index Alert Card */}
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
              onClick={() => handleTestAlert("uvIndex", "UV Index alert test notification!")}
            >
              <BellRing size={16} /> Test Alert
            </button>
          </div>
          <Notification
            message="UV Index alert test notification!"
            show={alertSettings.uvIndex.showNotification}
          />
        </div>
      </div>
    </div>
  );
};

export default Alerts; 