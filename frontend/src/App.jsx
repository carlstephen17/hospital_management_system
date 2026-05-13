import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";

import Bills from "./pages/Bills";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";

import Reports from "./components/Reports";
import Appointments from "./pages/Appointments";

import Treatments from "./pages/Treatments";

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Home />} />

        {/* Patients */}
        <Route path="/patients" element={<Patients />} />

        {/* Doctors */}
        <Route path="/doctors" element={<Doctors />} />

        <Route path="/appointments" element={<Appointments />} />

        <Route path="/treatments" element={<Treatments />} />


        <Route path="/reports" element={<Reports />} />

        {/* Bills */}
        <Route path="/bills" element={<Bills />} />
      </Routes>
    </Router>
  );
}

export default App;