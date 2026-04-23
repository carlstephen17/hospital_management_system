import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { URL } from "../API";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    patient_name: "",
    phone: "",
    gender: "",
    address: "",
    condition: "",
    status: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [treatments, setTreatments] = useState([]);

  const [genders, setGenders] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [appointmentData, setAppointmentData] = useState({
    doctor_id: "",
    appointment_date: ""
  });

  const [billData, setBillData] = useState({
    status: ""
  });

  const [treatmentData, setTreatmentData] = useState([]);

  useEffect(() => {
    fetchAll();
  }, [id]);

  async function fetchAll() {
    await Promise.all([
      fetchPatient(),
      fetchDoctors(),
      fetchAppointments(),
      fetchBills(),
      fetchTreatments(),
      fetchGender(),
      fetchStatus(),
    ]);
  }

  async function fetchPatient() {
    const res = await fetch(`${URL}/api/patients/${id}`);
    const data = await res.json();
    if (res.ok) setPatient(data);
  }

  async function fetchGender() {
    const res = await fetch(`${URL}/api/patient/gender`);
    const data = await res.json();
    if (res.ok) setGenders([...new Set(data.map(r => r.gender))]);
  }

  async function fetchStatus() {
    const res = await fetch(`${URL}/api/patient/status`);
    const data = await res.json();
    if (res.ok) setStatusList([...new Set(data.map(r => r.status))]);
  }

  async function fetchDoctors() {
    const res = await fetch(`${URL}/api/doctors`);
    const data = await res.json();
    if (res.ok) setDoctors(data);
  }

  async function fetchAppointments() {
    const res = await fetch(`${URL}/api/appointments`);
    const data = await res.json();

    if (res.ok) {
      setAppointments(data);

      const appt = data.find(a => String(a.patient_id) === String(id));

      if (appt) {
        setAppointmentData({
          doctor_id: appt.doctor_id || "",
          appointment_date: appt.appointment_date || ""
        });
      }
    }
  }

  async function fetchBills() {
    const res = await fetch(`${URL}/api/bills`);
    const data = await res.json();

    if (res.ok) {
      const bill = data.find(b => String(b.patient_id) === String(id));

      setBillData({
        status: bill?.status || ""
      });
    }
  }

  async function fetchTreatments() {
    const res = await fetch(`${URL}/api/patient_treatments`);
    const data = await res.json();

    if (res.ok) {
      const list = data
        .filter(t => String(t.patient_id) === String(id))
        .map(t => ({
          treatment_name: t.treatment_name,
          cost: t.cost || 0
        }));

      setTreatmentData(list);
    }
  }

  function handlePatientChange(e) {
    setPatient(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function handleAppointmentChange(e) {
    setAppointmentData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function handleBillChange(e) {
    setBillData({ status: e.target.value });
  }

  const updateTreatment = (index, field, value) => {
    setTreatmentData(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(`${URL}/api/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    });

    const appt = appointments.find(a => String(a.patient_id) === String(id));

    if (appt) {
      await fetch(`${URL}/api/appointments/${appt.appointment_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: appointmentData.doctor_id,
          appointment_date: appointmentData.appointment_date
        }),
      });
    }

    const bill = bills.find(b => String(b.patient_id) === String(id));

    if (bill) {
      await fetch(`${URL}/api/bills/${bill.bill_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });
    }

    await fetch(`${URL}/api/patient_treatments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(treatmentData),
    });
    navigate("/");
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>

      <h2>Edit Full Patient Record</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>

        <input name="patient_name" value={patient.patient_name || ""} onChange={handlePatientChange} />
        <input name="phone" value={patient.phone || ""} onChange={handlePatientChange} />
        <input name="address" value={patient.address || ""} onChange={handlePatientChange} />
        <input name="condition" value={patient.condition || ""} onChange={handlePatientChange} />

        <select name="gender" value={patient.gender || ""} onChange={handlePatientChange}>
          <option value="">Gender</option>
          {genders.map(g => <option key={g}>{g}</option>)}
        </select>

        <select name="status" value={patient.status || ""} onChange={handlePatientChange}>
          <option value="">Status</option>
          {statusList.map(s => <option key={s}>{s}</option>)}
        </select>

\        <select
          name="doctor_id"
          value={appointmentData.doctor_id}
          onChange={handleAppointmentChange}
        >
          <option value="">Doctor</option>
          {doctors.map(d => (
            <option key={d.doctor_id} value={d.doctor_id}>
              {d.doctor_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="appointment_date"
          value={appointmentData.appointment_date || ""}
          onChange={handleAppointmentChange}
        />

        <div>
          {treatmentData.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 5 }}>

              <input
                value={t.treatment_name}
                onChange={(e) =>
                  updateTreatment(i, "treatment_name", e.target.value)
                }
                placeholder="Treatment"
              />

              <input
                type="number"
                value={t.cost}
                onChange={(e) =>
                  updateTreatment(i, "cost", e.target.value)
                }
                placeholder="Cost"
              />

            </div>
          ))}
        </div>

        <select value={billData.status} onChange={handleBillChange}>
          <option value="">Bill Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <button onClick={() => navigate("/")}>Cancel</button>
        <button type="submit">Save All</button>

      </form>
    </div>
  );
}

export default Edit;