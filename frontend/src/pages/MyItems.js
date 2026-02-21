import { useEffect, useState } from "react";
import {
  getMyItems,
  createItem,
  deleteItem,
  updateItem
} from "./MyItems_api.js";
import { uploadImageToS3 } from "../utils/s3Upload.js";

export default function MyItems({ token, API_URL}) {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const baseUrl = API_URL.replace(/\/api$/, '');

  const buildImageUrl = (imageURL) => {
    if (!imageURL) return null;
    if (imageURL.startsWith('http')) return imageURL;
    return `${baseUrl}/resource/${imageURL}`;
  };

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

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  function loadItems() {
    getMyItems(token, API_URL).then(setItems);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  }

  async function resolveImageUrl() {
    const trimmedImageUrl = form.imageURL.trim();
    if (imageFile) {
      setUploading(true);
      try {
        const key = await uploadImageToS3({
          token,
          apiUrl: API_URL,
          purpose: "item",
          file: imageFile
        });
        return key;
      } finally {
        setUploading(false);
      }
    }
    return trimmedImageUrl;
  }

  async function handleCreate() {
    setErrorMessage("");
    const imageURL = await resolveImageUrl();
    if (!imageURL) {
      setErrorMessage("Please select an image file or provide an image URL.");
      return;
    }

    await createItem(token, {
      ...form,
      imageURL,
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
    setImageFile(null);

    loadItems();
  }

  async function handleUpdate(id) {
    setErrorMessage("");
    const imageURL = await resolveImageUrl();
    if (!imageURL) {
      setErrorMessage("Please select an image file or provide an image URL.");
      return;
    }

    await updateItem(token, id, {
      ...form,
      imageURL,
      priceTHB: Number(form.priceTHB),
      categories: form.categories.split(",").map(c => c.trim())
    }, API_URL);

    setEditingId(null);
    setImageFile(null);
    loadItems();
  }

  function startEdit(item) {
    setEditingId(item._id);
    setImageFile(null);
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
      <input
        name="imageURL"
        placeholder="Image URL (optional)"
        value={form.imageURL}
        onChange={handleChange}
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imagePreviewUrl ? <img src={imagePreviewUrl} alt="" width="150" /> : null}
      <input name="priceTHB" placeholder="Price" value={form.priceTHB} onChange={handleChange} />
      <input name="categories" placeholder="Category (comma separated)" value={form.categories} onChange={handleChange} />
      <textarea name="details" placeholder="Description" value={form.details} onChange={handleChange} />

      {editingId ? (
        <button onClick={() => handleUpdate(editingId)} disabled={uploading}>
          {uploading ? "Uploading..." : "Update Item"}
        </button>
      ) : (
        <button onClick={handleCreate} disabled={uploading}>
          {uploading ? "Uploading..." : "Add Item"}
        </button>
      )}

      {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : null}

      <hr />

      {/* ---------- ITEM LIST ---------- */}
      {items.map(item => {
        const imgUrl = buildImageUrl(item.imageURL);
        return (
          <div key={item._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
            <h3>{item.name}</h3>
            {imgUrl ? (
              <img src={imgUrl} alt="" width="150" style={{ display: "block" }} />
            ) : (
              <p style={{ color: "#999" }}>No image</p>
            )}
            <p>Price: {item.priceTHB}</p>
            <p>Category: {item.categories.join(", ")}</p>
            <p>{item.details}</p>

            <button onClick={() => startEdit(item)}>Edit</button>
            <button onClick={() => deleteItem(token, item._id, API_URL).then(loadItems)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
