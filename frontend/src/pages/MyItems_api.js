/* ---------- GET MY ITEMS ---------- */
export async function getMyItems(token, API_URL) {
  const res = await fetch(`${API_URL}/myitems`, {
    headers: {
      authorization: token
    }
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }
	
  return res.json();
}

/* ---------- CREATE ITEM ---------- */
export async function createItem(token, item, API_URL) {
  const res = await fetch(`${API_URL}/myitems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify(item)
  });

  return res.json();
}

/* ---------- UPDATE ITEM ---------- */
export async function updateItem(token, id, item, API_URL) {
  const res = await fetch(`${API_URL}/myitems/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify(item)
  });

  return res.json();
}

/* ---------- DELETE ITEM ---------- */
export async function deleteItem(token, id, API_URL) {
  const res = await fetch(`${API_URL}/myitems/${id}`, {
    method: "DELETE",
    headers: {
      authorization: token
    }
  });

  return res.json();
}
