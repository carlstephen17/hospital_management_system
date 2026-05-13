# User Manual

## Project Overview
This Hospital Management System provides a working UI for managing patients, doctors, treatments, appointments, and bills. It also includes reports for SQL operations such as Cartesian product, UNION, and SET DIFFERENCE.

## Getting Started

### Prerequisites
- Node.js installed
- MySQL database configured
- `.env` in `backend/` with database connection values

### Installation
1. Open a terminal in the project root.
2. Install backend dependencies:
   ```bash
   npm install
   npm install --prefix backend
   ```
3. Install frontend dependencies:
   ```bash
   npm install --prefix frontend
   ```

### Running the App
From the project root:
```bash
npm run dev
```
This starts the backend API and frontend React app concurrently.

## Using the Application

### Navigation
Use the sidebar to navigate between pages:
- Home
- Patients
- Doctors
- Treatments
- Appointments
- Bills
- Reports

### Patients
- Create a patient with name, contact, gender, address, medical condition, blood type, and status.
- Edit a patient to update any patient details.
- View patient details in the read modal.
- Delete a patient and related records.

### Doctors
- Create a doctor with name, phone, specialty, department, and email.
- Edit doctor details.
- View doctor details.
- Delete a doctor.

### Treatments
- Create a treatment record with treatment name and cost.
- Edit treatment details.
- View treatment details.
- Delete a treatment.

### Appointments
- Create appointments linking patients with doctors and appointment dates.
- Edit appointment status and date.
- View appointment details.
- Delete appointments.

### Bills
- Create bills linked to patients and treatments.
- The system calculates the status automatically based on amount and treatment cost.
- Edit bills and see treatment cost displayed.
- View bill details.

### Reports
- Go to the Reports page.
- Click `Load Reports` to fetch:
  - Cartesian product report
  - UNION report
  - SET DIFFERENCE report
- The page presents the result tables for each report.

### Analytics Script
- The repository includes `analytics.py` at the project root.
- Install the Python dependencies first:
  ```bash
  pip install -r python_requirements.txt
  ```
- Run the analytics script with:
  ```bash
  python analytics.py
  ```
- To write a JSON export for dashboard integration:
  ```bash
  python analytics.py --output analytics_report.json
  ```
- The script computes statistics such as total patients, critical patients, gender distribution, patient statuses, top conditions, appointment counts, and bill summary.

## Notes
- The app uses a MySQL backend and a React/Vite frontend.
- If backend or frontend fails to start, verify the `.env` credentials and dependencies.
- The system implementation is the working application; this manual describes how to use it.