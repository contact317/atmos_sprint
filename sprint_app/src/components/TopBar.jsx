import React, { useState, useEffect, useRef } from "react";
import {
  HiOutlineBell,
  HiOutlineUserCircle,
  HiOutlineMenu,
  HiOutlineMail,
  HiOutlineGlobeAlt,
  HiOutlineUsers,
} from "react-icons/hi";
import { FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TopBar.css";

import { getEmployeeList, updateEmployee } from "../api/employeeApi";

/**
 * TopBar (premium profile dropdown)
 *
 * - Option B style (Teams / Outlook / Portal / Employee icons)
 * - Shows logged in user's name, department and role (from localStorage.authUser)
 * - "Employee" icon routes to /employees (uses useNavigate)
 * - Settings -> Change Password uses employeeApi to update password
 * - Details shows a small details panel inside dropdown
 *
 * NOTE: This component only updates UI and uses existing APIs. No other app logic changed.
 */

export default function TopBar({ title, onToggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", newpwd: "", confirm: "" });
  const [statusMsg, setStatusMsg] = useState("");
  const navigate = useNavigate();
  const ref = useRef();

  // user from localStorage
  const authUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("authUser")) || {};
    } catch (e) {
      return {};
    }
  })();

  const displayName = authUser.name || authUser.username || authUser.empid || "User";
  const displayRole = authUser.role || "-";
  const displayDept = authUser.department || authUser.dept || "-";
  const empId = authUser.empid || authUser.employee_id || authUser.empId || null;

  // close dropdown when clicked outside
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowDetails(false);
        setShowChangePwd(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/signin");
  };

  // navigate helpers
  const openEmployees = () => {
    setOpen(false);
    navigate("/employees");
  };

  const openOutlook = () => {
    // if you have a URL you can replace this
    window.open("https://outlook.office.com", "_blank");
  };

  const openTeams = () => {
    window.open("https://teams.microsoft.com", "_blank");
  };

  const openPortal = () => {
    // replace with internal portal URL if any
    window.open("/", "_blank");
  };

  // Change password flow:
  // 1. Fetch employee list, find the record for logged user (match empid)
  // 2. Call updateEmployee(key, updatedRecordWithNewPassword)
  const handlePwdChange = async () => {
    setStatusMsg("");
    if (!empId) {
      setStatusMsg("No employee id found in auth. Cannot change password.");
      return;
    }
    if (!pwdForm.current || !pwdForm.newpwd || !pwdForm.confirm) {
      setStatusMsg("Please fill all fields.");
      return;
    }
    if (pwdForm.newpwd !== pwdForm.confirm) {
      setStatusMsg("New password and confirm do not match.");
      return;
    }

    try {
      // get all employees and find the correct entry
      const all = await getEmployeeList();
      const list = all ? Object.entries(all) : []; // entries => [key, value]
      // try different possible id keys inside employee object
      const foundEntry = list.find(([key, val]) => {
        const v = val || {};
        const candidateIds = [v.empid, v.employee_id, v.employeeId, v.empId, v.id];
        return candidateIds.some((c) => String(c) === String(empId));
      });

      if (!foundEntry) {
        setStatusMsg("Employee record not found.");
        return;
      }

      const [recordKey, recordValue] = foundEntry;
      // prepare updated object: preserve existing fields, update password
      const updated = { ...recordValue, password: pwdForm.newpwd };

      // call API — updateEmployee expects index/key
      await updateEmployee(recordKey, updated);

      setStatusMsg("Password updated successfully.");
      // clear form and close
      setPwdForm({ current: "", newpwd: "", confirm: "" });
      setShowChangePwd(false);
      setOpen(false);
    } catch (err) {
      console.error("Change password error:", err);
      setStatusMsg("Failed to update password. See console for details.");
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-btn"
          onClick={onToggleSidebar}
          aria-label="toggle menu"
          title="Toggle menu"
        >
          <HiOutlineMenu size={24} />
        </button>
      <div className="topbar-title">{title}</div>

      </div>

      <div className="topbar-right">
        <button
          className="icon-btn"
          aria-label="notifications"
          title="Notifications"
          onClick={() => {
            // You can later open a notification panel — for now toggle a simple toast
            navigate("/notifications", { replace: false });
          }}
        >
          <HiOutlineBell size={20} color="#4f755a" />
        </button>

        <div className="profile-root" ref={ref}>
          <button
            className="icon-btn profile-circle"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="true"
            title="Profile menu"
          >
            <HiOutlineUserCircle size={22} color="#4f755a" />
          </button>

          {open && (
            <div className="profile-menu" role="menu" aria-label="Profile menu">
              {/* ICON ROW */}
              <div className="profile-icon-row">
                <button
                  className="small-icon"
                  title="Teams"
                  onClick={openTeams}
                >
                  <HiOutlineUsers size={20} />
                  <div className="small-icon-label">Teams</div>
                </button>

                <button
                  className="small-icon"
                  title="Outlook"
                  onClick={openOutlook}
                >
                  <HiOutlineMail size={20} />
                  <div className="small-icon-label">Outlook</div>
                </button>

                <button
                  className="small-icon"
                  title="Portal"
                  onClick={openPortal}
                >
                  <HiOutlineGlobeAlt size={20} />
                  <div className="small-icon-label">Portal</div>
                </button>

                <button
                  className="small-icon"
                  title="Employees"
                  onClick={openEmployees}
                >
                  <FaUserTie size={20} />
                  <div className="small-icon-label">Employees</div>
                </button>
              </div>

              <div className="profile-divider" />

              {/* PROFILE HEADER */}
              <div className="profile-header">
                <div className="profile-avatar">
                  <HiOutlineUserCircle size={36} color="#4f755a" />
                </div>

                <div className="profile-meta">
                  <div className="profile-name">{displayName}</div>
                  <div className="profile-sub">
                    {displayRole} • {displayDept}
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button
                  className="profile-action"
                  onClick={() => {
                    setShowDetails(true);
                    setShowChangePwd(false);
                  }}
                >
                  <span className="profile-action-left">Details</span>
                </button>

                <button
                  className="profile-action"
                  onClick={() => {
                    setShowChangePwd(true);
                    setShowDetails(false);
                  }}
                >
                  <span className="profile-action-left">Settings (Change Password)</span>
                </button>
              </div>

              <div className="profile-divider" />

              <div style={{ padding: "10px" }}>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  ⟲ Logout
                </button>
              </div>

              {/* DETAILS PANEL (inline) */}
              {showDetails && (
                <div className="profile-details">
                  <div className="detail-row"><strong>Name:</strong> <span>{displayName}</span></div>
                  <div className="detail-row"><strong>Emp ID:</strong> <span>{empId || "-"}</span></div>
                  <div className="detail-row"><strong>Role:</strong> <span>{displayRole}</span></div>
                  <div className="detail-row"><strong>Department:</strong> <span>{displayDept}</span></div>
                </div>
              )}

              {/* CHANGE PASSWORD PANEL (inline) */}
              {showChangePwd && (
                <div className="change-pwd-panel">
                  <label className="pwd-label">Current Password</label>
                  <input
                    type="password"
                    value={pwdForm.current}
                    onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                    className="pwd-input"
                    placeholder="Enter current password"
                  />
                  <label className="pwd-label">New Password</label>
                  <input
                    type="password"
                    value={pwdForm.newpwd}
                    onChange={(e) => setPwdForm({ ...pwdForm, newpwd: e.target.value })}
                    className="pwd-input"
                    placeholder="Enter new password"
                  />
                  <label className="pwd-label">Confirm New Password</label>
                  <input
                    type="password"
                    value={pwdForm.confirm}
                    onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                    className="pwd-input"
                    placeholder="Confirm new password"
                  />

                  {statusMsg && <div className="pwd-status">{statusMsg}</div>}

                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="pwd-save" onClick={handlePwdChange}>Save</button>
                    <button className="pwd-cancel" onClick={() => setShowChangePwd(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
