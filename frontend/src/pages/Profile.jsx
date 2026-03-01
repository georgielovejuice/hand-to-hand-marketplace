import { useEffect, useState } from "react";
import axios from 'axios';

import {ProfileSettingBlock, PasswordSettingBlock, SectionSelectorPanel} from '../components/ProfileComponents.jsx'

export default function Profile({userObject, setUserObject, API_URL}) {
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState("Profile");
  const [pfpPreviewURL, setPfpPreviewURL] = useState(null);
  const [pfpFileToUpload, setPfpFileToUpload] = useState(null);

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

        setOriginalForm(originalForm => nextForm);
        setPfpPreviewURL(pfpPreviewURL => response.data.profilePicture);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);
  
  useEffect(() => {
    setPfpPreviewURL(originalForm.profilePicture);
  }, [originalForm]);
  
  async function uploadChanges(form, setSaving, setSuccess){
    setSaving(true);
    setError("");
    setSuccess("");
    let newPfpURL;
    
    async function uploadPfp(){
      let presignRes;
      try {
        presignRes = await fetch(`${API_URL}/uploads/presign`, {
          method: "POST",
          body: JSON.stringify({
            purpose: "profile",
            contentType: pfpFileToUpload.type,
            fileName: pfpFileToUpload.name,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: userObject.token,
          }
        });
      }catch(err){
        if(err instanceof TypeError) {
          setError("Could not connect to server for file upload URL.");
          return false;
        }
        throw err;
      }

      let objectFromResponse;
      try{
        objectFromResponse = await presignRes.json();
      }catch(err){
        if(err instanceof TypeError){
          setError("Could not decode response from server.");
          return false;
        }if(err instanceof SyntaxError){
          setError("Could not parse JSON from server.");
          return false;
        }
        throw err;
      }
      
      if(!presignRes.ok){
        setError(objectFromResponse.message || `Received HTTP status ${presignRes.status} from server.`);
        return false; 
      }
        
      const formData = new FormData();
      for (const [key, value] of Object.entries(objectFromResponse.fields)) {
        formData.append(key, value);
      }
      formData.append("file", pfpFileToUpload);
      
      let uploadRes;
      try{
        uploadRes = await fetch(objectFromResponse.uploadingURL, {
          method: "POST",
          body: formData,
        });
      }catch(err){
        if(err instanceof TypeError){
          setError("Could not connect to web storage for image upload.");
          return false;
        }
      }
      if(!uploadRes.ok){
        setError(`Received HTTP status ${uploadRes.status} from web storage.`);    
        return false;
      }
  
      newPfpURL = `${objectFromResponse.uploadingURL}${objectFromResponse.fields.key}`;
      return true;
    };    

    if(pfpFileToUpload){
      const uploadedPfp = await uploadPfp();
      if(!uploadedPfp){
        setSaving(false);
        return;
      }
    }
    
    try {
      await axios.put(`${API_URL}/profile`, 
        {
        name: form.name,
        email: form.email,
        phone: form.phone,
        profilePicture: newPfpURL || form.profilePicture,
        },
        {
          headers:{
            Authorization: userObject.token
          }
        }
      );

      setOriginalForm({...form, profilePicture: newPfpURL});
      
      setUserObject({
        ...userObject, 
        name: form.name,
        email: form.email,
        phone: form.phone,
        profilePictureURL: newPfpURL || form.profilePicture
      });
      setSuccess("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-[#FEECD3]">
      <div className="p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6 lg:grid-rows-4">
          <SectionSelectorPanel
            pfpPreviewURL={pfpPreviewURL}
            setPfpPreviewURL={setPfpPreviewURL}
            setPfpFileUpload={setPfpFileToUpload}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            originalForm={originalForm}
          />

          {
            currentSection === "Profile" && 
            <ProfileSettingBlock
              setError={setError}
              error={error}
              originalForm={originalForm}
              saveChanges={uploadChanges}
              revertLocalPfp={(_) => {
                setPfpPreviewURL(originalForm.profilePicture);
                setPfpFileToUpload(null);
              }}
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