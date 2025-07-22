// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Maps from "./pages/Maps";
import "leaflet/dist/leaflet.css";
import SignIn from "./pages/SignIn";
import Alerts from "./pages/Alerts";
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
      </Routes>
    </main>
    </BrowserRouter>
  );
};

export default App;
