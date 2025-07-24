import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

interface NavItem {
  path: string;
  label: string;
  icon: string;
}



const Navbar = () => {
  const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: "☁️" },
  { path: "/alerts", label: "Alerts", icon: "🔔" },
  { path: "/maps", label: "Maps", icon: "🗺️" },
  { path: "/signin", label: "Account", icon: "👤" },
];
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-logo">
            <span>☁️</span>
          </div>
          <span className="navbar-title">SkyCast</span>
        </Link>

        <div className="navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
