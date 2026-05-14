import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });
const app = express();
const port = 1234;

// Middleware
app.use(cors());
app.use(express.json());

// ------------------ SERVER ------------------ //
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
const dbPromise = db.promise();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^09\d{9}$/;

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// ------------------ PATIENT CRUD ------------------ //
app.get("/api/patients", (req, res) => {
  db.query("SELECT * FROM patients", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/patients/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM patients WHERE patient_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length)
        return res.status(404).json({ message: "Patient not found" });
      res.json(results[0]);
    },
  );
});

app.post("/api/patients", (req, res) => {
  const {
    patient_name,
    phone,
    gender,
    address,
    medical_condition,
    blood_type,
    status,
  } = req.body;

  if (
    !patient_name ||
    !phone ||
    !gender ||
    !address ||
    !medical_condition ||
    !blood_type ||
    !status
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Phone number must start with '09' and be exactly 11 digits" });
  }

  const sql = `
    INSERT INTO patients
    (
      patient_name,
      phone,
      gender,
      address,
      medical_condition,
      blood_type,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    patient_name,
    phone,
    gender,
    address,
    medical_condition,
    blood_type,
    status,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("CREATE PATIENT ERROR:", err);

      return res.status(500).json({
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Patient created successfully",
      patient_id: result.insertId,
    });
  });
});

app.put("/api/patients/:id", (req, res) => {
  const { id } = req.params;
  const {
    patient_name,
    phone,
    gender,
    address,
    medical_condition,
    blood_type,
    status,
  } = req.body;

  if (phone !== undefined && phone !== null && !phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Phone number must start with '09' and be exactly 11 digits" });
  }

  let query = "UPDATE patients SET ";
  let params = [];

  if (patient_name !== undefined) {
    query += "patient_name = ?, ";
    params.push(patient_name);
  }
  if (phone !== undefined && phone !== null && !phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Phone number must start with '09' and be exactly 11 digits" });
  }
  if (gender !== undefined) {
    query += "gender = ?, ";
    params.push(gender || null);
  }
  if (address !== undefined) {
    query += "address = ?, ";
    params.push(address || null);
  }
  if (medical_condition !== undefined) {
    query += "`medical_condition` = ?, ";
    params.push(medical_condition || null);
  }
  if (blood_type !== undefined) {
    query += "`blood_type` = ?, ";
    params.push(blood_type || null);
  }
  if (status !== undefined) {
    query += "`status` = ?, ";
    params.push(status || null);
  }

  query = query.slice(0, -2);
  query += " WHERE patient_id = ?";
  params.push(id);

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Patient updated successfully" });
  });
});

app.delete("/api/patients/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "DELETE FROM patient_treatments WHERE patient_id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      db.query("DELETE FROM appointments WHERE patient_id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query("DELETE FROM bills WHERE patient_id = ?", [id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          db.query("DELETE FROM patients WHERE patient_id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
              message: "Patient and related records deleted successfully",
            });
          });
        });
      });
    },
  );
});

app.delete("/api/deleteAll", (req, res) => {
  db.query("TRUNCATE TABLE patient_treatments", (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("TRUNCATE TABLE appointments", (err) => {
      if (err) return res.status(500).json({ error: err.message });
      db.query("TRUNCATE TABLE bills", (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query("TRUNCATE TABLE patients", (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({
            message: "All patients and related records deleted successfully",
          });
        });
      });
    });
  });
});

// GENDER FROM PATIENTS
app.get("/api/patient/gender", (req, res) => {
  db.query("SELECT gender FROM patients", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// STATUS FROM PATIENTS
app.get("/api/patient/status", (req, res) => {
  db.query("SELECT status FROM patients", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ------------------ DOCTOR CRUD ------------------ //
app.get("/api/doctors", (req, res) => {
  db.query("SELECT * FROM doctors", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/doctors/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM doctors WHERE doctor_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length)
        return res.status(404).json({ message: "Doctor not found" });
      res.json(results[0]);
    },
  );
});

app.post("/api/doctors", (req, res) => {
  const { doctor_name, phone, doctor_specialty, department_id, email } =
    req.body;

  if (!doctor_name || !phone || !doctor_specialty || !department_id || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Phone number must start with '09' and be exactly 11 digits" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  db.query(
    "INSERT INTO doctors (doctor_name, phone, doctor_specialty, department_id, email) VALUES (?, ?, ?, ?, ?)",
    [doctor_name, phone, doctor_specialty, department_id, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ doctor_id: result.insertId });
    },
  );
});

app.put("/api/doctors/:id", (req, res) => {
  const { id } = req.params;
  const { doctor_name, phone, doctor_specialty, department_id, email } =
    req.body;

  if (phone !== undefined && phone !== null && !phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Phone number must start with '09' and be exactly 11 digits" });
  }

  if (email !== undefined && email !== null && !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  db.query(
    "UPDATE doctors SET doctor_name = ?, phone = ?, doctor_specialty = ?, department_id = ?, email = ? WHERE doctor_id = ?",
    [doctor_name, phone, doctor_specialty, department_id, email, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Doctor updated successfully" });
    },
  );
});

app.delete("/api/doctors/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM doctors WHERE doctor_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Doctor deleted successfully" });
  });
});

app.delete("/api/deleteAllDoctors", (req, res) => {
  db.query("TRUNCATE TABLE doctors", (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "All doctors deleted successfully" });
  });
});

// ------------------ DEPARTMENT CRUD ------------------ //
app.get("/api/departments", (req, res) => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/departments", (req, res) => {
  const { department_name } = req.body;
  db.query(
    "INSERT INTO departments (department_name) VALUES (?)",
    [department_name],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ department_id: result.insertId });
    },
  );
});

app.put("/api/departments/:id", (req, res) => {
  const { id } = req.params;
  const { department_name } = req.body;
  db.query(
    "UPDATE departments SET department_name = ? WHERE department_id = ?",
    [department_name, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Department updated successfully" });
    },
  );
});

app.delete("/api/departments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM departments WHERE department_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Department deleted successfully" });
  });
});

// ------------------ DOCTOR_DEPARTMENT CRUD ------------------ //
app.get("/api/doctor_department", (req, res) => {
  db.query("SELECT * FROM doctor_department", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/doctor_department", (req, res) => {
  const { doctor_id, department_id } = req.body;
  db.query(
    "INSERT INTO doctor_department (doctor_id, department_id) VALUES (?, ?)",
    [doctor_id, department_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    },
  );
});

app.put("/api/doctor_department/:id", (req, res) => {
  const { id } = req.params;
  const { doctor_id, department_id } = req.body;
  db.query(
    "UPDATE doctor_department SET doctor_id = ?, department_id = ? WHERE id = ?",
    [doctor_id, department_id, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Doctor-Department updated successfully" });
    },
  );
});

app.delete("/api/doctor_department/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM doctor_department WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Doctor-Department deleted successfully" });
  });
});

// ------------------ TREATMENTS CRUD ------------------ //
app.get("/api/treatments", (req, res) => {
  db.query("SELECT * FROM treatments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/treatments", (req, res) => {
  const { treatment_name, cost } = req.body;
  db.query(
    "INSERT INTO treatments (treatment_name, cost) VALUES (?, ?)",
    [treatment_name, cost],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    },
  );
});

app.put("/api/treatments/:id", (req, res) => {
  const { id } = req.params;
  const { treatment_name, cost } = req.body;
  db.query(
    "UPDATE treatments SET treatment_name = ?, cost = ? WHERE treatment_id = ?",
    [treatment_name, cost, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Treatment updated successfully" });
    },
  );
});

app.delete("/api/treatments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM treatments WHERE treatment_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Treatment deleted successfully" });
  });
});

app.delete("/api/deleteAllTreatments", (req, res) => {
  db.query("TRUNCATE TABLE patient_treatments", (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("TRUNCATE TABLE treatments", (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "All treatments and related records deleted successfully" });
    });
  });
});

// ------------------ PATIENT_TREATMENTS CRUD ------------------ //
app.get("/api/patient_treatments", (req, res) => {
  db.query("SELECT * FROM patient_treatments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/patient_treatments", (req, res) => {
  const { patient_id, treatment_id, date_given } = req.body;
  db.query(
    "INSERT INTO patient_treatments (patient_id, treatment_id, date_given) VALUES (?, ?, ?)",
    [patient_id, treatment_id, date_given],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    },
  );
});

app.put("/api/patient_treatments/:id", (req, res) => {
  const { id } = req.params;
  const { patient_id, treatment_id, date_given } = req.body;
  db.query(
    "UPDATE patient_treatments SET patient_id = ?, treatment_id = ?, date_given = ? WHERE id = ?",
    [patient_id, treatment_id, date_given, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Patient-Treatment updated successfully" });
    },
  );
});

app.delete("/api/patient_treatments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM patient_treatments WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Patient-Treatment deleted successfully" });
  });
});

// ------------------ APPOINTMENTS CRUD ------------------ //
app.get("/api/appointments", (req, res) => {
  db.query("SELECT * FROM appointments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/appointments", (req, res) => {
  const { patient_id, doctor_id, appointment_type, appointment_date, status } =
    req.body;
  db.query(
    "INSERT INTO appointments (patient_id, doctor_id, appointment_type, appointment_date, status) VALUES (?, ?, ?, ?, ?)",
    [patient_id, doctor_id, appointment_type, appointment_date, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    },
  );
});

app.put("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const {
    patient_id,
    doctor_id,
    appointment_type,
    appointment_date,
    status,
  } = req.body;

  let query = "UPDATE appointments SET ";
  let params = [];

  if (patient_id !== undefined && patient_id !== null) {
    query += "patient_id = ?, ";
    params.push(patient_id);
  }

  if (doctor_id !== undefined && doctor_id !== null) {
    query += "doctor_id = ?, ";
    params.push(doctor_id);
  }

  if (appointment_type !== undefined && appointment_type !== null) {
    query += "appointment_type = ?, ";
    params.push(appointment_type);
  }

  if (appointment_date !== undefined && appointment_date !== null) {
    query += "appointment_date = ?, ";
    params.push(appointment_date);
  }

  if (status !== undefined && status !== null) {
    query += "status = ?, ";
    params.push(status);
  }

  query = query.slice(0, -2);
  query += " WHERE appointment_id = ?";
  params.push(id);

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Appointment updated successfully" });
  });
});

app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM appointments WHERE appointment_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Appointment deleted successfully" });
  });
});

app.delete("/api/deleteAllAppointments", (req, res) => {
  db.query("TRUNCATE TABLE appointments", (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "All appointments deleted successfully" });
  });
});

// ------------------ BILLS CRUD ------------------ //
app.get("/api/bills", (req, res) => {
  db.query("SELECT * FROM bills", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/bills", async (req, res) => {
  const { patient_id, treatment_id, amount, bill_date, status } = req.body;

  if (!patient_id || !treatment_id || !amount || !bill_date) {
    return res.status(400).json({ error: "Patient ID, Treatment ID, Amount, and Bill Date are required" });
  }

  try {
    const [treatmentRows] = await dbPromise.query("SELECT cost FROM treatments WHERE treatment_id = ?", [treatment_id]);
    if (treatmentRows.length === 0) {
      return res.status(400).json({ error: "Invalid treatment ID" });
    }
    const treatmentCost = treatmentRows[0].cost;
    let billStatus = status;
    if (!billStatus) {
      billStatus = amount < treatmentCost ? "Pending" : "Paid";
    }

    const [result] = await dbPromise.query(
      "INSERT INTO bills (patient_id, treatment_id, amount, bill_date, status) VALUES (?, ?, ?, ?, ?)",
      [patient_id, treatment_id, amount, bill_date, billStatus]
    );

    res.status(201).json({
      id: result.insertId,
      patient_id,
      treatment_id,
      amount,
      bill_date,
      status: billStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/bills/:id", (req, res) => {
  const { id } = req.params;
  const { patient_id, treatment_id, amount, bill_date, status } = req.body;

  let query = "UPDATE bills SET ";
  let params = [];

  if (amount !== undefined) {
    query += "amount = ?, ";
    params.push(amount);
  }
  if (bill_date !== undefined) {
    query += "bill_date = ?, ";
    params.push(bill_date);
  }
  if (treatment_id !== undefined) {
    query += "treatment_id = ?, ";
    params.push(treatment_id);
  }
  if (status !== undefined) {
    query += "status = ?, ";
    params.push(status);
  }
  if (patient_id !== undefined && patient_id !== null) {
    query += "patient_id = ?, ";
    params.push(patient_id);
  }

  query = query.slice(0, -2);
  query += " WHERE bill_id = ?";
  params.push(id);

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Bill updated successfully" });
  });
});

app.delete("/api/bills/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM bills WHERE bill_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Bill deleted successfully" });
  });
});

app.delete("/api/deleteAllBills", (req, res) => {
  db.query("TRUNCATE TABLE bills", (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "All bills deleted successfully" });
  });
});

// ------------------ REPORTS (Cartesian, UNION, DIFFERENCE) ------------------ //
app.get("/api/reports/cartesian", (req, res) => {
  db.query(
    `
    SELECT d.doctor_name,
           p.patient_name,
           p.medical_condition AS medical_condition
    FROM doctors d
    JOIN appointments a ON d.doctor_id = a.doctor_id
    JOIN patients p ON p.patient_id = a.patient_id
  `,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    },
  );
});

app.get("/api/reports/union", (req, res) => {
  db.query(
    `
    SELECT p.patient_id, p.patient_name, t.treatment_name 
    FROM patients p, patient_treatments pt, treatments t 
    WHERE p.patient_id = pt.patient_id 
      AND pt.treatment_id = t.treatment_id
  `,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    },
  );
});

app.get("/api/reports/difference", (req, res) => {
  const sql = `
    SELECT DISTINCT 
      p.patient_id,
      p.patient_name,
      b.bill_id,
      COALESCE(b.status, 'No Bill') AS status,
      COALESCE(b.bill_date, 'Not Set') AS bill_date
    FROM patients p 
    JOIN appointments a ON p.patient_id = a.patient_id
    LEFT JOIN bills b ON p.patient_id = b.patient_id 
    WHERE b.patient_id IS NULL OR b.status = 'unpaid'
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/analytics", async (req, res) => {
  try {
    const [[patientCount]] = await dbPromise.query(
      "SELECT COUNT(*) AS total_patients FROM patients",
    );

    const [[doctorCount]] = await dbPromise.query(
      "SELECT COUNT(*) AS total_doctors FROM doctors",
    );

    const [[appointmentCount]] = await dbPromise.query(
      "SELECT COUNT(*) AS total_appointments FROM appointments",
    );

    const [[billSummary]] = await dbPromise.query(
      `SELECT COUNT(*) AS total_bills,
              COALESCE(SUM(amount), 0) AS total_amount,
              SUM(CASE WHEN LOWER(status) = 'paid' THEN 1 ELSE 0 END) AS paid_bills,
              SUM(CASE WHEN LOWER(status) = 'unpaid' THEN 1 ELSE 0 END) AS unpaid_bills
       FROM bills`,
    );

    const [genderDistribution] = await dbPromise.query(
      `SELECT COALESCE(NULLIF(TRIM(LOWER(gender)), ''), 'unknown') AS gender,
              COUNT(*) AS count
       FROM patients
       GROUP BY gender
       ORDER BY count DESC`,
    );

    const [statusDistribution] = await dbPromise.query(
      `SELECT COALESCE(NULLIF(TRIM(LOWER(status)), ''), 'unknown') AS status,
              COUNT(*) AS count
       FROM patients
       GROUP BY status
       ORDER BY count DESC`,
    );

    const [[criticalCount]] = await dbPromise.query(
      `SELECT COUNT(*) AS critical_patients
       FROM patients
       WHERE LOWER(status) = 'critical'
          OR LOWER(medical_condition) LIKE '%critical%'`,
    );

    const [topConditions] = await dbPromise.query(
      `SELECT COALESCE(NULLIF(TRIM(medical_condition), ''), 'Unknown') AS condition_name,
              COUNT(*) AS count
       FROM patients
       GROUP BY medical_condition
       ORDER BY count DESC
       LIMIT 6`,
    );

    const [appointmentsByDoctor] = await dbPromise.query(
      `SELECT d.doctor_name AS label,
              COUNT(*) AS count
       FROM appointments a
       JOIN doctors d ON d.doctor_id = a.doctor_id
       GROUP BY d.doctor_name
       ORDER BY count DESC
       LIMIT 6`,
    );

    const totalPatients = patientCount?.total_patients ?? 0;
    const genderData = genderDistribution.map((entry) => {
      const count = Number(entry.count ?? 0);
      return {
        gender: entry.gender,
        count,
        percentage: totalPatients ? Number(((count / totalPatients) * 100).toFixed(1)) : 0,
      };
    });

    const statusData = statusDistribution.map((entry) => {
      const count = Number(entry.count ?? 0);
      return {
        status: entry.status,
        count,
        percentage: totalPatients ? Number(((count / totalPatients) * 100).toFixed(1)) : 0,
      };
    });

    res.json({
      total_patients: Number(patientCount?.total_patients ?? 0),
      total_doctors: Number(doctorCount?.total_doctors ?? 0),
      total_appointments: Number(appointmentCount?.total_appointments ?? 0),
      total_bills: Number(billSummary?.total_bills ?? 0),
      total_amount: Number(billSummary?.total_amount ?? 0),
      paid_bills: Number(billSummary?.paid_bills ?? 0),
      unpaid_bills: Number(billSummary?.unpaid_bills ?? 0),
      critical_patients: Number(criticalCount?.critical_patients ?? 0),
      gender_distribution: genderData,
      status_distribution: statusData,
      top_conditions: topConditions,
      appointments_by_doctor: appointmentsByDoctor,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: err.message });
  }
});
