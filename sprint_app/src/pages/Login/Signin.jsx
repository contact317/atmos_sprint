import React, { useState } from "react";
import { getEmployeeList } from "../../api/employeeApi";
import "./Signin.css";

export default function Signin() {
  const [empid, setEmpid] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    setErr("");

    // Load all employees from Firebase
    const data = await getEmployeeList();
    const employees = data ? Object.values(data) : [];

    // Find matching user
    const user = employees.find(
      (u) =>
        String(u.empid).toLowerCase() === String(empid).toLowerCase()
    );

    if (!user) {
      setErr("Employee ID not found");
      return;
    }

    if (user.password !== password) {
      setErr("Incorrect password");
      return;
    }

    // Save logged in user
localStorage.setItem("authUser", JSON.stringify(user));
console.log("AUTH USER STORED:", user);  // LOG TO CHECK
window.location.href = "/dashboard";

  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSignin}>
        <h2>Sign In</h2>

        <input
          type="text"
          placeholder="Employee ID"
          value={empid}
          onChange={(e) => setEmpid(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && <div className="error">{err}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
