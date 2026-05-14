import React, { useState, useEffect } from "react";
import { URL } from "../API";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarStyles, navItems } from "../components/sideBar";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import CreateBillModal from "../CRUD/CRUD_Bills/CreateBillModal";
import ReadBillModal from "../CRUD/CRUD_Bills/ReadBillModal";
import EditBillModal from "../CRUD/CRUD_Bills/EditBillModal";

function Bills() {
  const [bills, setBills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [sortBy, setSortBy] = useState("bill_id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showAdd, setShowAdd] = useState(false);
  const [readBill, setReadBill] = useState(null);
  const [editBill, setEditBill] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    try {
      setLoading(true);

      const res = await fetch(`${URL}/api/bills`);
      const data = await res.json();

      setBills(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  async function deleteBill(id) {
    if (!window.confirm("Delete this bill?")) return;

    await fetch(`${URL}/api/bills/${id}`, {
      method: "DELETE",
    });

    fetchBills();
  }

  async function deleteSelected() {
    if (
      !selected.size ||
      !window.confirm(`Delete ${selected.size} bill(s)?`)
    )
      return;

    await Promise.all(
      [...selected].map((id) =>
        fetch(`${URL}/api/bills/${id}`, {
          method: "DELETE",
        }),
      ),
    );

    setSelected(new Set());
    fetchBills();
  }

  async function deleteAll() {
    if (!bills.length || !window.confirm("Delete ALL bills?")) return;

    await Promise.all(
      bills.map((b) =>
        fetch(`${URL}/api/bills/${b.bill_id}`, {
          method: "DELETE",
        }),
      ),
    );

    setSelected(new Set());
    fetchBills();
  }

  function toggleRow(id) {
    setSelected((prev) => {
      const s = new Set(prev);

      s.has(id) ? s.delete(id) : s.add(id);

      return s;
    });
  }

  function toggleAll(e) {
    setSelected(
      e.target.checked
        ? new Set(sorted.map((b) => b.bill_id))
        : new Set(),
    );
  }

  const filtered = bills.filter((b) =>
    [b.patient_id, b.amount, b.status, b.bill_date]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === "bill_id") {
      aVal = a.bill_id;
      bVal = b.bill_id;
    } else if (sortBy === "amount") {
      aVal = parseFloat(a.amount);
      bVal = parseFloat(b.amount);
    }
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const TH = {
    padding: "14px 18px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    whiteSpace: "nowrap",
  };

  const TD = {
    padding: "14px 18px",
    fontSize: "13px",
    color: "#334155",
    borderBottom: "1px solid #e2e8f0",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <aside style={sidebarStyles.sidebar}>
        <div style={sidebarStyles.sidebarBrand}>
          <div style={sidebarStyles.brandIcon}>H+</div>

          <div>
            <p style={sidebarStyles.brandName}>MediCare</p>
            <p style={sidebarStyles.brandSub}>Hospital System</p>
          </div>
        </div>

        <nav style={sidebarStyles.navSection}>
          <span style={sidebarStyles.navLabel}>Main Menu</span>

          {navItems.map((item) => (
            <button
              key={item.label}
              style={{
                ...sidebarStyles.navBtn,
                ...(location.pathname === item.path
                  ? sidebarStyles.navBtnActive
                  : {}),
              }}
              onClick={() => navigate(item.path)}
            >
              <span style={sidebarStyles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={sidebarStyles.sidebarFooter}>
          <p style={sidebarStyles.footerText}>
            Hospital Management
            <br />
            System v1.0
          </p>
        </div>
      </aside>

      <main
        style={{
          marginLeft: "220px",
          padding: "32px 28px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              margin: "0 0 4px",
              fontSize: "24px",
              fontWeight: "700",
              color: "#0f172a",
            }}
          >
            Bills
          </h1>

          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            Manage all registered bills
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "280px",
              maxWidth: "420px",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              🔍
            </span>

            <input
              type="text"
              placeholder="Search bills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 36px",
                border: "1px solid #dbe2ea",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={deleteAll}
              disabled={!bills.length}
              style={{
                padding: "9px 14px",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                background: "#fff",
                color: "#ef4444",
                fontSize: "13px",
                fontWeight: "600",
                cursor: bills.length ? "pointer" : "not-allowed",
                opacity: bills.length ? 1 : 0.5,
              }}
            >
              🗑 Delete All
            </button>

            <button
              onClick={() => setShowAdd(true)}
              style={{
                padding: "9px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              ＋ Add Bill
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            width: "100%",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#0f172a",
              }}
            >
              All Bills
            </span>

            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {sorted.length} record
              {filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {selected.size > 0 && (
            <div
              style={{
                padding: "12px 20px",
                background: "#eff6ff",
                borderBottom: "1px solid #bfdbfe",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "#1e40af",
                  fontWeight: "500",
                }}
              >
                {selected.size} selected
              </span>

              <button
                onClick={deleteSelected}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #fecaca",
                  background: "#fff",
                  color: "#ef4444",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Delete Selected
              </button>
            </div>
          )}

          {loading ? (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Loading...
            </div>
          ) : (
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        ...TH,
                        width: "60px",
                        textAlign: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        onChange={toggleAll}
                        checked={
                          filtered.length > 0 &&
                          sorted.every((b) =>
                            selected.has(b.bill_id),
                          )
                        }
                        style={{
                          cursor: "pointer",
                          accentColor: "#2563eb",
                        }}
                      />
                    </th>

                    <th
                      style={{ ...TH, width: "80px", cursor: "pointer" }}
                      onClick={() => {
                        if (sortBy === "bill_id") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("bill_id");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      ID {sortBy === "bill_id" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th style={{ ...TH, width: "18%" }}>
                      Patient ID
                    </th>
                    <th
                      style={{ ...TH, width: "18%", cursor: "pointer" }}
                      onClick={() => {
                        if (sortBy === "amount") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("amount");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th style={{ ...TH, width: "12%" }}>
                      Status
                    </th>
                    <th style={{ ...TH, width: "22%" }}>
                      Bill Date
                    </th>
                    <th style={{ ...TH, width: "18%" }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sorted.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: "40px",
                          textAlign: "center",
                          color: "#94a3b8",
                        }}
                      >
                        No bills found.
                      </td>
                    </tr>
                  ) : (
                    sorted.map((b) => (
                      <tr
                        key={b.bill_id}
                        style={{
                          background: selected.has(b.bill_id)
                            ? "#f8fbff"
                            : "#fff",
                        }}
                      >
                        <td
                          style={{
                            ...TD,
                            textAlign: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selected.has(b.bill_id)}
                            onChange={() =>
                              toggleRow(b.bill_id)
                            }
                            style={{
                              cursor: "pointer",
                              accentColor: "#2563eb",
                            }}
                          />
                        </td>

                        <td
                          style={{
                            ...TD,
                            fontWeight: "600",
                            color: "#64748b",
                          }}
                        >
                          {b.bill_id}
                        </td>

                        <td
                          style={{
                            ...TD,
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          {b.patient_id}
                        </td>

                        <td style={TD}>{b.amount}</td>

                        <td style={TD}>{b.status}</td>

                        <td style={TD}>{b.bill_date}</td>

                        <td style={TD}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              flexWrap: "nowrap",
                            }}
                          >
                            <button
                              onClick={() => setReadBill(b)}
                              style={{
                                padding: "7px 12px",
                                borderRadius: "7px",
                                border: "1px solid #dbe2ea",
                                background: "#fff",
                                color: "#3b82f6",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FaEye /> View
                            </button>

                            <button
                              onClick={() => setEditBill(b)}
                              style={{
                                padding: "7px 12px",
                                borderRadius: "7px",
                                border: "1px solid #bfdbfe",
                                background: "#eff6ff",
                                color: "#14b8a6",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FaPen /> Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteBill(b.bill_id)
                              }
                              style={{
                                padding: "7px 12px",
                                borderRadius: "7px",
                                border: "1px solid #fecaca",
                                background: "#fef2f2",
                                color: "#ef4444",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showAdd && (
        <CreateBillModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            fetchBills();
          }}
        />
      )}

      {readBill && (
        <ReadBillModal
          bill={readBill}
          onClose={() => setReadBill(null)}
          onEdit={() => {
            setEditBill(readBill);
            setReadBill(null);
          }}
        />
      )}

      {editBill && (
        <EditBillModal
          bill={editBill}
          onClose={() => setEditBill(null)}
          onSaved={() => {
            setEditBill(null);
            fetchBills();
          }}
        />
      )}
    </div>
  );
}

export default Bills;