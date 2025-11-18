import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";

import EmployeeList from "./pages/Employee/EmployeeList";

import IssueList from "./pages/Issue/IssueList";
import IssueCreate from "./pages/Issue/IssueCreate";
import IssueUpdate from "./pages/Issue/IssueUpdate";

import SprintList from "./pages/Sprint/SprintList";
import SprintCreate from "./pages/Sprint/SprintCreate";
import SprintUpdate from "./pages/Sprint/SprintUpdate";

import Signin from "./pages/Login/Signin";
import Signup from "./pages/Login/Signup";

import MainLayout from "./layouts/MainLayout";

import "./styles/ux-overrides.css";
import "./App.css";

// 🔐 Basic auth check
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

// 🔐 Role-based check for manager-only routes
const ManagerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "manager") return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* Public */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard — universal */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout title="Dashboard">
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Employees — Manager only */}
        <Route
          path="/employees"
          element={
            <ManagerRoute>
              <MainLayout title="Employees">
                <EmployeeList />
              </MainLayout>
            </ManagerRoute>
          }
        />

        {/* Issues */}
        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <MainLayout title="Issues">
                <IssueList />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Issue Create – Manager Only */}
        <Route
          path="/issues/create"
          element={
            <ManagerRoute>
              <MainLayout title="Create Issue">
                <IssueCreate />
              </MainLayout>
            </ManagerRoute>
          }
        />

        {/* Issue Update – Manager Only */}
        <Route
          path="/issues/update/:index"
          element={
            <ManagerRoute>
              <MainLayout title="Update Issue">
                <IssueUpdate />
              </MainLayout>
            </ManagerRoute>
          }
        />

        {/* Sprints */}
        <Route
          path="/sprints"
          element={
            <ProtectedRoute>
              <MainLayout title="Sprints">
                <SprintList />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Sprint Create – Manager Only */}
        <Route
          path="/sprints/create"
          element={
            <ManagerRoute>
              <MainLayout title="Create Sprint">
                <SprintCreate />
              </MainLayout>
            </ManagerRoute>
          }
        />

        {/* Sprint Update – Manager Only */}
        <Route
          path="/sprints/update/:index"
          element={
            <ManagerRoute>
              <MainLayout title="Update Sprint">
                <SprintUpdate />
              </MainLayout>
            </ManagerRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
