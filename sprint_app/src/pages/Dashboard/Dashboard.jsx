import React, { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import Table from "../../components/Table";
import Loading from "../../components/Loading";

import { getSprintList } from "../../api/sprintApi";
import { getIssueList } from "../../api/issueApi";
import { getEmployeeList } from "../../api/employeeApi";

import "./Dashboard.css";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [sprints, setSprints] = useState([]);
  const [issues, setIssues] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");

  // ⭐ GET LOGGED USER (manager or employee)
  const authUser = JSON.parse(localStorage.getItem("authUser")) || null;
  const isEmployee = authUser?.role === "employee";
  const loggedEmp = authUser?.empid;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    const sprintData = await getSprintList();
    const issueData = await getIssueList();
    const employeeData = await getEmployeeList();

    let allSprints = sprintData ? Object.values(sprintData) : [];
    let allIssues = issueData ? Object.values(issueData) : [];
    let allEmployees = employeeData ? Object.values(employeeData) : [];

    // ⭐ APPLY EMPLOYEE FILTER LOGIC
if (isEmployee) {

  // ✔ Employee sprints
  allSprints = allSprints.filter(
    (sp) =>
      String(sp.assigned_to || sp.assignedTo) === String(loggedEmp)
  );

  // ✔ Employee issues
  allIssues = allIssues.filter(
    (i) =>
      String(i.assigned_to || i.assignedTo) === String(loggedEmp)
  );

      // employee should NOT see employee count card
      allEmployees = [];
    }

    // ⭐ set filtered OR full data
    setSprints(allSprints);
    setIssues(allIssues);
    setEmployees(allEmployees);

    setLoading(false);
  };

  if (loading) return <Loading />;

  /* ----------------------------------
      DEFINE VARIABLES FOR UNIVERSAL UI
  -----------------------------------*/

  // ⭐ CARDS (employee card hidden automatically)
const cards = [
  {
    label: "Total Sprints",
    value: sprints.length,
    link: "/sprints"
  },
  {
    label: "Total Issues",
    value: issues.length,
    link: "/issues"
  },
  !isEmployee && {
    label: "Employees",
    value: employees.length,
    link: "/employees"
  },
  {
    label: "Pending Issues",
    value: issues.filter((i) => i.status === "Pending").length,
    link: "/issues"
  }
]
.filter(Boolean)
.map((c, index) => (
  <div
    key={index}
    className="lux-card dash-card dash-card-clickable"
    onClick={() => (window.location.href = c.link)}
  >
    <h3>{c.label}</h3>
    <p className="dash-number">{c.value}</p>
  </div>
));

 // remove null for employees

  // SEARCH
  const searchPlaceholder = "Search sprints...";

  // Dashboard does NOT need create button
  const showCreate = false;
  const createLabel = "";
  const onCreate = () => {};

  // ⭐ Employee sees only THEIR sprints already filtered above
  const filtered = sprints.filter((sp) =>
    sp.title.toLowerCase().includes(search.toLowerCase())
  );

  const tableTitle = isEmployee ? "My Recent Sprints" : "Recent Sprints";

  const tableData = filtered.slice(-5).reverse();

  return (
    <div className="page-content-inner">

      {/* CARDS ROW */}
      <div className="lux-cards">{cards}</div>

      {/* SEARCH BAR */}
      <div className="lux-search-row">
        <input
          className="lux-search-input"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE TITLE */}
      <div className="lux-table-title">{tableTitle}</div>

      {/* TABLE WRAPPER */}
      <div className="lux-table-wrapper">
        <Table columns={[
          { header: "Title", accessor: "title" },
          { header: "Application", accessor: "applicationname" },
          { header: "Priority", accessor: "priority" },
        ]} data={tableData} />
      </div>

    </div>
  );
}
