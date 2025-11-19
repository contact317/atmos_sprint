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

    const data = await getEmployeeList();

    const employees = data
      ? Object.entries(data).map(([key, val]) => ({ key, ...val }))
      : [];

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

    localStorage.setItem("authUser", JSON.stringify(user));
    console.log("AUTH USER STORED:", user);
    window.location.href = "/dashboard";
  };

return (
  <div
    className="signin-container"
    style={{ backgroundImage: 'url("/background.jpg")' }}
  >
    <div className="signin-card">
      <img src="/logo_atmos.png" alt="Logo" className="signin-logo" />

      <form onSubmit={handleSignin}>
        <h2>Login</h2>

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

        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
);

}
