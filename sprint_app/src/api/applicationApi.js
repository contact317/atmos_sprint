import { buildUrl } from "./firebase";

// ----------------------
// GET: Application List
// ----------------------
export const getApplicationList = async () => {
  try {
    const response = await fetch(buildUrl("applicationlist"));
    return await response.json();
  } catch (error) {
    console.error("Error fetching application list:", error);
    return null;
  }
};
