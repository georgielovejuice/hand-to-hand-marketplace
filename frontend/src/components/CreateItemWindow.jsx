import { useState, useEffect } from "react";
import axios from 'axios';

export default function CreateItem({item, closeWindow, token, API_URL, updateMyItemsPage}) {
  const CREATING_ITEM = 0;
  const EDITING_ITEM = 1;
  const windowAction = item ? EDITING_ITEM : CREATING_ITEM;
  
  const [title, setTitle] = useState(item ? item.name : "");
  const [description, setDescription] = useState(item ? item.details : "");
  const [price, setPrice] = useState(item ? item.priceTHB : 0);
  const [typingCategory, setTypingCategory] = useState("");
  const [categories, setCategories] = useState(item ? item.categories : []);
  const [condition, setCondition] = useState(item ? item.condition : null);
  
  const [uploadedImageURL, setUploadedImageURL] = useState(item ? item.imageURL : "");
  const [preview, setPreview] = useState(item ? item.imageURL : null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    try {
      const presignRes = await axios.post(`${API_URL}/uploads/presign`, 
        {
          purpose: "item",
          contentType: file.type,
          fileName: file.name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          }
        }
      );
      
      const formData = new FormData();
      for (const [key, value] of Object.entries(presignRes.data.fields)) {
        formData.append(key, value);
      }
      
      formData.append("file", file);
      const uploadRes = await fetch(presignRes.data.uploadingURL, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        alert("Image upload failed!");
        return;
      }

      setUploadedImageURL(`${presignRes.data.uploadingURL}${presignRes.data.fields.key}`);

    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {    
    try {
      await axios({
        method: (windowAction === EDITING_ITEM) ? "PUT" : "POST",
        url: `${API_URL}/myitems/` + (windowAction === EDITING_ITEM ? item._id : ''), 
        headers: {
          'Content-Type': 'application/json', 
          Authorization: token,
        },
        data: {
          name: title,
          priceTHB: Number(price),
          categories: categories,
          details: description,
          condition: condition,
          imageURL: uploadedImageURL,
        }, 
      });
      
      updateMyItemsPage();
      closeWindow();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  function MuiChip({value}){
    function removeValue(str){
      const strIndex = categories.indexOf(str);
      setCategories(categories => categories.splice(strIndex, 1));
    }
    
    return (
      <div className="inline-block h-[30px] border-[2px] mr-[10px] border-solid pl-[10px] pr-[10px] rounded-[15px] font-semibold">
        <p className="inline-block"
        >{value}</p>
        <button 
          onClick={(_) => {removeValue(value);}}
          className="ml-[10px] rounded-[20px] inline-block text-orange-400 font-bold align-text-top"
        >X</button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-[99.5vw] h-[100vh] bg-[rgba(217,195,168,0.75)] flex justify-center py-16">
      <div className="w-2/3 max-w-6xl bg-[#e6d2b9] p-10 rounded-lg shadow-lg flex gap-12">

        {/* ================= LEFT SIDE IMAGE ================= */}
        <div className="flex flex-col items-center gap-6 w-1/3">

          {/* Big Image Box */}
          <label className="w-full bg-orange-500 rounded-md flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition">

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
          {windowAction === CREATING_ITEM ? "Post New Item" : "Edit Item"}
          </h2>

          {/* Item Name */}
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              placeholder="Enter item name"
              className="w-full bg-gray-200 text-gray-700 p-3 rounded outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-gray-700">
              Item Description
            </label>
            <textarea
              placeholder="Write item description"
              className="w-full bg-gray-200 text-gray-700 p-3 rounded h-28 resize-none outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
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
            value={condition}
          >
            <option value="" className="text-black bg-white">
              Select condition
            </option>
            <option value="New" className="text-black bg-white">New</option>
            <option value="Like New" className="text-black bg-white">Like New</option>
            <option value="Good" className="text-black bg-white">Good</option>
            <option value="Fair" className="text-black bg-white">Fair</option>
            <option value="Used" className="text-black bg-white">Used</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-gray-700">
              Category
            </label>
            <div className="flex mt-[10px] mb-[10px]">
              {
                categories.map(category =>
                <MuiChip value={category}/>)
              }
            </div>
            <form onSubmit={(htmlEvent) => {
              htmlEvent.preventDefault();
              const trimmedTypingCategory = typingCategory.trim();
              if (trimmedTypingCategory.length > 0) {
                setCategories([...categories, trimmedTypingCategory]);
                setTypingCategory("");
              }
            }}>
              <input
                type="text"
                placeholder="Enter the category, press enter to add."
                className="w-full bg-gray-200 text-gray-700 p-3 rounded outline-none focus:ring-2 focus:ring-orange-400"
                onChange={(e) => setTypingCategory(e.target.value)}
                value={typingCategory}
              />
            </form>
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
                value={price}
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
            {(windowAction === CREATING_ITEM) ? "Upload Item" : "Make Changes"}
            </button>

            <button
              onClick={(_) => {closeWindow();}}
              className="text-gray-600 underline hover:text-black"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}