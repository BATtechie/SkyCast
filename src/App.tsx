// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
const App = () => {
  return (
    <BrowserRouter>
    <main>
      <Navbar/>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </main>
    </BrowserRouter>
  );
};

export default App;
