import React, { useEffect, useState } from "react";

import {
  getDepartmentList,
  deleteDepartment,
} from "../../api/departmentApi";

import { useNavigate } from "react-router-dom";

export default function DepartmentList() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await getDepartmentList();
    if (Array.isArray(data)) setDepartments(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    await deleteDepartment(id);
    alert("Department deleted!");
    loadDepartments();
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "240px", width: "100%" }}>
        <TopBar title="Departments" />

        <div style={{ padding: "20px" }}>
          {/* HEADER + ADD BUTTON */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "22px", fontWeight: "600" }}>Department List</h2>

            <button
              onClick={() => navigate("/departments/create")}
              style={{
                padding: "10px 15px",
                background: "#111827",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              + Add Department
            </button>
          </div>

          {/* TABLE */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={th}>#</th>
                <th style={th}>Department Name</th>
                <th style={th}>Code</th>
                <th style={th}>Manager</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {departments.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: "20px", textAlign: "center" }}>
                    No Departments Found
                  </td>
                </tr>
              )}

              {departments.map((dept, index) => (
                <tr key={dept.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}>{index + 1}</td>
                  <td style={td}>{dept.name}</td>
                  <td style={td}>{dept.code}</td>
                  <td style={td}>{dept.manager || "-"}</td>

                  <td style={td}>
                    <button
                      onClick={() => navigate(`/departments/update/${dept.id}`)}
                      style={editBtn}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(dept.id)}
                      style={deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const th = {
  padding: "12px",
  fontSize: "14px",
  textAlign: "left",
  fontWeight: "600",
  color: "#374151",
  borderBottom: "1px solid #e5e7eb",
};

const td = {
  padding: "12px",
  fontSize: "14px",
  color: "#111827",
};

const editBtn = {
  padding: "6px 12px",
  marginRight: "10px",
  background: "#374151",
  color: "white",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
};

const deleteBtn = {
  padding: "6px 12px",
  background: "#b91c1c",
  color: "white",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
};
