import React, { useEffect, useState } from "react";
import "./SprintView.css";
import { getEmployeeList } from "../../api/employeeApi";

export default function SprintView({ data, onClose }) {
  const [employeeName, setEmployeeName] = useState(null);

  useEffect(() => {
    // try to resolve assigned_to to employee name (UI-only helper)
    const fetchName = async () => {
      if (!data?.assigned_to) return;
      try {
        const all = await getEmployeeList();
        const list = all ? Object.values(all) : [];
        const found = list.find(
          (e) =>
            String(e.empid || e.employee_id || e.empId) ===
            String(data.assigned_to)
        );
        if (found) setEmployeeName(found.name || found.fullname || found.empid);
      } catch (err) {
        // ignore silently — UI helper only
      }
    };
    fetchName();
  }, [data]);

  if (!data) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}></div>

      <aside className="sprint-panel open" aria-labelledby="sprint-details">
        <div className="panel-head">
          <h3 id="sprint-details" className="panel-title">Sprint Details</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close panel">×</button>
        </div>

        <div className="panel-body">
          <div className="detail-card">
            <div className="detail-row">
              <label>Application</label>
              <div className="value">{data.applicationname || "-"}</div>
            </div>

            <div className="detail-row">
              <label>Title</label>
              <div className="value">{data.title || "-"}</div>
            </div>

            <div className="detail-row">
              <label>Assigned Employee</label>
              <div className="value">
                {employeeName ? `${employeeName} (${data.assigned_to})` : (data.assigned_to || "-")}
              </div>
            </div>

            <div className="detail-row">
              <label>Department</label>
              <div className="value">{data.department || "-"}</div>
            </div>

            <div className="detail-row">
              <label>Priority</label>
              <div className="value">{data.priority || "-"}</div>
            </div>

            <div className="detail-row">
              <label>Status</label>
              <div className="value">{data.status || "-"}</div>
            </div>

            <div className="detail-row">
              <label>Start Date</label>
              <div className="value">{data.start_date || "-"}</div>
            </div>

            <div className="detail-row">
              <label>Due Date</label>
              <div className="value">{data.due_date || "-"}</div>
            </div>
          </div>

          <div className="detail-card description-card">
            <label className="section-label">Description</label>
            <p className="description-text">{data.description || "-"}</p>
          </div>

          {data.imageUrl && (
            <div className="detail-card">
              <label className="section-label">Attachment</label>
              <img src={data.imageUrl} alt="attachment" className="attachment-img" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
