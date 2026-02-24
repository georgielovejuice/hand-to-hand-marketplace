import { useState } from "react";

import AuthLayout from '../layouts/authLayout'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Login({
	credentialsVerifierURL, 
	redirectToHome, 
	redirectToRegister, 
	setUserObject,
}){
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      response = await fetch(credentialsVerifierURL, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				/*
				Raises TypeError if the parameter object has a circular reference 
				or BigInt value is in the parameter object
				*/
				body: JSON.stringify({
					email: form.email.trim(),
					password: form.password.trim(),
				})
			});
		}catch(err){
				//No catch for AbortError, React couldn't find its definition
				if(err instanceof TypeError) setError("Couldn't connect to server.");		
				else setError("Error: " + err);
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

			const placeholderProfilePictureURL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
			setUserObject({
        _id: objectFromResponse.safeUser._id,
				token: objectFromResponse.token,
				name: objectFromResponse.safeUser.name || 'User',
				profilePictureURL: objectFromResponse.safeUser.profilePicture || placeholderProfilePictureURL,
				phoneNumber: objectFromResponse.safeUser.phone || '',
        preferences: objectFromResponse.safeUser.preferences,
			});

			redirectToHome();
    } catch (err) {
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) setError("Couldn't decode body of server response.");		
			if(err instanceof SyntaxError) setError("Couldn't parse JSON response from server.");						
			else setError("Error: " + err);
		}
  };

  return (
    <AuthLayout title="Login">

      <form
        onSubmit={handleSubmit}
        className='w-full flex flex-col px-5 ml-4 mr-5'
      >

        <p className='text-black text-lg'>Email</p>
        <input
          name='email'
          value={form.email}
          onChange={(htmlEvent) => {setForm({...form, email: htmlEvent.target.value})}}
          type="email"
          placeholder='Email'
          className='mb-5 p-3 rounded-lg border border-gray-400'
        />

        <p className='text-black text-lg'>Password</p>

        <div className="relative">
          <input
            name='password'
            value={form.password}
            onChange={(htmlEvent) => {setForm({...form, password: htmlEvent.target.value})}}
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            className='w-full p-3 pr-10 rounded-lg border border-gray-400 outline-none'
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className='mt-10 flex flex-col justify-center items-center'>
          <button
            type="submit"
            className='w-40 bg-[rgb(243,126,0)] text-black text-lg px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300'
          >
            Login
          </button>

          <p className='mt-1 text-black text-lg'>
            If you don't have an account{" "}
            <button onClick={redirectToRegister} className="text-orange-400 font-semibold">Sign up</button>
          </p>
        </div>

      </form>
    </AuthLayout>
  );
}