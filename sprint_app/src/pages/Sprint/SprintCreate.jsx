import React, { useEffect, useState } from "react";
import { addSprint } from "../../api/sprintApi";
import { getApplicationList } from "../../api/applicationApi";
import { getDepartmentList } from "../../api/departmentApi";
import { getEmployeeList } from "../../api/employeeApi";
import "./SprintCreate.css";

export default function SprintCreate({ onClose }) {
  const [apps, setApps] = useState([]);
  const [requirements, setRequirements] = useState([]); // ⭐ NEW FIELD
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: "",
    priority: "",
    description: "",
    applicationname: "",
    requirement: "",   // ⭐ NEW FIELD
    department: "",
    assigned_to: "",
    start_date: "",
    due_date: "",
    status: "",
  });

  useEffect(() => {
    loadApplications();
    loadDepartments();
  }, []);

  const loadApplications = async () => {
    const data = await getApplicationList();
    if (Array.isArray(data)) setApps(data);
  };

  const loadDepartments = async () => {
    const data = await getDepartmentList();
    if (Array.isArray(data)) setDepartments(data);
  };

  useEffect(() => {
    if (form.department) loadEmployees();
  }, [form.department]);

  const loadEmployees = async () => {
    const all = await getEmployeeList();
    const list = all ? Object.values(all) : [];

    const filtered = list.filter((emp) => {
      const empDept =
        emp.department || emp.dept || emp.departmentname || emp.department_name;

      return (
        String(empDept).toLowerCase() ===
        String(form.department).toLowerCase()
      );
    });

    setEmployees(filtered);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const required = [
      "title",
      "priority",
      "description",
      "applicationname",
      "department",
      "assigned_to",
      "start_date",
      "due_date",
      "status",
    ];

    for (let key of required) {
      if (!form[key]) return alert("Please fill all fields");
    }

    await addSprint(form);
    alert("Sprint created successfully!");
    if (typeof onClose === "function") onClose();
  };

  return (
    <>
      <div className="drawer-backdrop"></div>

      <button
        className="drawer-close-floating"
        onClick={() => typeof onClose === "function" && onClose()}
      >
        ×
      </button>

      <div className="sprint-panel open">
        <h2 className="panel-title">Create Sprint</h2>

        {/* APPLICATION */}
        <label className="sprint-label">Select Application</label>
        <select
          name="applicationname"
          value={form.applicationname}
          onChange={handleChange}
          className="sprint-select"
        >
          <option value="">Select Application</option>
          {apps.map((app, index) => (
            <option key={index} value={app}>
              {app}
            </option>
          ))}
        </select>

        {/* ⭐ REQUIREMENT DROPDOWN — NEW FIELD */}
        <label className="sprint-label">Select Requirement (Optional)</label>
        <select
          name="requirement"
          value={form.requirement}
          onChange={handleChange}
          className="sprint-select"
        >
          <option value="">Select Requirement</option>
          {requirements.map((req, index) => (
            <option key={index} value={req}>
              {req}
            </option>
          ))}
        </select>

        {/* TITLE */}
        <label className="sprint-label">Sprint Title</label>
        <input
          type="text"
          name="title"
          className="sprint-input"
          value={form.title}
          onChange={handleChange}
        />

        {/* DESCRIPTION */}
        <label className="sprint-label">Description</label>
        <textarea
          name="description"
          className="sprint-textarea"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        {/* DEPARTMENT */}
        <label className="sprint-label">Department</label>
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="sprint-select"
        >
          <option value="">Select Department</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* ASSIGNED TO */}
        <label className="sprint-label">Assign To</label>
        <select
          name="assigned_to"
          value={form.assigned_to}
          onChange={handleChange}
          disabled={!form.department}
          className="sprint-select"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.empid} value={emp.empid}>
              {emp.empid} - {emp.name}
            </option>
          ))}
        </select>

        {/* DATES */}
        <div style={{ display: "flex", gap: "14px" }}>
          <div style={{ flex: 1 }}>
            <label className="sprint-label">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="sprint-input"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label className="sprint-label">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="sprint-input"
              min={form.start_date || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* PRIORITY */}
        <label className="sprint-label">Priority</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="sprint-select"
        >
          <option value="">Select Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* STATUS */}
        <label className="sprint-label">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="sprint-select"
        >
          <option value="">Select Status</option>
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button className="save-btn" onClick={handleSubmit}>
          Create Sprint
        </button>
      </div>
    </>
  );
}
