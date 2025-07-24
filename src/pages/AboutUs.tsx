import { Mail, Linkedin } from "lucide-react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-wrapper">
      <div className="about-container">
        <h1 className="about-title">About SkyCast</h1>
        <p className="about-text">
          At SkyCast, our mission is to deliver precise, timely weather intelligence, empowering you to make informed decisions and navigate your day with confidence. We believe that reliable weather data is not just a convenience, but a critical tool for effective planning, safety, and productivity.
        </p>
        
        <h2 className="about-subtitle">Our Genesis</h2>
        <p className="about-text">
          SkyCast was born from a personal passion for technology and meteorology, coupled with the drive of a 2nd-year B.Tech student. Frustrated by the inconsistencies and clunky interfaces of existing weather applications, I embarked on a journey to create a more reliable and intuitive solution. What started as an academic project quickly evolved into SkyCast, built on the principle that superior weather forecasting should be both accessible and a pleasure to use. Every line of code and every design element is a testament to a commitment to innovation, accuracy, and user experience.
        </p>

        <h2 className="about-subtitle">What Sets Us Apart</h2>
        <ul className="about-list">
          <li>
            <strong>Hyper-Local Accuracy:</strong> Leveraging advanced meteorological models and data processing techniques, SkyCast provides forecasts with exceptional precision for your exact location, ensuring you're always prepared.
          </li>
          <li>
            <strong>Intuitive Interface:</strong> We prioritize clarity and functionality, presenting complex weather data in a clean, easily digestible format that enhances understanding and enjoyment.
          </li>
          <li>
            <strong>Comprehensive Data Visualization:</strong> Explore dynamic radar, satellite imagery, wind patterns, and a wealth of other interactive data layers for a profound understanding of atmospheric conditions.
          </li>
          <li>
            <strong>Intelligent Alerting System:</strong> Customize and receive timely notifications for critical weather events, ensuring you're always one step ahead of changing conditions.
          </li>
          <li>
            <strong>Commitment to Privacy:</strong> As developers, we adhere to stringent data privacy protocols, ensuring your information is handled with the utmost respect and security.
          </li>
        </ul>

        <h2 className="about-subtitle">Our Commitment to You</h2>
        <p className="about-text">
          Your experience is the driving force behind SkyCast. We are committed to continuous innovation, constantly enhancing SkyCast with new features, improved data accuracy, and a refined user experience. As a student-led initiative, we deeply value your feedback, as it directly shapes our development and helps us grow into a leading weather intelligence solution.
        </p>

        <h2 className="about-subtitle">Connect With Us</h2>
        <div className="connect-icons">
          <a href="mailto:support@skycast.com" className="connect-icon">
            <Mail size={24} style={{color:"#ae3037ff"}}/>
            <span style={{color:"#ae3037ff"}}>Email</span>
          </a>
          <a href="https://www.linkedin.com/in/your-profile" target="_blank" className="connect-icon">
            <Linkedin size={24} style={{color:"#1b43e2ff"}}/>
            <span style={{color:"#1b43e2ff"}}>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
