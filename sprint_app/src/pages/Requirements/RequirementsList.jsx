import React, { useEffect, useState } from "react";
import { getRequirementList, addRequirement } from "../../api/requirementApi";
import RequirementCreate from "./RequirementCreate";
import "./Requirements.css"; // you can copy SprintList.css or tweak
import { HiOutlineEye, HiOutlinePencilAlt } from "react-icons/hi";

export default function RequirementsList() {
  const [requirements, setRequirements] = useState([]);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [openView, setOpenView] = useState(false);

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    const data = await getRequirementList();
    const arr = data ? Object.values(data) : [];
    // newest first (same as sprints)
    arr.sort((a,b) => {
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
  const delayed = requirements.filter((r) => r.due_date && new Date(r.due_date) < today && r.status !== "Completed").length;

  const filtered = requirements.filter((r) =>
    (r.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content-inner">
      {/* Cards (same as sprints) */}
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

      {/* Search + Create */}
      <div className="lux-search-row">
        <input
          type="text"
          placeholder="Search requirements..."
          className="lux-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="lux-primary-btn" onClick={() => setOpenCreate(true)}>
          + Create Requirement
        </button>
      </div>

      <div className="lux-table-title">All Requirements</div>

      {/* Table (same layout as sprints table) */}
      <div className="lux-table-wrapper">
        <table className="lux-table">
          <thead>
            <tr>
              <th style={{ minWidth: 200 }}>Title</th>
              <th>Purpose</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th style={{ width: 72, textAlign: "center" }}>View</th>
              <th style={{ width: 72, textAlign: "center" }}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No requirements found</td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r.id || i}>
                  <td className="col-title">{r.title || "-"}</td>
                  <td>{(r.purpose && (r.purpose.length > 40 ? r.purpose.slice(0,40) + "..." : r.purpose)) || "-"}</td>
                  <td>{r.department || "-"}</td>
                  <td>{r.priority || "-"}</td>
                  <td>{r.status || "-"}</td>
                  <td style={{ textAlign: "center" }}>
                    <button className="icon-btn view-btn" onClick={() => { setSelectedIndex(i); setOpenView(true); }}>
                      <HiOutlineEye />
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button className="icon-btn update-btn" onClick={() => { setSelectedIndex(i); setOpenCreate(true); }}>
                      <HiOutlinePencilAlt />
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
          data={requirements[selectedIndex]}
          onClose={async (saved) => {
            setOpenCreate(false);
            setSelectedIndex(null);
            if (saved) await loadRequirements();
          }}
        />
      )}

      {openView && selectedIndex !== null && (
        <div className="drawer-backdrop" onClick={() => setOpenView(false)}></div>
        /* You can implement a modal/view like SprintView - reuse code if you want */
      )}
    </div>
  );
}
