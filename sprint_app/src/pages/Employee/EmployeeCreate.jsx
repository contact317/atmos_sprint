import React, { useState } from "react";
import "./EmployeeCreate.css";
import { addEmployee } from "../../api/employeeApi";
import { useNavigate } from "react-router-dom";

export default function EmployeeCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emp_id: "",
    name: "",
    department: "",
    role: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.emp_id || !form.name || !form.department) {
      alert("Please fill required fields (Employee ID, Name, Department)");
      return;
    }

    await addEmployee(form);
    alert("Employee created successfully!");
    navigate("/employees");
  };

  return (
    <>
      {/* Backdrop */}
      <div className="employee-create-backdrop" onClick={() => navigate("/employees")}></div>

      {/* Drawer */}
      <div className="employee-create-drawer open">
        <div className="drawer-header">
          <h2>Add Employee</h2>
          <button className="drawer-close" onClick={() => navigate("/employees")}>
            ×
          </button>
        </div>

        <div className="drawer-body">
          <label className="drawer-label">Employee ID *</label>
          <input
            type="text"
            name="emp_id"
            value={form.emp_id}
            onChange={handleChange}
            placeholder="EMP-1001"
            className="drawer-input"
          />

          <label className="drawer-label">Employee Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Employee Name"
            className="drawer-input"
          />

          <label className="drawer-label">Department *</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="drawer-input"
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Presales">Presales</option>
          </select>

          <label className="drawer-label">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="drawer-input"
          >
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>

          <label className="drawer-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="employee@example.com"
            className="drawer-input"
          />

          <label className="drawer-label">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="9876543210"
            className="drawer-input"
          />

          <div className="drawer-actions">
            <button className="drawer-save" onClick={handleSubmit}>
              Create Employee
            </button>
            <button className="drawer-cancel" onClick={() => navigate("/employees")}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
