import { buildUrl } from "./firebase";

// ----------------------
// GET: Department List
// ----------------------
export const getDepartmentList = async () => {
  try {
    const response = await fetch(buildUrl("departmentlist"));
    return await response.json();
  } catch (error) {
    console.error("Error fetching department list:", error);
    return null;
  }
};
