import React from "react";
import "./StatCard.css";

export default function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  );
}
