import React, { useState, useEffect, useRef } from "react";
import { Menu, Bell, UserCircle, Users, Mail, Globe, User, Grip } from "lucide-react";

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

export default function TopBar({ title, onToggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", newpwd: "", confirm: "" });
  const [statusMsg, setStatusMsg] = useState("");
  const navigate = useNavigate();
  const ref = useRef();
  const appsRef = useRef();

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

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowDetails(false);
        setShowChangePwd(false);
      }
      if (appsRef.current && !appsRef.current.contains(e.target)) {
        setAppsOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/signin");
  };

  const openEmployees = () => {
    setAppsOpen(false);
    navigate("/employees");
  };

  const openOutlook = () => {
    window.open("https://outlook.office.com", "_blank");
  };

  const openTeams = () => {
    window.open("https://teams.microsoft.com", "_blank");
  };

  const openPortal = () => {
    window.open("/", "_blank");
  };

  // new app openers
  const openPazy = () => {
    window.open("https://app.pazy.io/login?n=L3BheW1lbnRzL292ZXJ2aWV3", "_blank");
  };

  const openMcube = () => {
    window.open("https://mcube.vmctechnologies.com/site/login", "_blank");
  };

  const openSalesforce = () => {
    window.open("https://www.salesforce.com/in/?ir=1", "_blank");
  };

  const openPropflo = () => {
    window.open("https://atmos.propflo.ai/", "_blank");
  };

  const openStar = () => {
    window.open("https://office.atmoslifestyle.in/prod/atmosstar/", "_blank");
  };

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
      const all = await getEmployeeList();
      const list = all ? Object.entries(all) : [];

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
      const updated = { ...recordValue, password: pwdForm.newpwd };

      await updateEmployee(recordKey, updated);

      setStatusMsg("Password updated successfully.");
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
          <Menu size={24} strokeWidth={1.8} />
        </button>

        <div className="topbar-title">{title}</div>
      </div>

      <div className="topbar-right">

        {/* ===== Notifications ===== */}
        <button
          className="icon-btn"
          aria-label="notifications"
          title="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <Bell size={20} strokeWidth={1.8} color="#4f755a" />
        </button>

        {/* ===== Profile ===== */}
        <div className="profile-root" ref={ref}>
          <button
            className="icon-btn profile-circle"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="true"
            title="Profile menu"
          >
            <UserCircle size={22} strokeWidth={1.8} color="#4f755a" />
          </button>

          {open && (
            <div className="profile-menu" role="menu" aria-label="Profile menu">
              <div className="profile-header">
                <div className="profile-avatar">
                  <UserCircle size={36} strokeWidth={1.8} color="#4f755a" />
                </div>

                <div className="profile-meta">
                  <div className="profile-name">{displayName}</div>
                  <div className="profile-sub">{displayRole} • {displayDept}</div>
                </div>
              </div>

              <div className="profile-divider" />

              <div className="profile-actions">
                <button
                  className="profile-action"
                  onClick={() => { setShowDetails(true); setShowChangePwd(false); }}
                >
                  <span className="profile-action-left">Details</span>
                </button>

                <button
                  className="profile-action"
                  onClick={() => { setShowChangePwd(true); setShowDetails(false); }}
                >
                  <span className="profile-action-left">Settings (Change Password)</span>
                </button>
              </div>

              <div className="profile-divider" />

              <div style={{ padding: "10px" }}>
                <button className="logout-btn" onClick={handleLogout}>
                  ⟲ Logout
                </button>
              </div>

              {showDetails && (
                <div className="profile-details">
                  <div className="detail-row"><strong>Name:</strong> <span>{displayName}</span></div>
                  <div className="detail-row"><strong>Emp ID:</strong> <span>{empId || "-"}</span></div>
                  <div className="detail-row"><strong>Role:</strong> <span>{displayRole}</span></div>
                  <div className="detail-row"><strong>Department:</strong> <span>{displayDept}</span></div>
                </div>
              )}

              {showChangePwd && (
                <div className="change-pwd-panel">
                  <label className="pwd-label">Current Password</label>
                  <input
                    type="password"
                    value={pwdForm.current}
                    onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                    className="pwd-input"
                  />

                  <label className="pwd-label">New Password</label>
                  <input
                    type="password"
                    value={pwdForm.newpwd}
                    onChange={(e) => setPwdForm({ ...pwdForm, newpwd: e.target.value })}
                    className="pwd-input"
                  />

                  <label className="pwd-label">Confirm New Password</label>
                  <input
                    type="password"
                    value={pwdForm.confirm}
                    onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                    className="pwd-input"
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

        {/* ===== Apps Launcher (Grip LAST) ===== */}
        <div className="apps-root" ref={appsRef} style={{ position: "relative" }}>
          <button
            className="icon-btn"
            aria-label="apps"
            title="Apps"
            onClick={() => setAppsOpen((v) => !v)}
          >
            <Grip size={20} strokeWidth={1.8} color="#4f755a" />
          </button>

          {appsOpen && (
            <div
              className="apps-menu"
              role="menu"
              aria-label="Apps menu"
              style={{
                position: "absolute",
                right: 0,
                top: 44,
                width: 360,
                background: "#ffffff",
                borderRadius: 12,
                boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
                padding: 14,
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14 }}>Apps</div>
                <div style={{ fontSize: 12, color: "#666" }}>{displayName}</div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                }}
              >
                <button className="app-tile" onClick={openTeams} title="Teams" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer"
                }}>
                  <Users size={20} strokeWidth={1.6} stroke="#4f755a" />
                  <div style={{ marginTop: 6, fontSize: 12 }}>Teams</div>
                </button>

                <button className="app-tile" onClick={openOutlook} title="Outlook" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer"
                }}>
                  <Mail size={20} strokeWidth={1.6} stroke="#4f755a" />
                  <div style={{ marginTop: 6, fontSize: 12 }}>Outlook</div>
                </button>

                <button className="app-tile" onClick={openPortal} title="Portal" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer"
                }}>
                  <Globe size={20} strokeWidth={1.6} stroke="#4f755a" />
                  <div style={{ marginTop: 6, fontSize: 12 }}>Portal</div>
                </button>

                <button className="app-tile" onClick={openEmployees} title="Employees" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer"
                }}>
                  <User size={20} strokeWidth={1.6} stroke="#4f755a" />
                  <div style={{ marginTop: 6, fontSize: 12 }}>Employees</div>
                </button>

                {/* New requested apps */}
                <button className="app-tile" onClick={openPazy} title="Pazy" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer"
                }}>
                  <Users size={20} strokeWidth={1.6} stroke="#4f755a" />
                  <div style={{ marginTop: 6, fontSize: 12 }}>Pazy</div>
                </button>

                <button className="app-tile" onClick={openMcube} title="Mcube" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer"
                }}>
                  <Globe size={20} strokeWidth={1.6} stroke="#4f755a" />
                  <div style={{ marginTop: 6, fontSize: 12 }}>Mcube</div>
                </button>

                <button className="app-tile" onClick={openSalesforce} title="SalesForce" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer"
                }}>
                  <Mail size={20} strokeWidth={1.6} stroke="#4f755a" />
                  <div style={{ marginTop: 6, fontSize: 12 }}>SalesForce</div>
                </button>

                <button className="app-tile" onClick={openPropflo} title="Propflo" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer"
                }}>
                  <Globe size={20} strokeWidth={1.6} stroke="#4f755a" />
                  <div style={{ marginTop: 6, fontSize: 12 }}>Propflo</div>
                </button>

                <button className="app-tile" onClick={openStar} title="Star" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  cursor: "pointer"
                }}>
                  <Users size={20} strokeWidth={1.6} stroke="#4f755a" />
                  <div style={{ marginTop: 6, fontSize: 12 }}>Star</div>
                </button>

                <div style={{ gridColumn: "span 3", marginTop: 6, fontSize: 12, color: "#666" }}>
                  {/* reserved footer row if needed */}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
