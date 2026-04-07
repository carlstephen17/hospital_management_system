import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

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
  host: "localhost",
  user: "root",
  password: "@mxmxyzptlk3",
  database: "hospital_management_system"
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// ------------------ HELPER: PROMISE QUERY ------------------ //
const query = (sql, params = []) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) reject(err);
    else resolve(results);
  });
});

// ------------------ PATIENT CRUD ------------------ //
app.get('/api/patients', async (req, res) => {
  try {
    const results = await query('SELECT * FROM patients');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await query('SELECT * FROM patients WHERE patient_id = ?', [id]);
    if (!results.length) return res.status(404).json({ message: 'Patient not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/patients', async (req, res) => {
  const { patient_name, phone, gender, address, condition, status } = req.body;
  try {
    const result = await query(
      'INSERT INTO patients (patient_name, phone, gender, address, `condition`, `status`) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_name, phone, gender, address, condition, status]
    );
    res.status(201).json({ patient_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { patient_name, phone, gender, address, condition, status } = req.body;
  try {
    await query(
      'UPDATE patients SET patient_name = ?, phone = ?, gender = ?, address = ?, `condition` = ?, `status` = ? WHERE patient_id = ?',
      [patient_name, phone, gender, address, condition, status, id]
    );
    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// DELETE SINGLE PATIENT WITH RELATIONSHIPS
app.delete('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM patient_treatments WHERE patient_id = ?', [id]);
    await query('DELETE FROM appointments WHERE patient_id = ?', [id]);
    await query('DELETE FROM bills WHERE patient_id = ?', [id]);
    await query('DELETE FROM patients WHERE patient_id = ?', [id]);
    res.json({ message: 'Patient and related records deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// DELETE ALL PATIENTS
app.delete('/api/deleteAll', async (req, res) => {
  try {
    await query('DELETE FROM patient_treatments');
    await query('DELETE FROM appointments');
    await query('DELETE FROM bills');
    await query('DELETE FROM patients');
    res.json({ message: 'All patients and related records deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ------------------ DOCTOR CRUD ------------------ //
app.get('/api/doctors', async (req, res) => {
  try {
    const results = await query('SELECT * FROM doctors');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await query('SELECT * FROM doctors WHERE doctor_id = ?', [id]);
    if (!results.length) return res.status(404).json({ message: 'Doctor not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/doctors', async (req, res) => {
  const { doctor_name, doctor_specialty } = req.body;
  try {
    const result = await query('INSERT INTO doctors (doctor_name, doctor_specialty) VALUES (?, ?)', [doctor_name, doctor_specialty]);
    res.status(201).json({ doctor_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.put('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  const { doctor_name, doctor_specialty } = req.body;
  try {
    await query('UPDATE doctors SET doctor_name = ?, doctor_specialty = ? WHERE doctor_id = ?', [doctor_name, doctor_specialty, id]);
    res.json({ message: 'Doctor updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.delete('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM doctors WHERE doctor_id = ?', [id]);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ------------------ DEPARTMENT CRUD ------------------ //
app.get('/api/departments', async (req, res) => {
  try {
    const results = await query('SELECT * FROM departments');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/departments', async (req, res) => {
  const { department_name } = req.body;
  try {
    const result = await query('INSERT INTO departments (department_name) VALUES (?)', [department_name]);
    res.status(201).json({ department_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  const { id } = req.params;
  const { department_name } = req.body;
  try {
    await query('UPDATE departments SET department_name = ? WHERE department_id = ?', [department_name, id]);
    res.json({ message: 'Department updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM departments WHERE department_id = ?', [id]);
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ------------------ DOCTOR_DEPARTMENT CRUD ------------------ //
app.get('/api/doctor_department', async (req, res) => {
  try {
    const results = await query('SELECT * FROM doctor_department');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/doctor_department', async (req, res) => {
  const { doctor_id, department_id } = req.body;
  try {
    const result = await query('INSERT INTO doctor_department (doctor_id, department_id) VALUES (?, ?)', [doctor_id, department_id]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.put('/api/doctor_department/:id', async (req, res) => {
  const { id } = req.params;
  const { doctor_id, department_id } = req.body;
  try {
    await query('UPDATE doctor_department SET doctor_id = ?, department_id = ? WHERE id = ?', [doctor_id, department_id, id]);
    res.json({ message: 'Doctor-Department updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.delete('/api/doctor_department/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM doctor_department WHERE id = ?', [id]);
    res.json({ message: 'Doctor-Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ------------------ TREATMENTS CRUD ------------------ //
app.get('/api/treatments', async (req, res) => {
  try {
    const results = await query('SELECT * FROM treatments');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/treatments', async (req, res) => {
  const { treatment_name, cost } = req.body;
  try {
    const result = await query('INSERT INTO treatments (treatment_name, cost) VALUES (?, ?)', [treatment_name, cost]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.put('/api/treatments/:id', async (req, res) => {
  const { id } = req.params;
  const { treatment_name, cost } = req.body;
  try {
    await query('UPDATE treatments SET treatment_name = ?, cost = ? WHERE treatment_id = ?', [treatment_name, cost, id]);
    res.json({ message: 'Treatment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.delete('/api/treatments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM treatments WHERE treatment_id = ?', [id]);
    res.json({ message: 'Treatment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ------------------ PATIENT_TREATMENTS CRUD ------------------ //
app.get('/api/patient_treatments', async (req, res) => {
  try {
    const results = await query('SELECT * FROM patient_treatments');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/patient_treatments', async (req, res) => {
  const { patient_id, treatment_id, date_given } = req.body;
  try {
    const result = await query('INSERT INTO patient_treatments (patient_id, treatment_id, date_given) VALUES (?, ?, ?)', [patient_id, treatment_id, date_given]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.put('/api/patient_treatments/:id', async (req, res) => {
  const { id } = req.params;
  const { patient_id, treatment_id, date_given } = req.body;
  try {
    await query('UPDATE patient_treatments SET patient_id = ?, treatment_id = ?, date_given = ? WHERE id = ?', [patient_id, treatment_id, date_given, id]);
    res.json({ message: 'Patient-Treatment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.delete('/api/patient_treatments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM patient_treatments WHERE id = ?', [id]);
    res.json({ message: 'Patient-Treatment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ------------------ APPOINTMENTS CRUD ------------------ //
app.get('/api/appointments', async (req, res) => {
  try {
    const results = await query('SELECT * FROM appointments');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { patient_id, doctor_id, appointment_date } = req.body;
  try {
    const result = await query('INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)', [patient_id, doctor_id, appointment_date]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, appointment_date } = req.body;
  try {
    await query('UPDATE appointments SET patient_id = ?, doctor_id = ?, appointment_date = ? WHERE appointment_id = ?', [patient_id, doctor_id, appointment_date, id]);
    res.json({ message: 'Appointment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM appointments WHERE appointment_id = ?', [id]);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ------------------ BILLS CRUD ------------------ //
app.get('/api/bills', async (req, res) => {
  try {
    const results = await query('SELECT * FROM bills');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/bills', async (req, res) => {
  const { patient_id, amount, bill_date, status } = req.body;
  try {
    const billStatus = status || 'unpaid';
    const result = await query('INSERT INTO bills (patient_id, amount, bill_date, status) VALUES (?, ?, ?, ?)', [patient_id, amount, bill_date, billStatus]);
    res.status(201).json({ id: result.insertId, patient_id, amount, bill_date, status: billStatus });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.put('/api/bills/:id', async (req, res) => {
  const { id } = req.params;
  const { patient_id, amount, bill_date, status } = req.body;
  try {
    await query('UPDATE bills SET patient_id = ?, amount = ?, bill_date = ?, status = ? WHERE bill_id = ?', [patient_id, amount, bill_date, status, id]);
    res.json({ message: 'Bill updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.delete('/api/bills/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM bills WHERE bill_id = ?', [id]);
    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});