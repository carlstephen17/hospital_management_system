import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";

import Bills from "./pages/Bills";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";

// Bills CRUD
import CreateBills from "./CRUD/CRUD_Bills/CreateBills";
import ReadBills from "./CRUD/CRUD_Bills/ReadBills";
import EditBills from "./CRUD/CRUD_Bills/EditBills";

import Reports from "./components/Reports";
import Appointments from "./pages/Appointments";

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


        <Route path="/reports" element={<Reports />} />

        {/* Bills */}
        <Route path="/bills" element={<Bills />} />
        <Route path="/createBills" element={<CreateBills />} />
        <Route path="/readBills/:id" element={<ReadBills />} />
        <Route path="/editBills/:id" element={<EditBills />} />
      </Routes>
    </Router>
  );
}

export default App;