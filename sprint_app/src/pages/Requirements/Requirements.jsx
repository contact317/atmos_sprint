import React, { useEffect, useState } from "react";
import { getRequirementList } from "../../api/requirementApi";
import RequirementCreate from "./RequirementCreate";
import RequirementUpdate from "./RequirementUpdate";
import "./Requirements.css";

import { HiOutlineEye, HiOutlinePencilAlt } from "react-icons/hi";

export default function Requirements() {
  const [requirements, setRequirements] = useState([]);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    const data = await getRequirementList();
    const arr = data ? Object.values(data) : [];
    // Sort newest first (by createdAt)
    arr.sort((a, b) => {
      const da = new Date(a.createdAt || 0);
      const db = new Date(b.createdAt || 0);
      return db - da;
    });
    setRequirements(arr);
  };

  const total = requirements.length;
  const inProgress = requirements.filter((r) => r.status === "In Progress").length;
  const completed = requirements.filter((r) => r.status === "Completed").length;
  const today = new Date();
  const delayed = requirements.filter(
    (r) =>
      r.due_date &&
      new Date(r.due_date) < today &&
      r.status !== "Completed"
  ).length;

  const filtered = requirements.filter((r) =>
    (r.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const getStatusClass = (status) => {
    if (!status) return "status-pill gray";
    const s = String(status).toLowerCase();
    if (s.includes("completed")) return "status-pill green";
    if (s.includes("progress")) return "status-pill blue";
    if (s.includes("pending") || s.includes("not")) return "status-pill yellow";
    return "status-pill red";
  };

  return (
    <div className="page-content-inner">
      {/* CARDS */}
      <div className="lux-cards">
        {[
          { title: "Total Requirements", value: total },
          { title: "In Progress", value: inProgress },
          { title: "Completed", value: completed },
          { title: "Delayed", value: delayed }
        ].map((c, idx) => (
          <div className="lux-card" key={idx}>
            <div className="lux-card-title">{c.title}</div>
            <div className="lux-card-value">{c.value}</div>
          </div>
        ))}
      </div>

      {/* SEARCH + CREATE */}
      <div className="lux-search-row">
        <input
          type="text"
          placeholder="Search requirements..."
          className="lux-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="lux-primary-btn"
          onClick={() => setOpenCreate(true)}
        >
          + Create Requirement
        </button>
      </div>

      <div className="lux-table-title">All Requirements</div>

      {/* TABLE */}
      <div className="lux-table-wrapper">
        <table className="lux-table">
          <thead>
            <tr>
              <th style={{ minWidth: 160 }}>Title</th>
              <th style={{ minWidth: 200 }}>Purpose</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created Date</th>
              <th style={{ width: 72, textAlign: "center" }}>View</th>
              <th style={{ width: 72, textAlign: "center" }}>Edit</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">No requirements found</td>
              </tr>
            ) : (
              filtered.map((r, index) => (
                <tr key={r.id || index}>
                  <td className="col-title">{r.title || "-"}</td>
                  <td>{r.purpose ? (r.purpose.length > 60 ? r.purpose.slice(0,60) + "..." : r.purpose) : "-"}</td>
                  <td>{r.department || "-"}</td>
                  <td>
                    <span className={`priority-badge ${String(r.priority || "").toLowerCase()}`}>
                      {r.priority || "-"}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusClass(r.status)}>
                      {r.status || "-"}
                    </span>
                  </td>
                  <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="icon-btn view-btn"
                      onClick={() => {
                        setSelectedIndex(index);
                        // open view — reuse create for now or add view later
                        setOpenUpdate(false);
                        setOpenCreate(false);
                        // small quick view open: open update in read-only
                        setOpenUpdate(true);
                      }}
                    >
                      <HiOutlineEye />
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="icon-btn update-btn"
                      onClick={() => {
                        setSelectedIndex(index);
                        setOpenUpdate(true);
                      }}
                    >
                      <HiOutlinePencilAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE DRAWER */}
      {openCreate && (
        <RequirementCreate
          onClose={async (saved) => {
            setOpenCreate(false);
            if (saved) await loadRequirements();
          }}
        />
      )}

      {/* UPDATE DRAWER */}
      {openUpdate && selectedIndex !== null && (
        <RequirementUpdate
          data={requirements[selectedIndex]}
          onClose={async (saved) => {
            setOpenUpdate(false);
            setSelectedIndex(null);
            if (saved) await loadRequirements();
          }}
        />
      )}
    </div>
  );
}
