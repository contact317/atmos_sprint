// src/api/requirementApi.js
import { BASE_URL } from "./firebase";

// ------------------------------
// FALLBACK LOCAL STORAGE READ
// ------------------------------
function fallbackReadLocal() {
  try {
    const raw = localStorage.getItem("requirements_local") || "{}";
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Local read failed", err);
    return {};
  }
}

// ------------------------------
// FALLBACK LOCAL STORAGE WRITE
// ------------------------------
function fallbackWriteLocal(data) {
  try {
    localStorage.setItem("requirements_local", JSON.stringify(data));
  } catch (err) {
    console.warn("Local write failed", err);
  }
}

// ============================================================
//  GET REQUIREMENT LIST
//  Firebase Path MUST MATCH: /requirement_list
// ============================================================
export async function getRequirementList() {
  if (BASE_URL) {
    try {
      const url = `${BASE_URL.replace(/\/$/, "")}/requirement_list.json`;
      const resp = await fetch(url);

      if (!resp.ok) throw new Error("Failed to fetch requirements");

      const data = await resp.json();
      return data || {};
    } catch (err) {
      console.warn("getRequirementList backend failed:", err);
    }
  }

  return fallbackReadLocal();
}

// ============================================================
//  CREATE REQUIREMENT
//  POST → /requirement_list.json
// ============================================================
export async function addRequirement(payload) {
  if (BASE_URL) {
    try {
      const url = `${BASE_URL.replace(/\/$/, "")}/requirement_list.json`;

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error("Failed to save requirement");

      const data = await resp.json(); // Firebase returns { name: "generatedKey" }

      // Save in fallback
      const localData = fallbackReadLocal();
      localData[data.name] = payload;
      fallbackWriteLocal(localData);

      return data;
    } catch (err) {
      console.warn("addRequirement failed:", err);
    }
  }

  // Offline fallback
  const local = fallbackReadLocal();
  const newKey = "local_" + Date.now();
  local[newKey] = payload;
  fallbackWriteLocal(local);
  return { name: newKey };
}

// ============================================================
//  UPDATE REQUIREMENT
//  PUT → /requirement_list/<id>.json
// ============================================================
export async function updateRequirement(id, payload) {
  if (!id) throw new Error("updateRequirement requires an ID");

  if (BASE_URL) {
    try {
      const url = `${BASE_URL.replace(/\/$/, "")}/requirement_list/${id}.json`;

      const resp = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error("Failed to update requirement");

      const data = await resp.json();

      // Update fallback
      const localData = fallbackReadLocal();
      localData[id] = payload;
      fallbackWriteLocal(localData);

      return data;
    } catch (err) {
      console.warn("updateRequirement failed:", err);
    }
  }

  // Offline fallback
  const local = fallbackReadLocal();
  local[id] = payload;
  fallbackWriteLocal(local);
  return payload;
}

// ============================================================
//  DELETE REQUIREMENT
//  DELETE → /requirement_list/<id>.json
// ============================================================
export async function deleteRequirement(id) {
  if (!id) return;

  if (BASE_URL) {
    try {
      const url = `${BASE_URL.replace(/\/$/, "")}/requirement_list/${id}.json`;
      await fetch(url, { method: "DELETE" });

      const local = fallbackReadLocal();
      delete local[id];
      fallbackWriteLocal(local);

      return true;
    } catch (err) {
      console.warn("deleteRequirement failed:", err);
    }
  }

  // fallback
  const local = fallbackReadLocal();
  delete local[id];
  fallbackWriteLocal(local);
  return true;
}
