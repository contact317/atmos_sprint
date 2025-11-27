import React, { useState } from "react";
import "./EmployeeDrawer.css";
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
      <div className="employee-backdrop"></div>

      <button className="emp-close-btn" onClick={() => navigate("/employees")}>×</button>

      <div className="employee-drawer open">
        <h2 style={{ marginBottom: 10, fontWeight: 700 }}>Add Employee</h2>

        <label className="emp-label">Employee ID *</label>
        <input
          type="text"
          name="emp_id"
          value={form.emp_id}
          onChange={handleChange}
          className="emp-input"
        />

        <label className="emp-label">Employee Name *</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="emp-input"
        />

        <label className="emp-label">Department *</label>
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="emp-input"
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="Operations">Operations</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">HR</option>
          <option value="Presales">Presales</option>
        </select>

        <label className="emp-label">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="emp-input"
        >
          <option value="">Select Role</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <label className="emp-label">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="emp-input"
        />

        <label className="emp-label">Phone</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="emp-input"
        />

        <button className="emp-save-btn" onClick={handleSubmit}>
          Create Employee
        </button>

        <button className="emp-cancel-btn" onClick={() => navigate("/employees")}>
          Cancel
        </button>
      </div>
    </>
  );
}
