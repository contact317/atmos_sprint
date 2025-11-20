import React, { useState } from "react";
import { addRequirement } from "../../api/requirementApi";
import "./Requirements.css";

export default function RequirementCreate({ data, onClose }) {
  const isEdit = Boolean(data);
  const [form, setForm] = useState({
    title: data?.title || "",
    purpose: data?.purpose || "",
    overview: data?.overview || "",
    department: data?.department || "",
    attachments: data?.attachments || [],
    priority: data?.priority || "Medium",
    status: data?.status || "Not Started"
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const obj = { name: f.name, type: f.type, url: URL.createObjectURL(f) };
    setForm((prev) => ({ ...prev, attachments: [...(prev.attachments||[]), obj] }));
  };

  const handleAddUrl = () => {
    const url = prompt("Enter URL to attach:");
    if (url) setForm((prev) => ({ ...prev, attachments: [...(prev.attachments||[]), { name: url, type: "url", url }] }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.purpose || !form.overview || !form.department) {
      return alert("Please fill Title, Purpose, Overview and Department.");
    }
    const payload = { ...form, createdAt: new Date().toISOString(), id: data?.id || undefined };
    await addRequirement(payload);
    alert(isEdit ? "Requirement updated" : "Requirement created");
    if (typeof onClose === "function") onClose(true);
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={() => onClose(false)}></div>
      <aside className="sprint-panel open" aria-labelledby="create-requirement">
        <div className="panel-head">
          <h3 id="create-requirement" className="panel-title">{isEdit ? "Edit Requirement" : "Create Requirement"}</h3>
          <button className="drawer-close" onClick={() => onClose(false)}>×</button>
        </div>

        <div className="panel-body">
          <form className="update-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

            <div className="form-row">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Purpose (20-30 chars recommended)</label>
              <input name="purpose" value={form.purpose} onChange={handleChange} maxLength={200} />
            </div>

            <div className="form-row">
              <label>Overview</label>
              <textarea name="overview" value={form.overview} onChange={handleChange} rows={5} />
            </div>

            <div className="form-row">
              <label>Department</label>
              <input name="department" value={form.department} onChange={handleChange} placeholder="Department name" />
            </div>

            <div className="form-row">
              <label>Attachments (pdf / docs / url)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="file" onChange={handleFile} />
                <button type="button" onClick={handleAddUrl}>Add URL</button>
              </div>
              <div style={{ marginTop: 8 }}>
                {(form.attachments || []).map((a, idx) => (
                  <div key={idx} style={{ fontSize: 13 }}>
                    • {a.name} {a.type === "url" ? <a href={a.url} target="_blank" rel="noreferrer"> (open)</a> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row two-cols">
              <div>
                <label>Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Save Requirement</button>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
}
