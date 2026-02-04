import { useState, useEffect } from "react";

export default function Profile({
	profileAPIURL,
	changePasswordAPIURL,
	userObject,
	setUserObject,
}){
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: userObject.email,
    phone: "",
    profilePicture: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
		setLoading(true);
		let response = null;
		try{
			/*
			Based on Window.fetch(), raises
			- AbortError if abort() is called
			- TypeError if
				- request URL is invalid
				- request blocked by permissions policy
				- network error
			- from await
			*/
      response = await fetch(profileAPIURL, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					authorization: userObject.token,
				}
			});
		}catch(err){
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) setError("Couldn't connect to the server.");
			else setError("Error: " + err);
			setLoading(false);
			return;
		}
		
		try{
			/*
			Raises
			- AbortError if abort() is called
			- TypeError if couldn't decode response body
			- SyntaxError if body couldn't be parsed as json
			- something from await
			*/
			const objectFromResponse = await response.json();
			if(!(response.ok)){
				setError(objectFromResponse.message ? objectFromResponse.message 
									: "Received HTTP status " + response.status + " from server.");
				setLoading(false);
				return;
			}

			setUserObject({
				...userObject,
				email: objectFromResponse.email || userObject.email,
				name: objectFromResponse.name || userObject.name,
				profilePictureURL: objectFromResponse.profilePicture || userObject.profilePictureURL,
				phoneNumber: objectFromResponse.phone || userObject.phoneNumber,				
			});	

      setForm({
        name: objectFromResponse.name || userObject.name,
        email: objectFromResponse.email || userObject.email,
        phone: objectFromResponse.phone || userObject.phoneNumber,
        profilePicture: objectFromResponse.profilePicture || userObject.profilePictureURL,				
			});
			setError('');
    }catch (err){
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) setError("Couldn't decode response body from server.");		
			else if(err instanceof SyntaxError) setError("Couldn't parse JSON response from server.");						
			else setError("Error: " + err);
    }
		setLoading(false);			
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
		
		let response = null;
		const trimmedName = form.name.trim();
		const trimmedEmail = form.email.trim();
		const trimmedPhoneNumber = form.phone.trim();
		const trimmedProfilePictureURL = form.profilePicture.trim();
    try {
			/*
			Based on Window.fetch(), raises
			- AbortError if abort() is called
			- TypeError if
				- request URL is invalid
				- request blocked by permissions policy
				- network error
			- from await
			*/
      response = await fetch(profileAPIURL, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: userObject.token,
				},
				/*
					Raises TypeError if the parameter object has a circular reference 
					or BigInt value is in the parameter object
				*/
				body: JSON.stringify({					
					name: trimmedName,
					email: trimmedEmail,
					phone: trimmedPhoneNumber,
					profilePicture: trimmedProfilePictureURL
				})
			});
		}catch(err){
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) setError("Couldn't connect to the server.");
			else setError("Error: " + err);
			setLoading(false);
			return;
		}
		
		try{
			/*
			Raises
			- AbortError if abort() is called
			- TypeError if couldn't decode response body
			- SyntaxError if body couldn't be parsed as json
			- something from await
			*/
			const objectFromResponse = await response.json();
			if(!(response.ok)){
				setError(objectFromResponse.message ? objectFromResponse.message 
									: "Received HTTP status " + response.status + " from server.");
				return;
			}
			
			setUserObject({
				...userObject,
				email: trimmedEmail,
				name: trimmedName,
				profilePictureURL: trimmedProfilePictureURL,
				phoneNumber: trimmedPhoneNumber
			});
			setSuccess("Profile updated successfully!");
			setEditMode(false);
    }catch (err){
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) setError("Couldn't decode response body from server.");		
			else if(err instanceof SyntaxError) setError("Couldn't parse JSON response from server.");						
			else setError("Error: " + err);    
		}
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

		const trimmedNewPassword = passwordForm.newPassword.trim();
		const trimmedConfirmingPassword = passwordForm.confirmPassword.trim();
		const trimmedCurrentPassword = passwordForm.currentPassword.trim();
		
    if (trimmedNewPassword !== trimmedConfirmingPassword) {
      setError("New passwords don't match!");
      return;
    }

		let response = null;
    try {
			/*
			Based on Window.fetch(), raises
			- AbortError if abort() is called
			- TypeError if
				- request URL is invalid
				- request blocked by permissions policy
				- network error
			- from await
			*/
      response = await fetch(changePasswordAPIURL, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: userObject.token,
				},
				/*
					Raises TypeError if the parameter object has a circular reference 
					or BigInt value is in the parameter object
				*/
				body: JSON.stringify({
					email: userObject.email,
					currentPassword: trimmedCurrentPassword,
					newPassword: trimmedNewPassword,
				})
			});
		}catch(err){
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) setError("Couldn't connect to the server.");
			else setError("Error: " + err);
			setLoading(false);
			return;
		}		
		
		try{
			/*
			Raises
			- AbortError if abort() is called
			- TypeError if couldn't decode response body
			- SyntaxError if body couldn't be parsed as json
			- something from await
			*/
			const objectFromResponse = await response.json();
			if(!(response.ok)){
				setError(objectFromResponse.message ? objectFromResponse.message 
									: "Received HTTP status " + response.status + " from server.");
				return;
			}

			setSuccess("Password changed successfully!");
    }catch (err){
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) setError("Couldn't decode response body from server.");		
			else if(err instanceof SyntaxError) setError("Couldn't parse JSON response from server.");						
			else setError("Error: " + err);    
		}		
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card bg-white shadow-lg border border-orange-100">
              <div className="card-body p-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="avatar mb-3">
                    <div className="w-24 rounded-full ring ring-orange-400 ring-offset-2">
                      <img src={userObject.profilePictureURL || "https://via.placeholder.com/150"} alt="Profile" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg">{userObject.name}</h3>
                  <p className="text-sm text-gray-500">{userObject.email}</p>
                </div>

                <ul className="menu p-0 bg-orange-500">
                  <li>
                    <button 
                      className={activeTab === "profile" ? "active bg-orange-50 text-orange-600" : ""}
                      onClick={() => setActiveTab("profile")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      Profile Settings
                    </button>
                  </li>
                  <li>
                    <button 
                      className={activeTab === "password" ? "active bg-orange-50 text-orange-600" : ""}
                      onClick={() => setActiveTab("password")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      Change Password
                    </button>
                  </li>
                  <li>
                    <button 
                      className={activeTab === "wishlist" ? "active bg-orange-50 text-orange-600" : ""}
                      onClick={() => setActiveTab("wishlist")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      Wishlist
                    </button>
                  </li>
                  <li>
                    <button 
                      className={activeTab === "sold" ? "active bg-orange-50 text-orange-600" : ""}
                      onClick={() => setActiveTab("sold")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      Sold Items
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="card bg-white shadow-lg border border-orange-100">
              <div className="card-body">
                
                {/* Success/Error Messages */}
                {error && (
                  <div className="alert alert-error mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}

                {/* Profile Settings Tab */}
                {activeTab === "profile" && (
                  <div>
                    <div className=" bg-orange-500 flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Profile Settings</h2>
                      {!editMode && (
                        <button 
                          className="btn btn-sm bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white border-none"
                          onClick={() => setEditMode(true)}
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4 bg-zinc-500 ">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Profile Picture URL</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={form.profilePicture}
                          onChange={(e) => setForm({...form, profilePicture: e.target.value})}
                          disabled={!editMode}
                          placeholder="https://example.com/your-image.jpg"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Full Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={form.name}
                          onChange={(e) => setForm({...form, name: e.target.value})}
                          disabled={!editMode}
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                          type="email"
                          className="input input-bordered"
                          value={form.email}
                          onChange={(e) => setForm({...form, email: e.target.value})}
                          disabled={!editMode}
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          className="input input-bordered"
                          value={form.phone}
                          onChange={(e) => setForm({...form, phone: e.target.value})}
                          disabled={!editMode}
                          placeholder="+1 234 567 8900"
                        />
                      </div>

                      {editMode && (
                        <div className="flex gap-2">
                          <button 
                            type="submit"
                            className="btn bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white border-none"
                          >
                            Save Changes
                          </button>
                          <button 
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => {
                              setEditMode(false);
                              setForm({
                                name: userObject.name,
                                email: userObject.email,
                                phone: userObject.phoneNumber || "",
                                profilePicture: userObject.profilePictureURL || "",
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* Change Password Tab */}
                {activeTab === "password" && (
                  <div>
                    <h2 className="text-2xl bg-neutral font-bold mb-6">Change Password</h2>
                    <form onSubmit={handleChangePassword} className="space-y-4 bg-neutral">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Current Password</span>
                        </label>
                        <input
                          type="password"
                          className="input input-bordered"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">New Password</span>
                        </label>
                        <input
                          type="password"
                          className="input input-bordered"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Confirm New Password</span>
                        </label>
                        <input
                          type="password"
                          className="input input-bordered"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          required
                        />
                      </div>

                      <button 
                        type="submit"
                        className="btn bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white border-none"
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === "wishlist" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 bg-neutral ">My Wishlist</h2>
                    {userObject.wishlist?.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Your wishlist is empty</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {/* Wishlist items will be displayed here */}
                        <p className="bg-orange-100 text-gray-500">Coming soon...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Sold Items Tab */}
                {activeTab === "sold" && (
                  <div>
                    <h2 className="text-2xl font-bold bg-neutral mb-6">Items I've Sold</h2>
                    {userObject.soldItems?.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="bg-neutral text-gray-500">You haven't sold any items yet</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {/* Sold items will be displayed here */}
                        <p className="text-gray-500">Coming soon...</p>
                      </div>
                    )}
                  </div>
                )}
    
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}