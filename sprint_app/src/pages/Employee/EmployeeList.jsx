import React, { useEffect, useState } from "react";
import { getEmployeeList, addEmployee, updateEmployee, /* optional */ deleteEmployee } from "../../api/employeeApi";
import { getDepartmentList } from "../../api/departmentApi";
import "./EmployeeList.css";
import "./EmployeeCreate.css";

import { FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

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

  const [updateKey, setUpdateKey] = useState(null);
  const [updateForm, setUpdateForm] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [departments, setDepartments] = useState([]);

  const [nameSort, setNameSort] = useState("none");
  const [deptSort, setDeptSort] = useState("none");

  const [showUpdatePwd, setShowUpdatePwd] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployeeList();
      if (data && typeof data === "object") {
        const arr = Object.entries(data).map(([key, val]) => {
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
        const uniqueOrdered = Array.from(new Set(d)).sort((a, b) =>
          String(a).localeCompare(String(b))
        );
        setDepartments(uniqueOrdered);
      } else {
        setDepartments([]);
      }
    } catch (err) {
      console.warn("Failed to load departments", err);
      setDepartments([]);
    }
  };

  const handleCreateChange = (e) =>
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });

  const handleCreateSubmit = async () => {
    if (
      !createForm.empid ||
      !createForm.name ||
      !createForm.department ||
      !createForm.role ||
      !createForm.email ||
      !createForm.phone ||
      !createForm.password
    ) {
      return alert("Please fill all required fields.");
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

  const openUpdateDrawer = (indexOrKey, record) => {
    setUpdateKey(indexOrKey);
    setUpdateForm({ ...record });
    setShowUpdatePwd(false);
    setOpenUpdate(true);
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    if (!updateForm) return;
    setUpdating(true);
    try {
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
      if (typeof deleteEmployee === "function") {
        await deleteEmployee(updateKey);
      } else {
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

  const filtered = employees.filter((emp) =>
    (((emp.name || "") +
      " " +
      (emp.empid || "") +
      " " +
      (emp.role || "") +
      " " +
      (emp.department || ""))
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase()))
  );

  const sorted = (() => {
    let arr = filtered.slice();
    if (nameSort === "none" && deptSort === "none") {
      arr = arr.slice().reverse();
      return arr;
    }
    if (nameSort !== "none") {
      arr.sort((a, b) => {
        const na = (a.name || "").toLowerCase();
        const nb = (b.name || "").toLowerCase();
        if (nameSort === "asc") return na.localeCompare(nb);
        return nb.localeCompare(na);
      });
      return arr;
    }
    if (deptSort !== "none") {
      arr.sort((a, b) => {
        const da = (a.department || "").toLowerCase();
        const db = (b.department || "").toLowerCase();
        if (deptSort === "asc") return da.localeCompare(db);
        return db.localeCompare(da);
      });
      return arr;
    }
    return arr;
  })();

  const cycleSort = (field) => {
    if (field === "name") {
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

  const sortIcon = (state) => {
    if (state === "none") return "";
    if (state === "asc") return "▲";
    return "▼";
  };

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
                <th>Password</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No employees found</td>
                </tr>
              ) : (
                sorted.map((emp, i) => (
                  <tr key={emp.key || i}>
                    <td>{emp.name || "-"}</td>
                    <td>{emp.empid || emp.employee_id || "-"}</td>
                    <td>{emp.department || "-"}</td>
                    <td>{(emp.role || "-").toUpperCase()}</td>
                    <td>{emp.email || "-"}</td>
                    <td>{emp.phone || "-"}</td>
                    <td>{emp.password || "-"}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="icon-action edit-icon"
                        title="Edit employee"
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

      {/* -------------------- CREATE DRAWER -------------------- */}
      {openCreate && (
        <>
          <div className="global-drawer-backdrop"></div>

          <div className="employee-drawer open">
            <h3 className="drawer-title">Add Employee</h3>
            <button className="drawer-close" onClick={() => setOpenCreate(false)}>×</button>

            <div className="drawer-form">
              <label className="drawer-label">Employee ID *</label>
              <input name="empid" required className="drawer-input" value={createForm.empid} onChange={handleCreateChange} />

              <label className="drawer-label">Name *</label>
              <input name="name" required className="drawer-input" value={createForm.name} onChange={handleCreateChange} />

              <label className="drawer-label">Department *</label>
              <select name="department" required className="drawer-input" value={createForm.department} onChange={handleCreateChange}>
                <option value="">Select Department</option>
                {departments.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
              </select>

              <label className="drawer-label">Role *</label>
              <select name="role" required className="drawer-input" value={createForm.role} onChange={handleCreateChange}>
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>

              <label className="drawer-label">Email *</label>
              <input name="email" required className="drawer-input" value={createForm.email} onChange={handleCreateChange} />

              <label className="drawer-label">Phone *</label>
              <input name="phone" required className="drawer-input" value={createForm.phone} onChange={handleCreateChange} />

              <label className="drawer-label">Password *</label>
              <input name="password" required className="drawer-input" value={createForm.password} onChange={handleCreateChange} type="password" placeholder="Initial password" />

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

      {/* -------------------- UPDATE DRAWER -------------------- */}
      {openUpdate && updateForm && (
        <>
          <div className="global-drawer-backdrop"></div>

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
              <select name="role" className="drawer-input" value={updateForm.role || ""} onChange={handleUpdateChange}>
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>

              <label className="drawer-label">Email</label>
              <input name="email" className="drawer-input" value={updateForm.email || ""} onChange={handleUpdateChange} />

              <label className="drawer-label">Phone</label>
              <input name="phone" className="drawer-input" value={updateForm.phone || ""} onChange={handleUpdateChange} />

              <label className="drawer-label">Password</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  name="password"
                  className="drawer-input"
                  value={updateForm.password || ""}
                  onChange={handleUpdateChange}
                  type={showUpdatePwd ? "text" : "password"}
                  placeholder="Enter new password (optional)"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowUpdatePwd((v) => !v)}
                  title={showUpdatePwd ? "Hide password" : "Show password"}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 6,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {showUpdatePwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

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
