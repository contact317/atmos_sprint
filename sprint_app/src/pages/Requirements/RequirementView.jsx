import React from "react";
import "./RequirementView.css";
import { X, FileText, Paperclip } from "lucide-react";

/**
 * View shows ALL fields (R-FULL) in sprint stacked style.
 * Activity log sorted oldest -> newest (ascending) as requested.
 * Comments shown in compact style. No comment input box.
 */
export default function RequirementView({ data = {}, onClose }) {
  const fields = {
    applicationName: data.applicationName,
    title: data.title,
    assignedEmployee: data.assignedEmployee,
    department: data.department,
    priority: data.priority,
    status: data.status,
    startDate: data.startDate,
    dueDate: data.dueDate,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    purpose: data.purpose || data.description || "",
    attachments: Array.isArray(data.attachments) ? data.attachments : (data.attachments ? data.attachments : []),
    activity_log: data.activity_log || {},
    comments: data.comments || {},
  };

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  const activityEntries = Object.entries(fields.activity_log || {}).map(([k, v]) => ({ id: k, ...v }));
  // User requested NO newest-first; show oldest -> newest (ascending)
  activityEntries.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  const commentEntries = Object.entries(fields.comments || {}).map(([k, v]) => ({ id: k, ...v }));
  // keep ascending as well
  commentEntries.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  return (
    <div className="rm-drawer-overlay">
      <div className="rm-drawer">
        <div className="rm-drawer-header">
          <h3 className="rm-drawer-title">Requirement Details</h3>
          <button className="rm-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="rm-drawer-body">
          <div className="rm-detail-card">
            <div className="rm-detail-row">
              <div className="rm-label">ApplicationName</div>
              <div className="rm-value">{fields.applicationName || "-"}</div>
            </div>

            <div className="rm-detail-row">
              <div className="rm-label">Title</div>
              <div className="rm-value">{fields.title || "-"}</div>
            </div>

            <div className="rm-detail-row">
              <div className="rm-label">AssignedEmployee</div>
              <div className="rm-value">{fields.assignedEmployee || "-"}</div>
            </div>

            <div className="rm-detail-row">
              <div className="rm-label">Department</div>
              <div className="rm-value">{fields.department || "-"}</div>
            </div>

            <div className="rm-detail-row">
              <div className="rm-label">Priority</div>
              <div className="rm-value">{fields.priority || "-"}</div>
            </div>

            <div className="rm-detail-row">
              <div className="rm-label">Status</div>
              <div className="rm-value">{fields.status || "-"}</div>
            </div>

            <div className="rm-detail-row">
              <div className="rm-label">StartDate</div>
              <div className="rm-value">{fields.startDate ? new Date(fields.startDate).toLocaleDateString() : "-"}</div>
            </div>

            <div className="rm-detail-row">
              <div className="rm-label">DueDate</div>
              <div className="rm-value">{fields.dueDate ? new Date(fields.dueDate).toLocaleDateString() : "-"}</div>
            </div>

            <div className="rm-detail-row">
              <div className="rm-label">CreatedAt</div>
              <div className="rm-value">{fields.createdAt ? formatDate(fields.createdAt) : "-"}</div>
            </div>

            <div className="rm-detail-row">
              <div className="rm-label">UpdatedAt</div>
              <div className="rm-value">{fields.updatedAt ? formatDate(fields.updatedAt) : "-"}</div>
            </div>
          </div>

          <div className="rm-desc-card">
            <div className="rm-desc-title">Purpose</div>
            <div className="rm-desc-content">{fields.purpose || "-"}</div>
          </div>

          <div className="rm-attachments-card">
            <div className="rm-section-title"><Paperclip size={14} style={{ marginRight: 6 }} /> Attachments</div>
            <div className="rm-attachments-list">
              {fields.attachments && fields.attachments.length > 0 ? (
                fields.attachments.map((att, i) => (
                  <div key={i} className="rm-attachment-row">
                    <a className="rm-attachment-link" href={att.url} target="_blank" rel="noreferrer">
                      <FileText size={14} style={{ marginRight: 8 }} />
                      {att.name || att.url}
                    </a>
                  </div>
                ))
              ) : (
                <div className="muted">No attachments</div>
              )}
            </div>
          </div>

          <div className="rm-activity-card">
            <div className="rm-section-title">Activity Log</div>
            <div className="rm-activity-list">
              {activityEntries.length === 0 ? (
                <div className="muted">No activity</div>
              ) : (
                activityEntries.map((it) => (
                  <div key={it.id} className="rm-activity-row">
                    <div className="rm-activity-time">{it.timestamp ? new Date(it.timestamp).toLocaleString() : "-"}</div>
                    <div className="rm-activity-text"><strong>{it.commentedBy || "system"}</strong>: {it.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rm-comments-card">
            <div className="rm-section-title">Comments</div>
            <div className="rm-comments-list">
              {commentEntries.length === 0 ? (
                <div className="muted">No comments</div>
              ) : (
                commentEntries.map((c) => (
                  <div key={c.id} className="rm-comment-row">
                    <div className="rm-comment-meta">
                      <span className="rm-comment-user">{c.commentedBy || "user"}</span>
                      <span className="rm-comment-time">{c.timestamp ? new Date(c.timestamp).toLocaleString() : ""}</span>
                    </div>
                    <div className="rm-comment-text">{c.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
