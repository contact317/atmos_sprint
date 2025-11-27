import React, { useEffect, useState } from "react";
import { getEmployeeList, updateEmployee, deleteEmployee } from "../../api/employeeApi";
import { getDepartmentList } from "../../api/departmentApi";
import { FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";
import "./EmployeeCreate.css";

export default function EmployeeUpdate({ onClose, empKey }) {
  const [departments, setDepartments] = useState([]);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    loadDepartments();
    loadEmployee();
  }, []);

  const loadDepartments = async () => {
    const d = await getDepartmentList();
    if (Array.isArray(d)) {
      const sorted = Array.from(new Set(d)).sort((a,b) =>
        String(a).localeCompare(String(b))
      );
      setDepartments(sorted);
    }
  };

  const loadEmployee = async () => {
    const all = await getEmployeeList();
    if (!all) return;

    const entries = Object.entries(all);
    const found = entries.find(([key]) => key === empKey);

    if (found) {
      const [, value] = found;
      setForm({ ...value });
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await updateEmployee(empKey, form);
    alert("Employee updated!");
    if (typeof onClose === "function") onClose();
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete employee?")) return;
    await deleteEmployee(empKey);
    alert("Employee deleted.");
    if (typeof onClose === "function") onClose();
  };

  if (!form) return null;

  return (
    <>
      <div className="drawer-backdrop"></div>

      <div className="emp-drawer open">
        <h2 className="drawer-title">Update Employee</h2>

        <button className="drawer-close" onClick={onClose}>×</button>

        <div className="drawer-form">

          <label className="drawer-label">Employee ID</label>
          <input
            name="empid"
            className="drawer-input"
            value={form.empid || ""}
            onChange={handleChange}
          />

          <label className="drawer-label">Name</label>
          <input
            name="name"
            className="drawer-input"
            value={form.name || ""}
            onChange={handleChange}
          />

          <label className="drawer-label">Department</label>
          <select
            name="department"
            className="drawer-input"
            value={form.department || ""}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((d, idx) => (
              <option key={idx} value={d}>{d}</option>
            ))}
          </select>

          <label className="drawer-label">Role</label>
          <select
            name="role"
            className="drawer-input"
            value={form.role || ""}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>

          <label className="drawer-label">Email</label>
          <input
            name="email"
            className="drawer-input"
            value={form.email || ""}
            onChange={handleChange}
          />

          <label className="drawer-label">Phone</label>
          <input
            name="phone"
            className="drawer-input"
            value={form.phone || ""}
            onChange={handleChange}
          />

          <label className="drawer-label">Password</label>
          <div className="pwd-row">
            <input
              name="password"
              className="drawer-input"
              type={showPwd ? "text" : "password"}
              value={form.password || ""}
              onChange={handleChange}
              style={{ flex: 1 }}
            />

            <button
              type="button"
              className="pwd-toggle"
              onClick={() => setShowPwd(v => !v)}
            >
              {showPwd ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
            </button>
          </div>

          <button className="drawer-save" onClick={handleSave}>
            Save Changes
          </button>

          <button className="drawer-delete" onClick={handleDelete}>
            <FiTrash2 size={16}/> Delete
          </button>

          <button className="drawer-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
