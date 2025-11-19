import React, { useEffect, useState } from "react";
import { getEmployeeList, addEmployee, updateEmployee, /* optional */ deleteEmployee } from "../../api/employeeApi";
import { getDepartmentList } from "../../api/departmentApi";
import "./EmployeeList.css";
import "./EmployeeCreate.css";

import { FiEdit2, FiTrash2 } from "react-icons/fi";

/**
 * EmployeeList.jsx
 * - Add / Create drawer (right)
 * - Update drawer (right) — opened by pencil icon, matches SprintUpdate UI
 * - Delete employee (inside Update drawer) with confirm
 * - Department dropdown in create & update (fetched from getDepartmentList)
 * - Sorting: Name and Department (cycles none -> asc -> desc)
 * - New employees show first (list reversed by default)
 *
 * NOTES:
 * - I import deleteEmployee for the delete flow. If your api file doesn't export it yet,
 *   add the function there (or rename) — this UI calls deleteEmployee(keyOrIndex).
 * - I did not change your server/API semantics or logic.
 */

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // drawers
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  // create form
  const [createForm, setCreateForm] = useState({
    empid: "",
    name: "",
    department: "",
    role: "",
    email: "",
    phone: "",
    password: ""
  });
  const [creating, setCreating] = useState(false);

  // update form (holds key/index + data)
  const [updateKey, setUpdateKey] = useState(null);
  const [updateForm, setUpdateForm] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // departments
  const [departments, setDepartments] = useState([]);

  // sorting state for name & dept: "none" | "asc" | "desc"
  const [nameSort, setNameSort] = useState("none");
  const [deptSort, setDeptSort] = useState("none");

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  // old:
  // const data = await getEmployeeList();
  // if (data) setEmployees(Object.values(data));

  // new (preserve key):
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployeeList(); // data is an object keyed by firebase keys
      if (data && typeof data === "object") {
        const arr = Object.entries(data).map(([key, val]) => {
          // prefer original id-like fields but keep 'key' for API calls
          return { key, ...val };
        });
        setEmployees(arr);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error("Failed to load employees", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const d = await getDepartmentList();
      if (Array.isArray(d)) {
        // ensure stable order A-Z
        const uniqueOrdered = Array.from(new Set(d)).sort((a,b) => String(a).localeCompare(String(b)));
        setDepartments(uniqueOrdered);
      } else {
        setDepartments([]);
      }
    } catch (err) {
      console.warn("Failed to load departments", err);
      setDepartments([]);
    }
  };

  // CREATE handlers
  const handleCreateChange = (e) =>
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });

  const handleCreateSubmit = async () => {
    if (!createForm.empid || !createForm.name || !createForm.department) {
      return alert("Please fill required fields: Employee ID, Name, Department");
    }
    setCreating(true);
    try {
      await addEmployee({
        empid: createForm.empid,
        name: createForm.name,
        department: createForm.department,
        role: createForm.role || "employee",
        email: createForm.email,
        phone: createForm.phone,
        password: createForm.password || "changeme123"
      });
      alert("Employee added successfully");
      setOpenCreate(false);
      setCreateForm({
        empid: "",
        name: "",
        department: "",
        role: "",
        email: "",
        phone: "",
        password: ""
      });
      await loadEmployees();
    } catch (err) {
      console.error("Add employee failed", err);
      alert("Failed to add employee. See console.");
    } finally {
      setCreating(false);
    }
  };

  // UPDATE open
  const openUpdateDrawer = (indexOrKey, record) => {
    setUpdateKey(indexOrKey);
    setUpdateForm({ ...record });
    setOpenUpdate(true);
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    if (!updateForm) return;
    setUpdating(true);
    try {
      // You said not to change API logic — we call updateEmployee with the same index/key semantics
      await updateEmployee(updateKey, updateForm);
      alert("Employee updated successfully");
      setOpenUpdate(false);
      setUpdateKey(null);
      setUpdateForm(null);
      await loadEmployees();
    } catch (err) {
      console.error("Update employee failed", err);
      alert("Failed to update employee. See console.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!updateKey) return;
    const ok = window.confirm("Are you sure you want to delete this employee? This action cannot be undone.");
    if (!ok) return;
    setDeleting(true);
    try {
      // keep semantics: call deleteEmployee(recordKey)
      if (typeof deleteEmployee === "function") {
        await deleteEmployee(updateKey);
      } else {
        // If deleteEmployee not exported, attempt a fallback: try updateEmployee with null (do nothing)
        console.warn("deleteEmployee not available in api — implement api deleteEmployee(key).");
        throw new Error("deleteEmployee api missing");
      }
      alert("Employee deleted.");
      setOpenUpdate(false);
      setUpdateKey(null);
      setUpdateForm(null);
      await loadEmployees();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed. Check console and ensure deleteEmployee API exists.");
    } finally {
      setDeleting(false);
    }
  };

  // FILTER + SORT logic
  const filtered = employees.filter((emp) =>
    (((emp.name || "") + " " + (emp.empid || "") + " " + (emp.role || "") + " " + (emp.department || ""))
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase()))
  );

  // Apply sorting: default display should show latest first (new added on top)
  const sorted = (() => {
    let arr = filtered.slice();
    // default: show new items first -> reverse original insertion order (user asked earlier)
    // But we must also respect sorting controls (nameSort / deptSort)
    // If both are 'none' -> reverse to show latest first
    if (nameSort === "none" && deptSort === "none") {
      arr = arr.slice().reverse();
      return arr;
    }

    // If nameSort set -> sort by name (localeCompare)
    if (nameSort !== "none") {
      arr.sort((a,b) => {
        const na = (a.name || "").toString().toLowerCase();
        const nb = (b.name || "").toString().toLowerCase();
        if (nameSort === "asc") return na.localeCompare(nb);
        return nb.localeCompare(na);
      });
      return arr;
    }

    // If deptSort set -> sort by department
    if (deptSort !== "none") {
      arr.sort((a,b) => {
        const da = (a.department || "").toString().toLowerCase();
        const db = (b.department || "").toString().toLowerCase();
        if (deptSort === "asc") return da.localeCompare(db);
        return db.localeCompare(da);
      });
      return arr;
    }

    return arr;
  })();

  // column header click cycles: none -> asc -> desc -> none
  const cycleSort = (field) => {
    if (field === "name") {
      // reset dept
      setDeptSort("none");
      setNameSort((s) => {
        if (s === "none") return "asc";
        if (s === "asc") return "desc";
        return "none";
      });
    } else if (field === "department") {
      setNameSort("none");
      setDeptSort((s) => {
        if (s === "none") return "asc";
        if (s === "asc") return "desc";
        return "none";
      });
    }
  };

  // determine icon glyph for sort indicator
  const sortIcon = (state) => {
    if (state === "none") return "";
    if (state === "asc") return "▲";
    return "▼";
  };

  // minimal manager check (sidebar/route already restricts pages; this just hides Add button for employees)
  const authUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("authUser")) || {};
    } catch {
      return {};
    }
  })();
  const isManager = authUser.role === "manager";

  return (
    <div className="employee-page">
      <div className="employee-header">
        <div>
          <h2 className="employee-h2">Employees</h2>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            className="employee-search"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isManager && (
            <button
              className="employee-add-btn"
              onClick={() => setOpenCreate(true)}
              title="Add employee"
            >
              + Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="employee-table-wrapper">
        {loading ? (
          <div className="employee-loading">Loading employees...</div>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th onClick={() => cycleSort("name")} style={{ cursor: "pointer" }}>
                  Name {sortIcon(nameSort) ? <span className="sort-ind">{sortIcon(nameSort)}</span> : null}
                </th>
                <th>Emp ID</th>
                <th onClick={() => cycleSort("department")} style={{ cursor: "pointer" }}>
                  Dept {sortIcon(deptSort) ? <span className="sort-ind">{sortIcon(deptSort)}</span> : null}
                </th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No employees found</td>
                </tr>
              ) : (
                sorted.map((emp, i) => (
                  <tr key={emp.key || i}>
                    <td>{emp.name || "-"}</td>
                    <td>{emp.empid || emp.employee_id || "-"}</td>
                    <td>{emp.department || "-"}</td>
                    <td>{emp.role || "-"}</td>
                    <td>{emp.email || "-"}</td>
                    <td>{emp.phone || "-"}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="icon-action edit-icon"
                        title="Edit employee"
                        // new - use key stored on each record
                        onClick={() => openUpdateDrawer(emp.key, emp)}
                      >
                        <FiEdit2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= CREATE DRAWER ================= */}
      {openCreate && (
        <>
          <div className="global-drawer-backdrop" onClick={() => setOpenCreate(false)}></div>

          <div className="employee-drawer open">
            <h3 className="drawer-title">Add Employee</h3>
            <button className="drawer-close" onClick={() => setOpenCreate(false)}>×</button>

            <div className="drawer-form">
              <label className="drawer-label">Employee ID *</label>
              <input name="empid" className="drawer-input" value={createForm.empid} onChange={handleCreateChange} />

              <label className="drawer-label">Name *</label>
              <input name="name" className="drawer-input" value={createForm.name} onChange={handleCreateChange} />

              <label className="drawer-label">Department *</label>
              <select name="department" className="drawer-input" value={createForm.department} onChange={handleCreateChange}>
                <option value="">Select Department</option>
                {departments.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
              </select>

              <label className="drawer-label">Role</label>
              <input name="role" className="drawer-input" value={createForm.role} onChange={handleCreateChange} />

              <label className="drawer-label">Email</label>
              <input name="email" className="drawer-input" value={createForm.email} onChange={handleCreateChange} />

              <label className="drawer-label">Phone</label>
              <input name="phone" className="drawer-input" value={createForm.phone} onChange={handleCreateChange} />

              <label className="drawer-label">Password</label>
              <input name="password" className="drawer-input" value={createForm.password} onChange={handleCreateChange} type="password" placeholder="Optional initial password" />

              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button className="drawer-save" onClick={handleCreateSubmit} disabled={creating}>
                  {creating ? "Creating..." : "Create Employee"}
                </button>
                <button className="drawer-cancel" onClick={() => setOpenCreate(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= UPDATE DRAWER ================= */}
      {openUpdate && updateForm && (
        <>
          <div className="global-drawer-backdrop" onClick={() => setOpenUpdate(false)}></div>

          <div className="employee-drawer open">
            <h3 className="drawer-title">Update Employee</h3>
            <button className="drawer-close" onClick={() => setOpenUpdate(false)}>×</button>

            <div className="drawer-form">
              <label className="drawer-label">Employee ID</label>
              <input name="empid" className="drawer-input" value={updateForm.empid || updateForm.employee_id || ""} onChange={handleUpdateChange} />

              <label className="drawer-label">Name</label>
              <input name="name" className="drawer-input" value={updateForm.name || ""} onChange={handleUpdateChange} />

              <label className="drawer-label">Department</label>
              <select name="department" className="drawer-input" value={updateForm.department || ""} onChange={handleUpdateChange}>
                <option value="">Select Department</option>
                {departments.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
              </select>

              <label className="drawer-label">Role</label>
              <input name="role" className="drawer-input" value={updateForm.role || ""} onChange={handleUpdateChange} />

              <label className="drawer-label">Email</label>
              <input name="email" className="drawer-input" value={updateForm.email || ""} onChange={handleUpdateChange} />

              <label className="drawer-label">Phone</label>
              <input name="phone" className="drawer-input" value={updateForm.phone || ""} onChange={handleUpdateChange} />

              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button className="drawer-save" onClick={handleUpdateSubmit} disabled={updating}>
                  {updating ? "Saving..." : "Save Changes"}
                </button>

                <button className="drawer-delete" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : <><FiTrash2 /> Delete</>}
                </button>

                <button className="drawer-cancel" onClick={() => setOpenUpdate(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
