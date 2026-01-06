import { useEffect, useState } from "react";
import {
  getMyItems,
  createItem,
  deleteItem,
  updateItem
} from "./api";

export default function MyItems({ token }) {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    price: "",
    category: "",
    details: ""
  });

  useEffect(() => {
    loadItems();
  }, [token]);

  function loadItems() {
    getMyItems(token).then(setItems);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCreate() {
    await createItem(token, {
      ...form,
      price: Number(form.price),
      category: form.category.split(",").map(c => c.trim())
    });

    setForm({
      name: "",
      imageUrl: "",
      price: "",
      category: "",
      details: ""
    });

    loadItems();
  }

  async function handleUpdate(id) {
    await updateItem(token, id, {
      ...form,
      price: Number(form.price),
      category: form.category.split(",").map(c => c.trim())
    });

    setEditingId(null);
    loadItems();
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
      category: item.category.join(", "),
      details: item.details
    });
  }

  return (
    <div>
      <h2>My Items</h2>

      {/* ---------- CREATE / EDIT FORM ---------- */}
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input name="category" placeholder="Category (comma separated)" value={form.category} onChange={handleChange} />
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
          <img src={item.imageUrl} alt="" width="150" />
          <p>Price: {item.price}</p>
          <p>Category: {item.category.join(", ")}</p>
          <p>{item.details}</p>

          <button onClick={() => startEdit(item)}>Edit</button>
          <button onClick={() => deleteItem(token, item._id).then(loadItems)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
