
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

