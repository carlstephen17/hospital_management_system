import React, { useState, useEffect } from "react";
import { URL } from "../../API";
import { modalStyles as ms } from "../../components/SideBar";

function Field({
  label,
  hint,
  children,
}) {
  return (
    <div style={ms.formGroup}>
      <label style={ms.label}>
        {label}

        {(
          <span
            style={{
              color: "#ef4444",
              marginLeft: "2px",
            }}
          >
            *
          </span>
        )}
      </label>

      {children}

      {hint && (
        <span
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            marginTop: "2px",
            display: "block",
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

export default function EditBillModal({
  bill,
  onClose,
  onSaved,
}) {
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patient_id: bill?.patient_id || "",

    treatment_id: bill?.treatment_id || "",

    amount: bill?.amount || "",

    // FIX DATE FORMAT
    bill_date: bill?.bill_date
      ? bill.bill_date.split("T")[0]
      : "",

    status: bill?.status || "Unpaid",
  });

  // LOAD DATA
  useEffect(() => {
    // LOAD PATIENTS
    fetch(`${URL}/api/patients`)
      .then((r) => {
        if (!r.ok) {
          throw new Error(
            "Failed to load patients"
          );
        }

        return r.json();
      })
      .then((d) => {
        setPatients(
          Array.isArray(d) ? d : []
        );
      })
      .catch((err) => {
        console.error(err);
      });

    // LOAD TREATMENTS
    fetch(`${URL}/api/treatments`)
      .then((r) => {
        if (!r.ok) {
          throw new Error(
            "Failed to load treatments"
          );
        }

        return r.json();
      })
      .then((d) => {
        setTreatments(
          Array.isArray(d) ? d : []
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const selectedTreatment = treatments.find(
    (t) => String(t.treatment_id) === String(form.treatment_id)
  );

  const treatmentCost = selectedTreatment?.cost ?? "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    // AUTO-FILL AMOUNT
    if (name === "treatment_id") {
      const selectedTreatment =
        treatments.find(
          (t) =>
            String(t.treatment_id) ===
            String(value)
        );

      setForm((prev) => ({
        ...prev,

        treatment_id: value,

        amount:
          selectedTreatment?.cost ||
          prev.amount,
      }));

      return;
    }

    // NORMAL INPUTS
    setForm((prev) => ({  
      ...prev,
      [name]: value,
    }));
  };

  // SAVE BILL
  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      // CLEAN PAYLOAD
      const payload = {
        patient_id: Number(
          form.patient_id
        ),

        treatment_id:
          form.treatment_id
            ? Number(
                form.treatment_id
              )
            : null,

        amount: Number(form.amount),

        bill_date: form.bill_date,

        status: form.status,
      };

      console.log(
        "Sending payload:",
        payload
      );

      const res = await fetch(
        `${URL}/api/bills/${bill.bill_id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      // HANDLE SERVER ERRORS
      if (!res.ok) {
        let msg =
          "Failed to update bill.";

        try {
          const errData =
            await res.json();

          console.error(
            "SERVER ERROR:",
            errData
          );

          msg =
            errData.message || msg;
        } catch (_) {}

        throw new Error(msg);
      }

      const data = await res.json();

      console.log(
        "SUCCESS:",
        data
      );

      onSaved();
    } catch (err) {
      console.error(
        "SAVE ERROR:",
        err
      );

      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={ms.overlay}
      onClick={(e) =>
        e.target === e.currentTarget &&
        onClose()
      }
    >
      <div style={ms.modal}>
        {/* HEADER */}
        <div style={ms.header}>
          <span style={ms.title}>
            Edit Bill
          </span>

          <button
            style={ms.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div style={ms.body}>
          {error && (
            <div style={ms.errBox}>
              ⚠ {error}
            </div>
          )}

          {/* PATIENT */}
          <Field
            label="Patient"
            hint="Only registered patients appear here"
          >
            <select
              style={ms.select}
              name="patient_id"
              value={form.patient_id}
              onChange={handleChange}
            >
              <option value="">
                — Select a patient —
              </option>

              {patients.map((p) => (
                <option
                  key={p.patient_id}
                  value={p.patient_id}
                >
                  {p.patient_id} ·{" "}
                  {p.patient_name}
                </option>
              ))}
            </select>
          </Field>

          {/* TREATMENT */}
          <Field
            label="Treatment"
            hint="Selecting a treatment auto-fills the amount"
          >
            <select
              style={ms.select}
              name="treatment_id"
              value={form.treatment_id}
              onChange={handleChange}
            >
              <option value="">
                — Select a treatment
                (optional) —
              </option>

              {treatments.map((t) => (
                <option
                  key={t.treatment_id}
                  value={t.treatment_id}
                >
                  {t.treatment_name}

                  {t.cost
                    ? ` — ₱${Number(
                        t.cost
                      ).toLocaleString()}`
                    : ""}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Treatment Cost (₱)">
            <input
              style={ms.input}
              type="text"
              value={treatmentCost !== "" ? treatmentCost : ""}
              disabled
              placeholder="No treatment selected"
            />
          </Field>

          {/* AMOUNT + DATE */}
          <div style={ms.grid2}>
            <Field
              label="Amount (₱)"
            >
              <input
                style={ms.input}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                name="amount"
                value={form.amount}
                onChange={handleChange}
              />
            </Field>

            <Field
              label="Bill Date"
            >
              <input
                style={ms.input}
                type="date"
                name="bill_date"
                value={form.bill_date}
                onChange={handleChange}
              />
            </Field>
          </div>

          {/* STATUS */}
          <Field
            label="Status"
          >
            <select
              style={ms.select}
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Unpaid">
                Unpaid
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Pending">
                Pending
              </option>
            </select>
          </Field>
        </div>

        {/* FOOTER */}
        <div style={ms.footer}>
          <button
            style={ms.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            style={{
              ...ms.saveBtn,

              opacity: saving ? 0.7 : 1,

              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}