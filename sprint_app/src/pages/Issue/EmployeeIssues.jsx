import React, { useEffect, useState } from "react";
import { getIssueList } from "../../api/issueApi";
import "./IssueList.css";

import { Eye, Pencil } from "lucide-react";

import IssueView from "./IssueView";
import IssueUpdate from "./IssueUpdate";

export default function EmployeeIssues() {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    const data = await getIssueList();
    let issueArray = data ? Object.values(data) : [];

    // Filter: only employee-created issues (assigned_by exists and not equal to "manager")
    issueArray = issueArray.filter(i => (i.assigned_by && String(i.assigned_by).toLowerCase() !== "manager"));

    // ⭐ Sort newest first
    issueArray.sort((a, b) => {
      const db = new Date(b.start_date || b.createdAt || 0);
      const da = new Date(a.start_date || a.createdAt || 0);
      return db - da;
    });

    setIssues(issueArray);
  };

  const total = issues.length;
  const inProgress = issues.filter((i) => i.status === "In Progress").length;
  const completed = issues.filter((i) => i.status === "Completed").length;

  const today = new Date();
  const delayed = issues.filter(
    (i) =>
      i.due_date &&
      new Date(i.due_date) < today &&
      i.status !== "Completed"
  ).length;

  const filtered = issues.filter((i) =>
    (i.title || "").toLowerCase().includes(search.toLowerCase())
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
          { title: "Total Issues", value: total },
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

      {/* SEARCH ROW */}
      <div className="lux-search-row">
        <input
          type="text"
          placeholder="Search employee-assigned issues..."
          className="lux-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="lux-table-title">Employee Assigned Issues</div>

      {/* TABLE */}
      <div className="lux-table-wrapper">
        <table className="lux-table">
          <thead>
            <tr>
              <th style={{ minWidth: 160 }}>Application</th>
              <th style={{ minWidth: 220 }}>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned By</th>
              <th>Assigned To</th>
              <th>Created Date</th>
              <th>Due Date</th>
              <th style={{ width: 72, textAlign: "center" }}>View</th>
              <th style={{ width: 72, textAlign: "center" }}>Update</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">No employee-assigned issues found</td>
              </tr>
            ) : (
              filtered.map((issue, index) => (
                <tr key={issue.id || index}>
                  <td className="col-app">{issue.applicationname || "-"}</td>
                  <td className="col-title">{issue.title || "-"}</td>

                  <td>
                    <span className={`priority-badge ${String(issue.priority || "").toLowerCase()}`}>
                      {issue.priority || "-"}
                    </span>
                  </td>

                  <td>
                    <span className={getStatusClass(issue.status)}>
                      {issue.status || "-"}
                    </span>
                  </td>

                  <td>{issue.assigner_name || issue.assigned_by || "-"}</td>
                  <td>{issue.assignee_name || issue.assigned_to || "-"}</td>

                  <td>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "-"}</td>
                  <td>{issue.due_date || "-"}</td>

                  <td style={{ textAlign: "center" }}>
                    <button
                      className="icon-btn view-btn"
                      onClick={() => {
                        setSelectedData(issue);
                        setOpenView(true);
                      }}
                    >
                     <Eye size={18} />
                    </button>
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <button
                      className="icon-btn update-btn"
                      onClick={() => {
                        setSelectedIndex(index);
                        setSelectedData(issue);
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

      {/* UPDATE */}
      {openUpdate && selectedData && (
        <IssueUpdate
          index={selectedIndex}
          issue={selectedData}
          isEmployee={false}
          onClose={() => {
            setOpenUpdate(false);
            loadIssues();
          }}
        />
      )}

      {/* VIEW */}
      {openView && selectedData && (
        <IssueView data={selectedData} onClose={() => setOpenView(false)} />
      )}
    </div>
  );
}
