import React, { useEffect, useState } from "react";
import { updateSprint } from "../../api/sprintApi";
import { getApplicationList } from "../../api/applicationApi";
import { getDepartmentList } from "../../api/departmentApi";
import { getEmployeeList } from "../../api/employeeApi";

import "./SprintUpdate.css";

export default function SprintUpdate({ sprint, isEmployee, onClose }) {
  const [apps, setApps] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ⭐ FIXED: Safe copy
  const [form, setForm] = useState({ ...sprint });

  useEffect(() => {
    loadDropdowns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDropdowns = async () => {
    const appData = await getApplicationList();
    if (Array.isArray(appData)) setApps(appData);

    const deptData = await getDepartmentList();
    if (Array.isArray(deptData)) setDepartments(deptData);

    if (form.department) loadEmployees(form.department);
  };

  const loadEmployees = async (dept) => {
    if (!dept) return;
    const all = await getEmployeeList();
    const list = all
      ? Object.entries(all).map(([key, val]) => ({ key, ...val }))
      : [];
    const filtered = list.filter(
      (emp) =>
        String(emp.department).toLowerCase() === String(dept).toLowerCase()
    );
    setEmployees(filtered);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDeptChange = (e) => {
    const v = e.target.value;
    setForm({ ...form, department: v, assigned_to: "" });
    loadEmployees(v);
  };

  const handleSubmit = async () => {
    // ⭐ FIXED: Use Firebase key
    await updateSprint(sprint.key, form);
    alert("Sprint updated successfully!");
    onClose();
  };

  return (
    <>
      {/* backdrop */}
<div className="drawer-backdrop" onClick={onClose}></div>
      {/* FIX: Wrapper added */}
      <div className="drawer-container">

        <aside className="sprint-panel open" aria-labelledby="update-sprint">
          <div className="panel-head">
            <h3 id="update-sprint" className="panel-title">
              {isEmployee ? "Update Sprint (Status)" : "Update Sprint"}
            </h3>
            <button className="drawer-close" onClick={onClose}>×</button>
          </div>

          <div className="panel-body">
            <form
              className="update-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >

              {!isEmployee && (
                <>
                  <div className="form-row">
                    <label>Application</label>
                    <select
                      name="applicationname"
                      value={form.applicationname || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Application</option>
                      {apps.map((a, i) => (
                        <option key={i} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={form.description || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <label>Department</label>
                    <select
                      name="department"
                      value={form.department || ""}
                      onChange={handleDeptChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map((d, i) => (
                        <option key={i} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <label>Assign To</label>
                    <select
                      name="assigned_to"
                      value={form.assigned_to || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
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
                        min={
                          form.start_date ||
                          new Date().toISOString().split("T")[0]
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={form.priority || ""}
                      onChange={handleChange}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </>
              )}

              {isEmployee && (
                <>
                  <div className="form-row">
                    <label>Status</label>
                    <select
                      name="status"
                      value={form.status || ""}
                      onChange={handleChange}
                    >
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label>Upload Image</label>
                    <div className="upload-box">
                      <input type="file" disabled />
                      <div className="upload-note">
                        Upload UI ready — storage hook will be added later
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!isEmployee && (
                <div className="form-row">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status || ""}
                    onChange={handleChange}
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
