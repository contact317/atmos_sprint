// Base URL of your Firebase Realtime Database
export const BASE_URL =
  "https://atmosissuetracker-default-rtdb.asia-southeast1.firebasedatabase.app";

// Firebase auth token for protected access
export const AUTH_TOKEN =
  "jJADbStueGHzr0k7ykwK6oxtEuu1MjkLn4hzNqSQ";

// Helper function to build URLs for GET, POST, PUT
export const buildUrl = (path) => {
  return `${BASE_URL}/${path}.json?auth=${AUTH_TOKEN}`;
};
