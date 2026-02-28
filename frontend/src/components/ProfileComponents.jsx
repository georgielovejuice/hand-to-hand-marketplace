import { useEffect, useState } from "react";
import {IconContext, FaRegCheckCircle } from 'react-icons/fa';
import axios from 'axios';

export function SectionSelectorPanel({
  pfpPreviewURL, 
  setPfpPreviewURL, 
  setPfpFileUpload,
  currentSection,
  setCurrentSection,
  originalForm,
})
{
  function ProfilePictureContainer(){
    const [mouseOverContainer, setMouseOverContainer] = useState(false);
    const uploadVisiblityClass = !mouseOverContainer ? "hidden" : "";
    
    function changeLocalProfilePicture(htmlEvent){
      htmlEvent.preventDefault();
      const file = htmlEvent.target.files[0];
      if(!file) return;
      setPfpFileUpload(file);
      setPfpPreviewURL(URL.createObjectURL(file));
    }
    
    return (
      <div 
        onMouseOver={(_) => {setMouseOverContainer(true)}}
        onMouseLeave={(_) => {setMouseOverContainer(false)}}          
        className="relative w-full h-full"
      >
        <div 
          className={"absolute z-10 top-0 left-0 justify-center items-center w-full h-full bg-[rgba(60,60,60,0.75)]"
          + uploadVisiblityClass}
          
        >
          <input type="file" onChange={changeLocalProfilePicture} className="top-0 left-0 w-full h-full opacity-0"/>
        </div>
        <img
          src={pfpPreviewURL}
          alt="Profile"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
    );
  }
  
  const inactiveSelectorButtonClass = "w-full bg-[#FFD6A7] text-[#370A00] py-2 rounded-md";
  const activeSelectorButtonClass = "w-full bg-orange-600 text-white py-2 rounded-md";   
  
  return (
    <section className="bg-[#FFCA8D] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-4 flex flex-col items-center text-center gap-4">
      <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300">
        <ProfilePictureContainer
          pfpPreviewURL={pfpPreviewURL}
          setPfpPreviewURL={setPfpPreviewURL} 
          setPfpFileUpload={setPfpFileUpload}
        />
      </div>

      <p className="text-xl font-semibold">
        {originalForm.name}
      </p>
      <p className="break-all">{originalForm.email}</p>

      <button 
        onClick={(_) => {
          setPfpFileUpload(null);
          setPfpPreviewURL(originalForm.profilePicture);
          setCurrentSection("Profile");
        }}
        className={currentSection === "Profile" ? activeSelectorButtonClass : inactiveSelectorButtonClass}
      >Profile Setting</button>
      <button 
        onClick={(_) => {
          setPfpFileUpload(null);
          setPfpPreviewURL(originalForm.profilePicture);
          setCurrentSection("Password");
        }}
        className={currentSection === "Password" ? activeSelectorButtonClass : inactiveSelectorButtonClass}
      >Change Password</button>
    </section>
  );
}



export function ProfileSettingBlock({setError, error, originalForm, saveChanges, revertLocalPfp}){
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
    revertLocalPfp();
  };
  
  //There is some bouncing back and forth with orignalForm,
  //which makes setForm to set as empty. We detect changes of originalForm and change form accordingly.
  useEffect(() => {
    setForm({...originalForm});
  }, [originalForm]);
  
  return (
    <section className="bg-[#FFCA8D] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-2">
      <h2 className="text-xl font-semibold mb-4">Profile Setting</h2>

      <form onSubmit={(_) => {
          _.preventDefault(); 
          saveChanges(form, setSaving, setSuccess);
        }} 
        className="grid grid-cols-1 md:grid-cols-2 gap-4">
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