import "./Footer.css";
import { Link } from "react-router-dom";
import {
  Facebook,
  X,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
  Lock,
  FileText,
  Info,
  HelpCircle,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section brand">
          <h2 className="brand-name">SkyCast</h2>
          <p className="tagline">
            Delivering precise, timely weather intelligence so you can plan with
            confidence.
          </p>
          <div className="social-icons">
            <Facebook size={20} />
            <X size={20} />
            <Instagram size={20}/>
            <Youtube size={24} />
          </div>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>
            <Phone size={16} /> +91 98765 43210
          </p>
          <p>
            <Mail size={16} /> support@skycast.com
          </p>
          <p>
            <MapPin size={16} /> Rishihood University, Sonipat - Haryana 131021
          </p>
          <p>
            <Clock size={16} /> Mon - Sat: 9:00 AM - 6:00 PM
          </p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <p>
            <Lock size={16} /> Privacy Policy
          </p>
          <p>
            <FileText size={16} /> Terms and Conditions
          </p>
          <Link to="/about" className="footer-link">
            <Info size={16} style={{ color: "#ffffffff" }} /> About Us
          </Link>

          <p>
            <HelpCircle size={16} /> FAQ
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 SkyCast. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
