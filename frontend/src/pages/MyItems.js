import { useEffect, useState } from "react";
import {
  getMyItems,
  createItem,
  deleteItem,
  updateItem
} from "./MyItems_api.js";

export default function MyItems({ token, API_URL}) {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    imageURL: "",
    priceTHB: "",
    categories: "",
    details: ""
  });

  useEffect(() => {
    loadItems();
  }, [token]);

  function loadItems() {
    getMyItems(token, API_URL).then(setItems);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCreate() {
    await createItem(token, {
      ...form,
      priceTHB: Number(form.priceTHB),
      categories: form.categories.split(",").map(c => c.trim())
    }, API_URL);

    setForm({
			name: "",
			imageURL: "",
			priceTHB: "",
			categories: "",
			details: ""
    });

    loadItems();
  }

  async function handleUpdate(id) {
    await updateItem(token, id, {
      ...form,
      priceTHB: Number(form.priceTHB),
      categories: form.categories.split(",").map(c => c.trim())
    }, API_URL);

    setEditingId(null);
    loadItems();
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      name: item.name,
      imageURL: item.imageURL,
      priceTHB: item.priceTHB,
      categories: item.categories.join(', '),
      details: item.details
    });
  }

  return (
    <div>
      <h2>My Items</h2>

      {/* ---------- CREATE / EDIT FORM ---------- */}
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="imageURL" placeholder="Image URL" value={form.imageURL} onChange={handleChange} />
      <input name="priceTHB" placeholder="Price" value={form.priceTHB} onChange={handleChange} />
      <input name="categories" placeholder="Category (comma separated)" value={form.categories} onChange={handleChange} />
      <textarea name="details" placeholder="Description" value={form.details} onChange={handleChange} />

      {editingId ? (
        <button onClick={() => handleUpdate(editingId)}>Update Item</button>
      ) : (
        <button onClick={handleCreate}>Add Item</button>
      )}

      <hr />

      {/* ---------- ITEM LIST ---------- */}
      {items.map(item => (
        <div key={item._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{item.name}</h3>
          <img src={item.imageURL} alt="" width="150" />
          <p>Price: {item.priceTHB}</p>
          <p>Category: {item.categories.join(", ")}</p>
          <p>{item.details}</p>

          <button onClick={() => startEdit(item)}>Edit</button>
          <button onClick={() => deleteItem(token, item._id, API_URL).then(loadItems)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
