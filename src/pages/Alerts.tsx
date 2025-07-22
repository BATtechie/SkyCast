import { useEffect, useState } from "react";
import { fetchWeatherAlerts } from "../services/weatherService";
import "./Alerts.css"

interface Alert {
  sender_name: string;
  event: string;
  description: string;
  start: number;
  end: number;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // For now, you can default to a location like Delhi
        const lat = 28.6139;
        const lon = 77.2090;
        const alertsData = await fetchWeatherAlerts(lat, lon);
        setAlerts(alertsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Unable to fetch alerts. Try again later.");
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="alerts-page">
      <h2>⚠️ Weather Alerts</h2>
      {error && <div className="error">{error}</div>}
      {alerts.length === 0 && !error && (
        <div className="no-alerts">No current alerts for this location.</div>
      )}
      {alerts.map((alert, index) => (
        <div key={index} className="alert-box">
          <h3>{alert.event}</h3>
          <p><strong>From:</strong> {new Date(alert.start * 1000).toLocaleString()}</p>
          <p><strong>To:</strong> {new Date(alert.end * 1000).toLocaleString()}</p>
          <p><strong>Issued By:</strong> {alert.sender_name}</p>
          <p>{alert.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Alerts;
