import { buildUrl } from "./firebase";

// ----------------------
// GET: Issue List
// ----------------------
export const getIssueList = async () => {
  try {
    const response = await fetch(buildUrl("issuetrackerlist"));
    return await response.json();
  } catch (error) {
    console.error("Error fetching issue list:", error);
    return null;
  }
};

// ----------------------
// POST: Add Issue
// ----------------------
export const addIssue = async (data) => {
  try {
    const response = await fetch(buildUrl("issuetrackerlist"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error adding issue:", error);
    return null;
  }
};

// ----------------------
// PUT: Update Issue (by index)
// ----------------------
export const updateIssue = async (index, data) => {
  try {
    const response = await fetch(buildUrl(`issuetrackerlist/${index}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating issue:", error);
    return null;
  }
};
