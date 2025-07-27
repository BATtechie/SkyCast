import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <AlertTriangle size={48} color="#facc15" />
        <h1>404 - Page Not Found</h1>
        <p>Oops! The page you’re looking for doesn’t exist.</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} style={{ marginRight: "8px" }} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
