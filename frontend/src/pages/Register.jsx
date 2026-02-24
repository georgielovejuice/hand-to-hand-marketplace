import { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import AuthLayout from '../layouts/authLayout'

export default function Register({
	registrationURL, 
	redirectToLogin
}){
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

		let response = null;
		const trimmedEmail = form.email.trim();
		const trimmedName = form.name.trim();
    try {
			/*
			Based on Window.fetch(), raises
			- AbortError if abort() is called
			- TypeError if
				- request URL is invalid
				- request URL contains credentials like username or password
				- request blocked by permissions policy
				- network error
			NotAllowedError is irrelevant for use case
			- from await
			*/
      response = await fetch(registrationURL, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				/*
				Raises TypeError if the parameter object has a circular reference 
				or BigInt value is in the parameter object
				*/
				body: JSON.stringify({
					name: trimmedName,
					email: trimmedEmail,
					password: form.password.trim()
				}),
			});
		}catch(err){
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) setError("Couldn't connect to the server.");
			else setError("Error: " + err);
			setLoading(false);
			return;
		}

		if(response.ok){
			redirectToLogin();
			return;
		}
			
		try{
			//404 returns HTML page which isn't json and response.json cannot parse it.
			if(response.status === 404){
				setError("API endpoint " + registrationURL + " not found.");
				return;
			}
			
			/*
			Raises
			- AbortError if abort() is called
			- TypeError if couldn't decode response body
			- SyntaxError if body couldn't be parsed as json
			- something from await
			*/
			const objectFromResponse = await response.json();
			setError(objectFromResponse.message ? objectFromResponse.message 
								: "Received HTTP status " + response.status + " from server.");
    } catch (err) {
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) setError("Couldn't decode response body from server.");		
			else if(err instanceof SyntaxError) setError("Couldn't parse JSON response from server.");						
			else setError("Error: " + err);
		}
		setLoading(false);
  };

  return (
    <AuthLayout title="Sign Up">

      <form
        onSubmit={handleSubmit}
        className='w-full flex flex-col px-5 ml-4 mr-5'
      >

        <p className='text-black text-lg'>Username</p>
        <input
          name='name'
          value={form.name}
          onChange={(htmlEvent) => {setForm({...form, name: htmlEvent.target.value})}}
          type="text"
          placeholder='Username'
          className='mb-5 p-3 rounded-lg border border-gray-400'
        />

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
        <div className="relative mb-5">
          <input
            name='password'
            value={form.password}
            onChange={(htmlEvent) => {setForm({...form, password: htmlEvent.target.value})}}
            type={showPassword ? "text" : "password"}
            placeholder='At least 6 characters'
            className='w-full p-3 pr-10 rounded-lg border border-gray-400 outline-none'
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white transition"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <p className='text-black text-lg'>Re-enter Password</p>
        <div className="relative">
          <input
            name='confirmPassword'
            value={form.confirmPassword}
            onChange={(htmlEvent) => {setForm({...form, confirmPassword: htmlEvent.target.value})}}
            type={showConfirmPassword ? "text" : "password"}
            placeholder='Enter your password again'
            className='w-full p-3 pr-10 rounded-lg border border-gray-400 outline-none'
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white transition"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className='mt-10 flex flex-col justify-center items-center'>
          <button
            type="submit"
            className='w-40 bg-[rgb(243,126,0)] text-black text-lg px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300'
          >
            Sign up
          </button>

          <p className='mt-1 text-black text-lg'>
            Already have an account?{" "}
            <button onClick={redirectToLogin} className="text-orange-400 font-semibold">Log in</button>
          </p>
        </div>

      </form>
    </AuthLayout>
  );
}