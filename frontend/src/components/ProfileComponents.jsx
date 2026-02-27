import { useEffect, useState } from "react";
import {IconContext, FaRegCheckCircle } from 'react-icons/fa';
import axios from 'axios';

export function ProfileSettingBlock({setError, error, userToken, originalForm, setOriginalForm, API_URL}){
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({...originalForm}); 
  
  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };   

  const handleCancel = () => {
    setForm({...originalForm});
    setError("");
    setSuccess("");
  };
  

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await axios.put(`${API_URL}/profile`, 
        {
        name: form.name,
        email: form.email,
        phone: form.phone,
        profilePicture: form.profilePicture,
        },
        {
          headers:{
            Authorization: userToken
          }
        }
      );

      setOriginalForm(form);
      setSuccess("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <section className="bg-[#FFCA8D] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-2">
      <h2 className="text-xl font-semibold mb-4">Profile Setting</h2>

      <form onSubmit={handleSaveChanges} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="md:col-span-2">
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-300"
          />
        </label>

        <label className="md:col-span-2">
          Email
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-300"
          />
        </label>

        <label className="md:col-span-2">
          Phone Number
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-300"
          />
        </label>
        
        {
          success &&
          <p className="inline-block md:col-span-2 rounded-[5px] p-[15px] bg-white text-green-600 font-semibold"
          >{success}</p>
        }
        {
          error &&
          <p className="inline-block md:col-span-2 rounded-[5px] p-[15px] bg-white text-red-500 font-semibold"
          >{error}</p>
        }

        <div className="md:col-span-2 flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#FFD6A7] text-[#370A00] px-4 py-2 rounded-md disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="text-white disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export function PasswordSettingBlock({userToken, API_URL}){
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  
  const clearedForm = {
    currentPassword: "",
    newPassword: "",
    newConfirmingPassword: "",    
  };
  
  const [form, setForm] = useState(clearedForm); 
  
  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };   

  const handleCancel = () => {
    setForm(clearedForm);
    setError("");
    setSuccess("");
  };  
  
  const handleSaveChanges = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    
    const trimmedCurrentPassword = form.currentPassword.trim();
    const trimmedNewPassword = form.newPassword.trim();
    const trimmedNewConfirmingPassword = form.newConfirmingPassword.trim();    

    if(trimmedNewPassword !== trimmedNewConfirmingPassword){
      setSaving(false);
      return setError("New passwords do not match.");
    }

    try {
      await axios.put(`${API_URL}/profile/password`, 
        {
          currentPassword: trimmedCurrentPassword,
          newPassword: trimmedNewPassword,
        },
        {
          headers:{
            Authorization: userToken
          }
        }
      );

      setSuccess("Password updated successfully.");
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <section className="bg-[#FFCA8D] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-2">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>

      <form onSubmit={handleSaveChanges} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="md:col-span-2">
          Current password
          <input
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            type="password"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-300"
          />
        </label>

        <label className="md:col-span-2">
          New password
          <input
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            type="password"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-300"
          />
        </label>

        <label className="md:col-span-2">
          Confirm new password
          <input
            name="newConfirmingPassword"
            value={form.newConfirmingPassword}
            onChange={handleChange}
            type="password"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-300"
          />
        </label>

        {
          success &&
          <p className="inline-block md:col-span-2 rounded-[5px] p-[15px] bg-white text-green-600 font-semibold"
          >{success}</p>
        }
        {
          error &&
          <p className="inline-block md:col-span-2 rounded-[5px] p-[15px] bg-white text-red-500 font-semibold"
          >{error}</p>
        }

        <div className="md:col-span-2 flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#FFD6A7] text-[#370A00] px-4 py-2 rounded-md disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="text-white disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>  
  );
}