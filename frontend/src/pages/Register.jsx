import { useState } from "react";
import Hashes from 'jshashes/hashes.js';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-base-content/60 mb-6">Sign up to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Username</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="johndoe"
                value={form.username}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

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
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-base-content/60">
            Already have an account?{" "}
            <button 
              onClick={() => redirectToLogin()}
              className="link link-primary font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}