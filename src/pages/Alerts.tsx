import { useEffect, useState } from "react";
import { fetchWeatherAlerts } from "../services/weatherService";
import "./Alerts.css";

interface Alert {
  sender_name: string;
  event: string;
  description: string;
  start: number;
  end: number;
}

// Categorize alerts based on their event keywords
const categorizeAlerts = (alerts: Alert[]) => {
  const categories: Record<string, Alert[]> = {
    Temperature: [],
    Rainfall: [],
    NaturalDisaster: [],
    Others: [],
  };

  alerts.forEach((alert) => {
    const event = alert.event.toLowerCase();

    if (event.includes("heat") || event.includes("cold") || event.includes("temperature")) {
      categories.Temperature.push(alert);
    } else if (event.includes("rain") || event.includes("flood") || event.includes("storm")) {
      categories.Rainfall.push(alert);
    } else if (
      event.includes("cyclone") ||
      event.includes("earthquake") ||
      event.includes("tsunami") ||
      event.includes("landslide")
    ) {
      categories.NaturalDisaster.push(alert);
    } else {
      categories.Others.push(alert);
    }
  });

  return categories;
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const lat = 28.6139;
        const lon = 77.2090;
        const alertsData = await fetchWeatherAlerts(lat, lon);
        setAlerts(alertsData || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Unable to fetch alerts. Try again later.");
      }
    };

    fetchAlerts();
  }, []);

  const categorized = categorizeAlerts(alerts);

  return (
    <div className="alerts-page">
      <h2>⚠️ Weather Alerts</h2>
      {error && <div className="error">{error}</div>}
      {alerts.length === 0 && !error && (
        <div className="no-alerts">No current alerts for this location.</div>
      )}

      {Object.entries(categorized).map(([category, alertList]) => (
        alertList.length > 0 && (
          <div key={category} className="alert-category">
            <h3 className="category-title">
              {category === "Temperature" && "🔥 Temperature Alerts"}
              {category === "Rainfall" && "🌧️ Rainfall Alerts"}
              {category === "NaturalDisaster" && "🌪️ Natural Disasters"}
              {category === "Others" && "📌 Other Alerts"}
            </h3>
            {alertList.map((alert, index) => (
              <div key={index} className="alert-box">
                <h4>{alert.event}</h4>
                <p><strong>From:</strong> {new Date(alert.start * 1000).toLocaleString()}</p>
                <p><strong>To:</strong> {new Date(alert.end * 1000).toLocaleString()}</p>
                <p><strong>Issued By:</strong> {alert.sender_name}</p>
                <p>{alert.description}</p>
              </div>
            ))}
          </div>
        )
      ))}
    </div>
  );
};

export default Alerts;
