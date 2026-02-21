import React, { useState } from "react";
import api from "../api/axio";

export default function CreateItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [imageKey, setImageKey] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const presignRes = await api.post("/api/uploads/presign", {
        purpose: "item",
        contentType: file.type,
        fileName: file.name,
      });

      const { url, fields, key } = presignRes.data;

      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => {
        formData.append(k, v);
      });

      formData.append("Content-Type", file.type);
      formData.append("file", file);

      await fetch(url, {
        method: "POST",
        body: formData,
      });

      setImageKey(key);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post("/api/items", {
        title,
        description,
        price: Number(price),
        category,     // MUST match enum exactly
        condition,    // REQUIRED
        location,     // REQUIRED
        imageUrl: imageKey,
      });

      alert("Item created!");
    } catch (err) {
      console.error("Create item error:", err.response?.data || err);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Create Item</h1>

      <input
        type="text"
        placeholder="Title"
        className="border p-2 block mb-4"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 block mb-4"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        className="border p-2 block mb-4"
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* ⚠️ CATEGORY MUST MATCH ENUM EXACTLY */}
      <select
        className="border p-2 block mb-4"
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Books">Books</option>
      </select>

      <select
  className="border p-2 block mb-4"
  onChange={(e) => setCondition(e.target.value)}
>
  <option value="">Select Condition</option>
  <option value="new">New</option>
  <option value="like_new">Like New</option>
  <option value="good">Good</option>
  <option value="fair">Fair</option>
  <option value="used">Used</option>
</select>

      <input
        type="text"
        placeholder="Location"
        className="border p-2 block mb-4"
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileUpload}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Create Item
      </button>
    </div>
  );
}