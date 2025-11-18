import React from "react";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
}
