import React, { useState } from "react";
import { addEmployee } from "../../api/employeeApi";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    empid: "",
    name: "",
    email: "",
    department: "",
    role: "employee",
    password: ""
  });

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    const res = await addEmployee(form);

    if (!res) {
      setErr("Signup failed. Try again.");
      return;
    }

    setSuccess("Account created successfully!");
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Employee ID"
          value={form.empid}
          onChange={(e) =>
            setForm({ ...form, empid: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Department"
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
          required
        />

        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        {err && <div className="error">{err}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
