// frontend/src/api.js
const API_URL = "http://localhost:3001";

/* ---------- LOGIN ---------- */
export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json(); // { token }
}

/* ---------- GET MY ITEMS ---------- */
export async function getMyItems(token) {
  const res = await fetch(`${API_URL}/myitems`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}

/* ---------- CREATE ITEM ---------- */
export async function createItem(token, item) {
  const res = await fetch(`${API_URL}/myitems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(item)
  });

  return res.json();
}

/* ---------- UPDATE ITEM ---------- */
export async function updateItem(token, id, item) {
  const res = await fetch(`${API_URL}/myitems/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(item)
  });

  return res.json();
}

/* ---------- DELETE ITEM ---------- */
export async function deleteItem(token, id) {
  const res = await fetch(`${API_URL}/myitems/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}
