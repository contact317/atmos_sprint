import React from "react";
import "./Modal.css";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
