import React, { useEffect, useState } from "react";
import { getIssueList } from "../../api/issueApi";
import "./IssueList.css";

import { HiOutlineEye, HiOutlinePencilAlt } from "react-icons/hi";

import IssueCreate from "./IssueCreate";
import IssueUpdate from "./IssueUpdate";
import IssueView from "./IssueView";

export default function IssueList() {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const isEmployee = authUser?.role === "employee";
  const loggedEmp = authUser?.empid;

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    const data = await getIssueList();
    let issueArray = data ? Object.values(data) : [];

    // Employee-only viewing
    if (isEmployee) {
      issueArray = issueArray.filter(
        (i) =>
          String(i.assigned_to || i.assignedTo) === String(loggedEmp)
      );
    }

    // ⭐ Sort newest first (by start_date or createdAt)
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

      {/* SEARCH + CREATE */}
      <div className="lux-search-row">
        <input
          type="text"
          placeholder="Search issues..."
          className="lux-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {!isEmployee && (
          <button className="lux-primary-btn" onClick={() => setOpenCreate(true)}>
            + Create Issue
          </button>
        )}
      </div>

      <div className="lux-table-title">
        {isEmployee ? "My Issues" : "All Issues"}
      </div>

      {/* TABLE */}
      <div className="lux-table-wrapper">
        <table className="lux-table">
          <thead>
            <tr>
              <th style={{ minWidth: 160 }}>Application</th>
              <th style={{ minWidth: 220 }}>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Due Date</th>
              <th style={{ width: 72, textAlign: "center" }}>View</th>
              <th style={{ width: 72, textAlign: "center" }}>Update</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((issue, index) => (
              <tr key={index}>
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

                <td>{issue.start_date || "-"}</td>
                <td>{issue.due_date || "-"}</td>

                {/* VIEW ICON */}
                <td style={{ textAlign: "center" }}>
                  <button
                    className="icon-btn view-btn"
                    title="View details"
                    onClick={() => {
                      setSelectedData(issue);
                      setOpenView(true);
                    }}
                  >
                    <HiOutlineEye />
                  </button>
                </td>

                {/* UPDATE ICON */}
                <td style={{ textAlign: "center" }}>
                  <button
                    className="icon-btn update-btn"
                    title={isEmployee ? "Update status" : "Edit issue"}
                    onClick={() => {
                      setSelectedIndex(index);
                      setSelectedData(issue);
                      setOpenUpdate(true);
                    }}
                  >
                    <HiOutlinePencilAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE */}
      {openCreate && !isEmployee && (
        <IssueCreate
          onClose={() => {
            setOpenCreate(false);
            loadIssues();
          }}
        />
      )}

      {/* UPDATE */}
      {openUpdate && (
        <IssueUpdate
          index={selectedIndex}
          issue={selectedData}
          isEmployee={isEmployee}
          onClose={() => {
            setOpenUpdate(false);
            loadIssues();
          }}
        />
      )}

      {/* VIEW */}
      {openView && (
        <IssueView
          data={selectedData}
          onClose={() => setOpenView(false)}
        />
      )}

    </div>
  );
}
