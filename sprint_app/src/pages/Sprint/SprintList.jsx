import React, { useEffect, useState } from "react";
import { getSprintList } from "../../api/sprintApi";
import "./SprintList.css";

import { Eye, Pencil } from "lucide-react";

import SprintCreate from "./SprintCreate";
import SprintUpdate from "./SprintUpdate";
import SprintView from "./SprintView";

export default function SprintList() {
  const [sprints, setSprints] = useState([]);
  const [search, setSearch] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selectedSprint, setSelectedSprint] = useState(null);

  // Logged user
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const isEmployee = authUser?.role === "employee";
  const loggedEmp = authUser?.empid;

  useEffect(() => {
    loadSprints();
  }, []);

  const loadSprints = async () => {
    const data = await getSprintList();

    // ⭐ FIXED: Preserve Firebase key
    let sprintArray = data
      ? Object.entries(data).map(([key, val]) => ({ key, ...val }))
      : [];

    // employee-only
    if (isEmployee) {
      sprintArray = sprintArray.filter(
        (sp) =>
          String(sp.assigned_to || sp.assignedTo) === String(loggedEmp)
      );
    }

    // sort newest first
    sprintArray.sort((a, b) => {
      const da = new Date(a.start_date || a.createdAt || 0);
      const db = new Date(b.start_date || b.createdAt || 0);
      return db - da;
    });

    setSprints(sprintArray);
  };

  const total = sprints.length;
  const inProgress = sprints.filter((s) => s.status === "In Progress").length;
  const completed = sprints.filter((s) => s.status === "Completed").length;

  const today = new Date();
  const delayed = sprints.filter(
    (s) =>
      s.due_date &&
      new Date(s.due_date) < today &&
      s.status !== "Completed"
  ).length;

  const filtered = sprints.filter((sp) =>
    sp.title?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusClass = (status) => {
    if (!status) return "status-pill gray";
    const st = status.toLowerCase();

    if (st.includes("completed")) return "status-pill green";
    if (st.includes("progress")) return "status-pill blue";
    if (st.includes("pending") || st.includes("not")) return "status-pill yellow";
    return "status-pill red";
  };

  return (
  <>
    {/* MAIN PAGE LAYOUT */}
    <div className="page-content-inner">

      {/* CARDS */}
      <div className="lux-cards">
        {[ 
          { title: "Total Sprints", value: total },
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
          placeholder="Search sprints..."
          className="lux-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {!isEmployee && (
          <button className="lux-primary-btn" onClick={() => setOpenCreate(true)}>
            + Create Sprint
          </button>
        )}
      </div>

      <div className="lux-table-title">
        {isEmployee ? "My Sprints" : "All Sprints"}
      </div>

      {/* TABLE */}
      <div className="lux-table-wrapper">
        <table className="lux-table">
          <thead>
            <tr>
              <th style={{minWidth: 160}}>Application</th>
              <th style={{minWidth: 220}}>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Due Date</th>
              <th style={{width: 72, textAlign: "center"}}>View</th>
              <th style={{width: 72, textAlign: "center"}}>Update</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((sp) => (
              <tr key={sp.key}>
                <td className="col-app">{sp.applicationname || "-"}</td>
                <td className="col-title">{sp.title || "-"}</td>

                <td>
                  <span className={`priority-badge ${String(sp.priority || "").toLowerCase()}`}>
                    {sp.priority || "-"}
                  </span>
                </td>

                <td>
                  <span className={getStatusClass(sp.status)}>
                    {sp.status || "-"}
                  </span>
                </td>

                <td>{sp.start_date || "-"}</td>
                <td>{sp.due_date || "-"}</td>

                {/* VIEW */}
                <td style={{ textAlign: "center" }}>
                  <button
                    className="icon-btn view-btn"
                    onClick={() => {
                      setSelectedSprint(sp);
                      setOpenView(true);
                    }}
                    style={{ background: "none", boxShadow: "none" }}
                  >
                    <Eye size={18} strokeWidth={1.8} />
                  </button>
                </td>

                {/* UPDATE */}
                <td style={{ textAlign: "center" }}>
                  <button
                    className="icon-btn update-btn"
                    onClick={() => {
                      setSelectedSprint(sp);
                      setOpenUpdate(true);
                    }}
                    style={{ background: "none", boxShadow: "none" }}
                  >
                    <Pencil size={18} strokeWidth={1.8} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* FIX: DRAWERS MUST BE OUTSIDE PAGE LAYOUT */}
    {openCreate && !isEmployee && (
      <SprintCreate
        onClose={() => {
          setOpenCreate(false);
          loadSprints();
        }}
      />
    )}

    {openView && (
      <SprintView
        data={selectedSprint}
        onClose={() => setOpenView(false)}
      />
    )}

    {openUpdate && (
      <SprintUpdate
        sprint={selectedSprint}
        isEmployee={isEmployee}
        onClose={() => {
          setOpenUpdate(false);
          loadSprints();
        }}
      />
    )}
  </>
);
}
