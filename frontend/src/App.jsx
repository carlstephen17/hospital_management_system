import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Read from "./components/Read";
import Reports from "./components/Reports";
import NF1 from "./normalization/NF1";
import Edit from "./components/Edit";
import Bills from "./reports/Bills";
import CreateBills from "./CRUD Bills/CreateBills";
import ReadBills from "./CRUD Bills/ReadBills";
import EditBills from "./CRUD Bills/EditBills";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nf1" element={<NF1 />} />
        <Route path="/read/:id" element={<Read />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/createBills" element={<CreateBills />} />
        <Route path="/readBills/:id" element={<ReadBills />} />
        <Route path="/editBills/:id" element={<EditBills />} />
      </Routes>
    </Router>
  );
}

export default App;

