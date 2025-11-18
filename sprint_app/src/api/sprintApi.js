import { buildUrl } from "./firebase";

// ----------------------
// GET: Sprint List
// ----------------------
export const getSprintList = async () => {
  try {
    const response = await fetch(buildUrl("sprintlist"));
    return await response.json();
  } catch (error) {
    console.error("Error fetching sprint list:", error);
    return null;
  }
};

// ----------------------
// POST: Add Sprint
// ----------------------
export const addSprint = async (data) => {
  try {
    const response = await fetch(buildUrl("sprintlist"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error adding sprint:", error);
    return null;
  }
};

// ----------------------
// PUT: Update Sprint (by index)
// ----------------------
export const updateSprint = async (index, data) => {
  try {
    const response = await fetch(buildUrl(`sprintlist/${index}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating sprint:", error);
    return null;
  }
};
