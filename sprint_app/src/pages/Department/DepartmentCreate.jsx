import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

import { addDepartment } from "../../api/departmentApi";
import { useNavigate } from "react-router-dom";

export default function DepartmentCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    code: "",
    manager: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.code) {
      alert("Please fill required fields (Name, Code)");
      return;
    }

    await addDepartment(form);
    alert("Department created successfully!");
    navigate("/departments");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "240px", width: "100%" }}>
        <TopBar title="Create Department" />

        <div style={{ padding: "20px", maxWidth: "600px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

            {/* Department Name */}
            <div>
              <label style={label}>Department Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Engineering"
                style={input}
              />
            </div>

            {/* Department Code */}
            <div>
              <label style={label}>Department Code</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="ENG"
                style={input}
              />
            </div>

            {/* Manager */}
            <div>
              <label style={label}>Manager</label>
              <input
                type="text"
                name="manager"
                value={form.manager}
                onChange={handleChange}
                placeholder="Manager Name"
                style={input}
              />
            </div>

            {/* Description */}
            <div>
              <label style={label}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional description"
                rows={4}
                style={input}
              ></textarea>
            </div>

            <button onClick={handleSubmit} style={button}>
              Add Department
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
