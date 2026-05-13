# Technical Documentation

## Project Structure

- `backend/`
  - `server.js` - Express API server with MySQL integration.
  - `package.json` - backend dependencies.
  - `.env` - database connection settings.
- `frontend/`
  - `src/` - React source files.
  - `components/` - shared components and Reports page.
  - `CRUD/` - create/read/update/delete modal components.
  - `package.json` - frontend dependencies.
- `requirements.txt` - project requirements and grading rubric.

## Architecture

### Backend
- Node.js + Express server.
- MySQL database using `mysql2`.
- REST endpoints for patients, doctors, treatments, appointments, bills, and reports.
- Python analytics helper using `mysql-connector-python` and `python-dotenv`.

### Frontend
- React with Vite.
- Pages for each entity and a report page.
- Uses `fetch` to call backend API routes.

## Database Tables
The system uses the following tables:
- `patients`
- `doctors`
- `treatments`
- `appointments`
- `bills`
- `patient_treatments`
- `deparments`
- `doctor_department`

## Report Queries and Relational Algebra

### Cartesian Product Report
**SQL**
```sql
SELECT d.doctor_name,
       p.patient_name,
       p.medical_condition AS medical_condition
FROM doctors d
JOIN appointments a ON d.doctor_id = a.doctor_id
JOIN patients p ON p.patient_id = a.patient_id;
```
**Relational Algebra**
1. `A := doctors ⋈_{doctors.doctor_id = appointments.doctor_id} appointments`
2. `B := A ⋈_{appointments.patient_id = patients.patient_id} patients`
3. `π_{doctor_name, patient_name, medical_condition}(B)`

### UNION Report
**SQL**
```sql
SELECT p.patient_id,
       p.patient_name,
       t.treatment_name
FROM patients p
JOIN patient_treatments pt ON p.patient_id = pt.patient_id
JOIN treatments t ON pt.treatment_id = t.treatment_id;
```
**Relational Algebra**
`π_{patient_id, patient_name, treatment_name}(patients ⋈_{patients.patient_id = patient_treatments.patient_id} patient_treatments ⋈_{patient_treatments.treatment_id = treatments.treatment_id} treatments)`

### SET DIFFERENCE Report
**SQL**
```sql
SELECT DISTINCT
  p.patient_id,
  p.patient_name,
  b.bill_id,
  COALESCE(b.status, 'No Bill') AS status,
  COALESCE(b.bill_date, 'Not Set') AS bill_date
FROM patients p
JOIN appointments a ON p.patient_id = a.patient_id
LEFT JOIN bills b ON p.patient_id = b.patient_id
WHERE b.patient_id IS NULL OR b.status = 'unpaid';
```
**Relational Algebra**
1. `A := patients ⋈_{patients.patient_id = appointments.patient_id} appointments`
2. `B := A ⋉_{patients.patient_id = bills.patient_id} bills`
3. `σ_{bills.patient_id = NULL ∨ bills.status = 'unpaid'}(B)`
4. `π_{patient_id, patient_name, status, bill_date}(...)`

## API Endpoints

### Patients
- `GET /api/patients`
- `GET /api/patients/:id`
- `POST /api/patients`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

### Doctors
- `GET /api/doctors`
- `GET /api/doctors/:id`
- `POST /api/doctors`
- `PUT /api/doctors/:id`
- `DELETE /api/doctors/:id`

### Treatments
- `GET /api/treatments`
- `GET /api/treatments/:id`
- `POST /api/treatments`
- `PUT /api/treatments/:id`
- `DELETE /api/treatments/:id`

### Appointments
- `GET /api/appointments`
- `GET /api/appointments/:id`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Bills
- `GET /api/bills`
- `GET /api/bills/:id`
- `POST /api/bills`
- `PUT /api/bills/:id`
- `DELETE /api/bills/:id`

### Reports
- `GET /api/reports/cartesian`
- `GET /api/reports/union`
- `GET /api/reports/difference`

## System Implementation Notes

- The frontend exposes CRUD operations for each major entity.
- The backend routes execute SQL queries and return JSON.
- The report page demonstrates advanced query output for Cartesian, UNION, and SET DIFFERENCE.
- The project includes a Python analytics helper script, `analytics.py`, which reads the backend `.env` values and generates summary statistics for dashboard use.

## Analytics Script

`analytics.py` provides:
- total patient count
- critical patient count
- gender distribution with percentages
- patient status distribution
- top medical conditions
- appointment counts and appointment distribution by doctor
- bill summary (total amount, paid/unpaid counts)

Usage:
```bash
python analytics.py --output analytics_report.json
```

## Outstanding Deliverables

The codebase currently provides the working system implementation. To fully satisfy the deliverables, add:
- ER diagram file
- formal database schema document
- presentation slides or notes
- additional relational algebra examples for selection, projection, AND/OR/NOT queries
