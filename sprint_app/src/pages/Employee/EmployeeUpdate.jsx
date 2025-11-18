import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

import { getEmployeeList, updateEmployee } from "../../api/employeeApi";
import { useParams, useNavigate } from "react-router-dom";

export default function EmployeeUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    department: "",
    role: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    const allEmployees = await getEmployeeList();
    const emp = allEmployees.find((e) => String(e.id) === String(id));

    if (emp) {
      setForm({
        employee_id: emp.employee_id,
        name: emp.name,
        department: emp.department,
        role: emp.role,
        email: emp.email,
        phone: emp.phone,
      });
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    await updateEmployee(id, form);
    alert("Employee updated successfully!");
    navigate("/employees");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "240px", width: "100%" }}>
        <TopBar title="Update Employee" />

        <div style={{ padding: "20px", maxWidth: "600px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

            {/* EMPLOYEE ID */}
            <div>
              <label style={label}>Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                style={input}
              />
            </div>

            {/* NAME */}
            <div>
              <label style={label}>Employee Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={input}
              />
            </div>

            {/* DEPARTMENT */}
            <div>
              <label style={label}>Department</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                style={input}
              />
            </div>

            {/* ROLE */}
            <div>
              <label style={label}>Role</label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                style={input}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label style={label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={input}
              />
            </div>

            {/* PHONE */}
            <div>
              <label style={label}>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={input}
              />
            </div>

            <button
              onClick={handleUpdate}
              style={button}
            >
              Update Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const label = {
  fontSize: "14px",
  color: "#374151",
  marginBottom: "6px",
  display: "block",
};

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

const button = {
  padding: "12px",
  background: "#111827",
  color: "white",
  borderRadius: "8px",
  border: "none",
  width: "160px",
  cursor: "pointer",
  marginTop: "15px",
};
