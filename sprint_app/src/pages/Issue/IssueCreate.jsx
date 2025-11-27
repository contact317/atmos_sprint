import React, { useEffect, useState } from "react";

import { addIssue } from "../../api/issueApi";
import { getApplicationList } from "../../api/applicationApi";
import { getDepartmentList } from "../../api/departmentApi";
import { getEmployeeList } from "../../api/employeeApi";
import { getRequirementList } from "../../api/requirementApi"; // ⭐ ADDED

import "./IssueCreate.css";

export default function IssueCreate({ onClose }) {

  const [applications, setApplications] = useState([]);
  const [requirements, setRequirements] = useState([]); // ⭐ REQUIREMENTS NOW REAL
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Read auth user to decide employee vs manager
  const authUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("authUser")) || {};
    } catch {
      return {};
    }
  })();
  const isEmployee = authUser?.role === "employee";

  const [form, setForm] = useState({
    applicationname: "",
    requirement: "",
    title: "",
    description: "",
    department: "",
    assigned_to: "",
    priority: "",
    status: "",
    start_date: "",
    due_date: "",
  });

  // Load applications + departments + requirements
  useEffect(() => {
    loadApplications();
    loadDepartments();
    loadRequirements(); // ⭐ ADDED

    // If employee – auto-fill department
    if (isEmployee && authUser.department) {
      setForm((f) => ({ ...f, department: authUser.department }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadApplications = async () => {
    const data = await getApplicationList();
    if (Array.isArray(data)) setApplications(data);
  };

  const loadDepartments = async () => {
    const data = await getDepartmentList();
    if (Array.isArray(data)) setDepartments(data);
  };

  const loadRequirements = async () => {
    const data = await getRequirementList(); // RAW OBJECT
    if (data) {
      const formatted = Object.entries(data).map(([id, r]) => ({
        id,
        title: r.title || "",
        department: r.department || "",
        applicationName: r.applicationName || "",
        priority: r.priority || "",
      }));
      setRequirements(formatted); // STORE PROPER LIST
    }
  };

  // Load employees when department changes
  useEffect(() => {
    if (form.department) {
      loadEmployees();
    } else {
      setEmployees([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.department]);

  const loadEmployees = async () => {
    const all = await getEmployeeList();
    const list = all ? Object.values(all) : [];

    const filtered = list.filter(emp => {
      const empDept =
        emp.department || emp.dept || emp.departmentname || emp.department_name;
      return (
        String(empDept).toLowerCase() ===
        String(form.department).toLowerCase()
      );
    });

    setEmployees(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (isEmployee && name === "department") return;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (
      !form.applicationname ||
      !form.title ||
      !form.department ||
      !form.assigned_to ||
      !form.priority ||
      !form.status ||
      !form.start_date ||
      !form.due_date
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      ...form,
      createdAt: new Date().toISOString(),

      assigned_by: isEmployee ? authUser.empid : (authUser.empid || "manager"),
      assigner_name: isEmployee
        ? (authUser.name || authUser.empid)
        : (authUser.name || "Manager"),

      assignee_name: (() => {
        const emp = employees.find(e => String(e.empid) === String(form.assigned_to));
        if (emp) return emp.name || emp.empid;
        return "";
      })(),
    };

    await addIssue(payload);
    alert("Issue created successfully!");
    if (typeof onClose === "function") onClose();
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="drawer-backdrop"></div>

      {/* CLOSE BUTTON */}
      <button className="drawer-close-floating" onClick={onClose}>
        ×
      </button>

      {/* DRAWER PANEL */}
      <div className="issue-panel open">
        <h2 className="panel-title">Create Issue</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

          {/* APPLICATION */}
          <div>
            <label className="issue-label">Select Application</label>
            <select
              name="applicationname"
              value={form.applicationname}
              onChange={handleChange}
              className="issue-input"
            >
              <option value="">Select Application</option>
              {applications.map((app, index) => (
                <option key={index} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>

          {/* REQUIREMENT DROPDOWN */}
          <div>
            <label className="issue-label">Select Requirement (Optional)</label>
            <select
              name="requirement"
              value={form.requirement}
              onChange={handleChange}
              className="issue-input"
            >
              <option value="">Select Requirement</option>

              {requirements.map((req) => (
                <option key={req.id} value={req.title}>
                  {req.title}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div>
            <label className="issue-label">Issue Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter Issue Title"
              className="issue-input"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="issue-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={4}
              className="issue-input"
            ></textarea>
          </div>

          {/* DEPARTMENT */}
          <div>
            <label className="issue-label">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="issue-input"
              disabled={isEmployee}
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {isEmployee && (
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                Department auto-set to your department.
              </div>
            )}
          </div>

          {/* ASSIGN TO */}
          <div>
            <label className="issue-label">Assign To</label>
            <select
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
              disabled={!form.department}
              className="issue-input"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.empid} value={emp.empid}>
                  {emp.empid} - {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* DATES */}
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label className="issue-label">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="issue-input"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label className="issue-label">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className="issue-input"
                min={form.start_date || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* PRIORITY */}
          <div>
            <label className="issue-label">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="issue-input"
            >
              <option value="">Select Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="issue-label">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="issue-input"
            >
              <option value="">Select Status</option>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          {/* SAVE */}
          <button className="issue-save-btn" onClick={handleSubmit}>
            Create Issue
          </button>
        </div>
      </div>
    </>
  );
}
