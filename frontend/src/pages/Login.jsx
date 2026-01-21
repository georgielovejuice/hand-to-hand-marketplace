import { useState } from "react";
import Hashes from 'jshashes/hashes.js';

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
		const hashedPassword = (new Hashes.SHA256()).hex(form.password.trim());
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
					password: hashedPassword
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
				email: form.email,
				hashedPassword: hashedPassword,
				name: objectFromResponse.name || 'User',
				profilePictureURL: objectFromResponse.profilePicture || placeholderProfilePictureURL,
				phoneNumber: objectFromResponse.phone || ''
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-base-content/60 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <label className="label">
                <button href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </button>
              </label>
            </div>

            {error && (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full`}
            >
              "Login"
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-base-content/60">
            Don't have an account?{" "}
            <button
              onClick={() => redirectToRegister()}
              className="link link-primary font-semibold"
              type="button"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}