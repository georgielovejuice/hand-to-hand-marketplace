import React, { useState } from "react";
import api from "../api/axio";
import Navbar from "../components/Navbar"; 

export default function CreateItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [preview, setPreview] = useState(null);

  // ================= IMAGE UPLOAD =================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      const presignRes = await api.post("/uploads/presign", {
        purpose: "item",
        contentType: file.type,
        fileName: file.name,
      });

      const { url, fields, key } = presignRes.data;

      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => {
        formData.append(k, v);
      });
      formData.append("file", file);

      const uploadRes = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        alert("Image upload failed!");
        return;
      }

      setImageKey(key);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      await api.post("/items", {
        title,
        description,
        price: Number(price),
        category,
        condition,
        location,
        images: imageKey ? [imageKey] : [],
      });

      alert("Item created successfully!");
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#d9c3a8] flex justify-center py-16">
        <div className="w-full max-w-6xl bg-[#e6d2b9] p-10 rounded-lg shadow-lg flex gap-12">

          {/* ================= LEFT SIDE IMAGE ================= */}
          <div className="flex flex-col items-center gap-6">

            {/* Big Image Box */}
            <label className="w-[380px] h-[420px] bg-orange-500 rounded-md flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition">

              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <>
                  <span className="text-6xl text-white">+</span>
                  <span className="text-white mt-2 font-medium">
                    Add Image
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileUpload}
                hidden
              />
            </label>

            <p className="text-sm text-gray-600">
              Click the box to upload item image
            </p>
          </div>

          {/* ================= RIGHT SIDE FORM ================= */}
          <div className="flex-1">

            <h2 className="text-2xl font-bold mb-8 text-gray-800">
              Post New Item
            </h2>

            {/* Item Name */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                placeholder="Enter item name"
                className="w-full bg-gray-200 p-3 rounded outline-none focus:ring-2 focus:ring-orange-400"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Item Description
              </label>
              <textarea
                placeholder="Write item description"
                className="w-full bg-gray-200 p-3 rounded h-28 resize-none outline-none focus:ring-2 focus:ring-orange-400"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Condition */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Item Condition
              </label>
             <select
  className="w-full bg-gray-200 text-black p-3 rounded outline-none 
             focus:ring-2 focus:ring-orange-400"
  onChange={(e) => setCondition(e.target.value)}
>
  <option value="" className="text-black bg-white">
    Select condition
  </option>
  <option value="new" className="text-black bg-white">New</option>
  <option value="like_new" className="text-black bg-white">Like New</option>
  <option value="good" className="text-black bg-white">Good</option>
  <option value="fair" className="text-black bg-white">Fair</option>
  <option value="used" className="text-black bg-white">Used</option>
</select>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Category
              </label>
              <select
  className="w-full bg-gray-200 text-black p-3 rounded outline-none
             focus:ring-2 focus:ring-orange-400 appearance-none"
  style={{ color: "black" }}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="" className="text-black bg-white">
    Select category
  </option>
  <option value="Electronics" className="text-black bg-white">
    Electronics
  </option>
  <option value="Toys" className="text-black bg-white">
    Toys
  </option>
  <option value="Books" className="text-black bg-white">
    Books
  </option>
</select>
            </div>

            {/* Location */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full bg-gray-200 p-3 rounded outline-none focus:ring-2 focus:ring-orange-400"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Price */}
            <div className="mb-8">
              <label className="block mb-2 font-semibold text-gray-700">
                Price
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="0"
                  className="bg-[#7a2e10] text-white p-3 rounded w-40 outline-none"
                  onChange={(e) => setPrice(e.target.value)}
                />
                <span className="text-2xl text-black font-semibold">฿</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-medium transition"
              >
                Upload Item
              </button>

              <button
                onClick={() => window.history.back()}
                className="text-gray-600 underline hover:text-black"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}