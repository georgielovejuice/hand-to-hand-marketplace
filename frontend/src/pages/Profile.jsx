import { useEffect, useState } from "react";
import axios from 'axios';

import {ProfileSettingBlock, PasswordSettingBlock} from '../components/ProfileComponents.jsx'

export default function Profile({userObject, setUserObject, API_URL}) {
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState("Profile");

  const [originalForm, setOriginalForm] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
  });   

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: {Authorization: userObject.token}
        });

        const nextForm = {
          name: response.data?.name || "",
          email: response.data?.email || "",
          phone: response.data?.phone || "",
          profilePicture: response.data?.profilePicture || "",
        };

        setOriginalForm(nextForm);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);
  
  function SectionSelectorPanel(){
    const inactiveSelectorButtonClass = "w-full bg-[#FFD6A7] text-[#370A00] py-2 rounded-md";
    const activeSelectorButtonClass = "w-full bg-orange-600 text-white py-2 rounded-md";   
    
    return (
      <section className="bg-[#FFCA8D] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-4 flex flex-col items-center text-center gap-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300">
          {originalForm.profilePicture ? (
            <img
              src={originalForm.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        <p className="text-xl font-semibold">
          {originalForm.name}
        </p>
        <p className="break-all">{originalForm.email}</p>

        <button 
          onClick={(_) => {
            setCurrentSection("Profile");
          }}
          className={currentSection === "Profile" ? activeSelectorButtonClass : inactiveSelectorButtonClass}
        >Profile Setting</button>
        <button 
          onClick={(_) => {
            setCurrentSection("Password");
          }}
          className={currentSection === "Password" ? activeSelectorButtonClass : inactiveSelectorButtonClass}
        >Change Password</button>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEECD3]">
      <div className="p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6 lg:grid-rows-4">
          <SectionSelectorPanel/>

          {
            currentSection === "Profile" && 
            <ProfileSettingBlock
              setError={setError}
              error={error}
              userToken={userObject.token}
              originalForm={originalForm}
              setOriginalForm={setOriginalForm}
              API_URL={API_URL}
            />
          }
          {
            currentSection === "Profile" &&
            <section className="bg-[#FFCA8D] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-1">
              <h2 className="text-xl font-semibold">Wish List</h2>
              <div className="flex w-full h-full justify-center items-center font-semibold text-[16px]">
                <p>Not yet D:</p>
              </div>
            </section>
          }
          {
            currentSection === "Profile" &&            
            <section className="bg-[#FFCA8D] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-1">
              <h2 className="text-xl font-semibold">History</h2>
              <div className="flex w-full h-full justify-center items-center font-semibold text-[16px]">
                <p>Not yet D:</p>
              </div>
            </section> 
          }
          
          {
            currentSection === "Password" && 
            <PasswordSettingBlock
              setError={setError}
              userToken={userObject.token}
              API_URL={API_URL}
            />
          }
        </div>
      </div>
    </div>
  );
}