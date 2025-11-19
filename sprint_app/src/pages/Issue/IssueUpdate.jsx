import React, { useEffect, useState } from "react";
import { updateIssue } from "../../api/issueApi";
import { getApplicationList } from "../../api/applicationApi";
import { getDepartmentList } from "../../api/departmentApi";
import { getEmployeeList } from "../../api/employeeApi";

import "./IssueUpdate.css";

export default function IssueUpdate({ index, issue, isEmployee, onClose }) {
  const [apps, setApps] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({ ...issue });

  useEffect(() => {
    loadDropdowns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDropdowns = async () => {
    const appData = await getApplicationList();
    if (Array.isArray(appData)) setApps(appData);

    const deptData = await getDepartmentList();
    if (Array.isArray(deptData)) setDepartments(deptData);

    if (form.department) {
      await loadEmployees(form.department);
    }
  };

  const loadEmployees = async (dept) => {
    if (!dept) return;

    const all = await getEmployeeList();

    // ⭐ FIXED: Preserve key for employees also
    const list = all
      ? Object.entries(all).map(([key, val]) => ({ key, ...val }))
      : [];

    const filtered = list.filter((emp) => {
      const empDept =
        emp.department ||
        emp.dept ||
        emp.departmentname ||
        emp.department_name;

      return String(empDept).toLowerCase() === String(dept).toLowerCase();
    });

    setEmployees(filtered);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDeptChange = async (e) => {
    const dept = e.target.value;
    setForm({ ...form, department: dept, assigned_to: "" });

    await loadEmployees(dept);
  };

  const handleSubmit = async () => {
    // ⭐ FIXED: use Firebase key instead of index
    await updateIssue(issue.key, form);

    alert("Issue updated successfully!");
    if (typeof onClose === "function") onClose();
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}></div>

      <aside className="sprint-panel open" aria-labelledby="update-issue">
        <div className="panel-head">
          <h3 id="update-issue" className="panel-title">
            {isEmployee ? "Update Issue (Status)" : "Update Issue"}
          </h3>
          <button className="drawer-close" onClick={onClose}>×</button>
        </div>

        <div className="panel-body">
          <form className="update-form" onSubmit={(e)=>{ e.preventDefault(); handleSubmit(); }}>

            {/* Manager: full edit */}
            {!isEmployee && (
              <>
                <div className="form-row">
                  <label>Application</label>
                  <select name="applicationname" value={form.applicationname || ""} onChange={handleChange}>
                    <option value="">Select Application</option>
                    {apps.map((a,i)=> <option key={i} value={a}>{a}</option>)}
                  </select>
                </div>

                <div className="form-row">
                  <label>Title</label>
                  <input type="text" name="title" value={form.title || ""} onChange={handleChange} />
                </div>

                <div className="form-row">
                  <label>Description</label>
                  <textarea name="description" value={form.description || ""} onChange={handleChange} />
                </div>

                <div className="form-row">
                  <label>Department</label>
                  <select name="department" value={form.department || ""} onChange={handleDeptChange}>
                    <option value="">Select Department</option>
                    {departments.map((d,i)=> <option key={i} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="form-row">
                  <label>Assign To</label>
                  <select name="assigned_to" value={form.assigned_to || ""} onChange={handleChange}>
                    <option value="">Select Employee</option>
                    {employees.map((emp)=> (
                      <option key={emp.key} value={emp.empid}>
                        {emp.empid} - {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row two-cols">
                  <div>
                    <label>Start Date</label>
<input
  type="date"
  name="start_date"
  value={form.start_date || ""}
  onChange={handleChange}
  min={new Date().toISOString().split("T")[0]}
/>
                  </div>

                  <div>
                    <label>Due Date</label>
<input
  type="date"
  name="due_date"
  value={form.due_date || ""}
  onChange={handleChange}
  min={form.start_date || new Date().toISOString().split("T")[0]}
/>
                  </div>
                </div>

                <div className="form-row">
                  <label>Priority</label>
                  <select name="priority" value={form.priority || ""} onChange={handleChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </>
            )}

            {/* Employee: only status + upload UI */}
            {isEmployee && (
              <>
                <div className="form-row">
                  <label>Status</label>
                  <select name="status" value={form.status || ""} onChange={handleChange}>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Upload Image</label>
                  <div className="upload-box">
                    <input type="file" disabled />
                    <div className="upload-note">Upload UI ready — storage hook will be added later</div>
                  </div>
                </div>
              </>
            )}

            {/* common quick-status (manager) */}
            {!isEmployee && (
              <div className="form-row">
                <label>Status</label>
                <select name="status" value={form.status || ""} onChange={handleChange}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
            </div>

          </form>
        </div>
      </aside>
    </>
  );
}
