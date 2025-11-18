import React from "react";
import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineExclamationCircle,
  HiOutlineCog
} from "react-icons/hi";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ collapsed }) {
  // ⭐ Get logged in user
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const isEmployee = authUser?.role === "employee";

  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-inner">
        <div className="logo">{collapsed ? "A" : "ATMOS"}</div>

        <nav className="menu">

          {/* DASHBOARD */}
          <NavLink to="/dashboard" className="menu-item">
            <HiOutlineHome size={20} />
            <span className="label">Dashboard</span>
          </NavLink>

          {/* SPRINTS — visible to ALL */}
          <NavLink to="/sprints" className="menu-item">
            <HiOutlineClipboardList size={20} />
            <span className="label">
              {isEmployee ? "My Sprints" : "Sprints"}
            </span>
          </NavLink>

          {/* ISSUES — visible to ALL */}
          <NavLink to="/issues" className="menu-item">
            <HiOutlineExclamationCircle size={20} />
            <span className="label">
              {isEmployee ? "My Issues" : "Issues"}
            </span>
          </NavLink>

          {/* SETTINGS — manager only (optional) */}
          {!isEmployee && (
            <NavLink to="/settings" className="menu-item">
              <HiOutlineCog size={20} />
              <span className="label">Settings</span>
            </NavLink>
          )}

        </nav>
      </div>
    </aside>
  );
}
