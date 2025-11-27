// src/pages/Requirements/RequirementCreate.jsx
import React, { useState } from "react";
import "./RequirementCreate.css";
import { X, Plus, Trash2 } from "lucide-react";
import { addRequirement } from "../../api/requirementApi";

export default function RequirementCreate({ onClose }) {
  const [form, setForm] = useState({
    applicationName: "",
    title: "",
    purpose: "",
    department: "",
    assignedEmployee: "",
    startDate: "",
    dueDate: "",
    priority: "Medium",
    status: "Not Started",
    attachments: [],
  });

  const [saving, setSaving] = useState(false);

  const change = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addAttachment = () => {
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, { name: "", url: "" }],
    }));
  };

  const updateAttachment = (i, key, value) => {
    const arr = [...form.attachments];
    arr[i][key] = value;
    change("attachments", arr);
  };

  const removeAttachment = (i) => {
    const arr = [...form.attachments];
    arr.splice(i, 1);
    change("attachments", arr);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await addRequirement(payload);
      setSaving(false);
      onClose(true);
    } catch (err) {
      console.error("Requirement create failed:", err);
      setSaving(false);
      onClose(false);
    }
  };

  return (
    <div className="req-overlay">
      <div className="req-drawer">
        <div className="req-header">
          <h3>Create Requirement</h3>
          <button className="close-btn" onClick={() => onClose(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="req-body">
          {/* Application */}
          <label className="req-label">Application Name</label>
          <input
            className="req-input"
            value={form.applicationName}
            onChange={(e) => change("applicationName", e.target.value)}
          />

          {/* Title */}
          <label className="req-label">Title</label>
          <input
            className="req-input"
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
          />

          {/* Purpose */}
          <label className="req-label">Purpose</label>
          <textarea
            className="req-textarea"
            rows={4}
            value={form.purpose}
            onChange={(e) => change("purpose", e.target.value)}
          />

          {/* Department */}
          <label className="req-label">Department</label>
          <input
            className="req-input"
            value={form.department}
            onChange={(e) => change("department", e.target.value)}
          />

          {/* Assign To */}
          <label className="req-label">Assigned Employee</label>
          <input
            className="req-input"
            value={form.assignedEmployee}
            onChange={(e) => change("assignedEmployee", e.target.value)}
          />

          {/* Dates */}
          <div className="req-row">
            <div className="req-col">
              <label className="req-label">Start Date</label>
              <input
                type="date"
                className="req-input"
                value={form.startDate}
                onChange={(e) => change("startDate", e.target.value)}
              />
            </div>

            <div className="req-col">
              <label className="req-label">Due Date</label>
              <input
                type="date"
                className="req-input"
                value={form.dueDate}
                onChange={(e) => change("dueDate", e.target.value)}
              />
            </div>
          </div>

          {/* Priority */}
          <label className="req-label">Priority</label>
          <select
            className="req-input"
            value={form.priority}
            onChange={(e) => change("priority", e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          {/* Status */}
          <label className="req-label">Status</label>
          <select
            className="req-input"
            value={form.status}
            onChange={(e) => change("status", e.target.value)}
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Pending Review</option>
          </select>

          {/* Attachments */}
          <label className="req-label attach-title">
            Attachments
            <button className="add-att-btn" onClick={addAttachment}>
              <Plus size={14} /> Add
            </button>
          </label>

          <div className="attachment-list">
            {form.attachments.map((att, i) => (
              <div key={i} className="att-row">
                <input
                  className="req-input att-input"
                  placeholder="File Name"
                  value={att.name}
                  onChange={(e) => updateAttachment(i, "name", e.target.value)}
                />

                <input
                  className="req-input att-input"
                  placeholder="File URL"
                  value={att.url}
                  onChange={(e) => updateAttachment(i, "url", e.target.value)}
                />

                <button className="del-att-btn" onClick={() => removeAttachment(i)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {form.attachments.length === 0 && (
              <p className="muted">No attachments</p>
            )}
          </div>
        </div>

        <div className="req-footer">
          <button className="req-btn-secondary" onClick={() => onClose(false)}>
            Cancel
          </button>
          <button className="req-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Creating..." : "Create Requirement"}
          </button>
        </div>
      </div>
    </div>
  );
}
