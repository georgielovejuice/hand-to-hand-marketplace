import React, { useState } from 'react'
import AuthLayout from '../layouts/authLayout'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import api from '../api/axio'

export default function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", response.data.token);
      alert("Registration successful");
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
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
          onChange={handleChange}
          type="text"
          placeholder='Username'
          className='mb-5 p-3 rounded-lg border border-gray-400'
        />

        <p className='text-black text-lg'>Email</p>
        <input
          name='email'
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder='Email'
          className='mb-5 p-3 rounded-lg border border-gray-400'
        />


        <p className='text-black text-lg'>Password</p>
        <div className="relative mb-5">
          <input
            name='password'
            value={form.password}
            onChange={handleChange}
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
            onChange={handleChange}
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
            <Link
              to="/login"
              className='text-blue-600 underline hover:text-blue-800 transition-colors'
            >
              Login
            </Link>
          </p>
        </div>

      </form>
    </AuthLayout>
  );
}