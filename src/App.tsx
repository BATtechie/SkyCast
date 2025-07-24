// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Maps from "./pages/Maps";
import "leaflet/dist/leaflet.css";
import SignIn from "./pages/SignIn";
import Alerts from "./pages/Alerts";
import AboutUs from "./pages/AboutUs";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
const App = () => {
  return (
    <BrowserRouter>
    <main>
      <Navbar/>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/Signin" element={<SignIn/>} />
        <Route path="/alerts" element={<Alerts/>}/>
        <Route path="/about" element ={<AboutUs/>}/>
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer/>
    </main>
    </BrowserRouter>
  );
};

export default App;
