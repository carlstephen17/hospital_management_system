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
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

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
  const { patient_name, phone, gender, address, condition, status } = req.body;
  db.query(
    "INSERT INTO patients (patient_name, phone, gender, address, `condition`, `status`) VALUES (?, ?, ?, ?, ?, ?)",
    [patient_name, phone, gender, address, condition, status],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ patient_id: result.insertId });
    },
  );
});

app.put("/api/patients/:id", (req, res) => {
  const { id } = req.params;
  const { patient_name, phone, gender, address, condition, status } = req.body;
  db.query(
    "UPDATE patients SET patient_name = ?, phone = ?, gender = ?, address = ?, `condition` = ?, `status` = ? WHERE patient_id = ?",
    [patient_name, phone, gender, address, condition, status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Patient updated successfully" });
    },
  );
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
  db.query("DELETE FROM patient_treatments", (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("DELETE FROM appointments", (err) => {
      if (err) return res.status(500).json({ error: err.message });
      db.query("DELETE FROM bills", (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query("DELETE FROM patients", (err) => {
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
  const { doctor_name, doctor_specialty } = req.body;
  db.query(
    "INSERT INTO doctors (doctor_name, doctor_specialty) VALUES (?, ?)",
    [doctor_name, doctor_specialty],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ doctor_id: result.insertId });
    },
  );
});

app.put("/api/doctors/:id", (req, res) => {
  const { id } = req.params;
  const { doctor_name, doctor_specialty } = req.body;
  db.query(
    "UPDATE doctors SET doctor_name = ?, doctor_specialty = ? WHERE doctor_id = ?",
    [doctor_name, doctor_specialty, id],
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
  const { patient_id, doctor_id, appointment_date } = req.body;
  db.query(
    "INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)",
    [patient_id, doctor_id, appointment_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    },
  );
});

app.put("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, appointment_date } = req.body;
  db.query(
    "UPDATE appointments SET patient_id = ?, doctor_id = ?, appointment_date = ? WHERE appointment_id = ?",
    [patient_id, doctor_id, appointment_date, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Appointment updated successfully" });
    },
  );
});

app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM appointments WHERE appointment_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Appointment deleted successfully" });
  });
});

// ------------------ BILLS CRUD ------------------ //
app.get("/api/bills", (req, res) => {
  db.query("SELECT * FROM bills", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/bills", (req, res) => {
  const { patient_id, amount, bill_date, status } = req.body;
  const billStatus = status || "unpaid";
  db.query(
    "INSERT INTO bills (patient_id, amount, bill_date, status) VALUES (?, ?, ?, ?)",
    [patient_id, amount, bill_date, billStatus],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: result.insertId,
        patient_id,
        amount,
        bill_date,
        status: billStatus,
      });
    },
  );
});

app.put("/api/bills/:id", (req, res) => {
  const { id } = req.params;
  const { patient_id, amount, bill_date, status } = req.body;
  db.query(
    "UPDATE bills SET patient_id = ?, amount = ?, bill_date = ?, status = ? WHERE bill_id = ?",
    [patient_id, amount, bill_date, status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Bill updated successfully" });
    },
  );
});

app.delete("/api/bills/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM bills WHERE bill_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Bill deleted successfully" });
  });
});

// ------------------ REPORTS (Cartesian, UNION, DIFFERENCE) ------------------ //
app.get("/api/reports/cartesian", (req, res) => {
  db.query(
    `
    SELECT d.doctor_name, p.patient_name, p.condition 
    FROM doctors d, patients p, appointments a 
    WHERE d.doctor_id = a.doctor_id 
      AND p.patient_id = a.patient_id
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
