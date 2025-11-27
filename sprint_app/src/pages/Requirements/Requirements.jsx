import React, { useEffect, useState } from "react";
import { getRequirementList } from "../../api/requirementApi";
import RequirementCreate from "./RequirementCreate";
import RequirementUpdate from "./RequirementUpdate";
import RequirementView from "./RequirementView";
import "./Requirements.css";

import { Eye, Pencil } from "lucide-react";

export default function Requirements() {
  const [requirements, setRequirements] = useState([]);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      const data = await getRequirementList();
      const arr = data ? Object.entries(data).map(([key, val]) => ({ id: key, ...val })) : [];
      // sort newest first for list
      arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setRequirements(arr);
    } catch (err) {
      console.error("Failed to load requirements", err);
      setRequirements([]);
    }
  };

  const total = requirements.length;
  const inProgress = requirements.filter((r) => String(r.status || "").toLowerCase().includes("progress")).length;
  const pending = requirements.filter((r) => String(r.status || "").toLowerCase().includes("pending")).length;
  const highPriority = requirements.filter((r) => String(r.priority || "").toLowerCase() === "high").length;

  const filtered = requirements.filter((r) =>
    ((r.title || "") + " " + (r.purpose || "") + " " + (r.department || "") + " " + (r.priority || "") + " " + (r.status || ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getStatusClass = (status) => {
    if (!status) return "status-pill gray";
    const s = String(status).toLowerCase();
    if (s.includes("completed")) return "status-pill green";
    if (s.includes("progress")) return "status-pill blue";
    if (s.includes("pending") || s.includes("to do") || s.includes("not")) return "status-pill yellow";
    return "status-pill red";
  };

  return (
    <div className="page-content-inner">
      <div className="lux-cards">
        <div className="lux-card">
          <div className="lux-card-title">Total Requirements</div>
          <div className="lux-card-value">{total}</div>
        </div>

        <div className="lux-card">
          <div className="lux-card-title">In Progress</div>
          <div className="lux-card-value">{inProgress}</div>
        </div>

        <div className="lux-card">
          <div className="lux-card-title">Pending Review</div>
          <div className="lux-card-value">{pending}</div>
        </div>

        <div className="lux-card">
          <div className="lux-card-title">High Priority</div>
          <div className="lux-card-value">{highPriority}</div>
        </div>
      </div>

      <div className="lux-search-row">
        <input
          className="lux-search-input"
          placeholder="Search requirements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="lux-primary-btn" onClick={() => setOpenCreate(true)}>
          + Create Requirement
        </button>
      </div>

      <div className="lux-table-title">Requirements</div>

      <div className="lux-table-wrapper">
        <table className="lux-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Purpose</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th style={{ width: 70, textAlign: "center" }}>View</th>
              <th style={{ width: 70, textAlign: "center" }}>Edit</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">No requirements</td>
              </tr>
            ) : (
              filtered.map((r, idx) => (
                <tr key={r.id || idx}>
                  <td className="col-title">{r.title || "-"}</td>
                  <td>{r.purpose ? (r.purpose.length > 80 ? r.purpose.slice(0, 80) + "..." : r.purpose) : "-"}</td>
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
                      className="icon-btn"
                      title="View"
                      onClick={() => {
                        setSelectedRequirement(r);
                        setOpenView(true);
                      }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="icon-btn"
                      title="Edit"
                      onClick={() => {
                        setSelectedRequirement(r);
                        setOpenUpdate(true);
                      }}
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openCreate && (
        <RequirementCreate
          onClose={async (saved) => {
            setOpenCreate(false);
            if (saved) await loadRequirements();
          }}
        />
      )}

      {openView && selectedRequirement && (
        <RequirementView
          data={selectedRequirement}
          onClose={() => {
            setOpenView(false);
            setSelectedRequirement(null);
          }}
        />
      )}

      {openUpdate && selectedRequirement && (
        <RequirementUpdate
          keyProp={selectedRequirement.id}
          data={selectedRequirement}
          onClose={async (saved) => {
            setOpenUpdate(false);
            setSelectedRequirement(null);
            if (saved) await loadRequirements();
          }}
        />
      )}
    </div>
  );
}
