import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient"; // make sure this is correctly imported
import "./Navbar.css";

interface NavItem {
  path: string;
  label: string;
  icon: string;
} 

const Navbar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();
    // Optionally, add listener for future auth changes:
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const navItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard", icon: "☁️" },
    { path: "/alerts", label: "Alerts", icon: "🔔" },
    { path: "/maps", label: "Maps", icon: "🗺️" },
    {
      path: isLoggedIn ? "/profile" : "/signin",
      label: "Account",
      icon: "👤",
    },
  ];

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
              key={item.label}
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
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
