import { buildUrl } from "./firebase";

// ----------------------
// GET: Employee List
// ----------------------
export const getEmployeeList = async () => {
  try {
    const response = await fetch(buildUrl("employeelist"));
    return await response.json();
  } catch (error) {
    console.error("Error fetching employee list:", error);
    return null;
  }
};

// ----------------------
// POST: Add Employee
// ----------------------
export const addEmployee = async (data) => {
  try {
    const response = await fetch(buildUrl("employeelist"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error adding employee:", error);
    return null;
  }
};

// ----------------------
// PUT: Update Employee by Index
// IMPORTANT: Your Firebase must store data as array for this to work
// ----------------------
export const updateEmployee = async (index, data) => {
  try {
    const response = await fetch(buildUrl(`employeelist/${index}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating employee:", error);
    return null;
  }
};
export const getEmployeesByDepartment = async (department) => {
  try {
    const response = await fetch(
      `http://localhost:5000/employees?department=${department}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching employees by department:", error);
    return [];
  }
};
// ----------------------
// DELETE: Remove Employee by Index/Key
// ----------------------
export const deleteEmployee = async (index) => {
  try {
    const response = await fetch(buildUrl(`employeelist/${index}`), {
      method: "DELETE",
    });

    return await response.json();
  } catch (error) {
    console.error("Error deleting employee:", error);
    return null;
  }
};
