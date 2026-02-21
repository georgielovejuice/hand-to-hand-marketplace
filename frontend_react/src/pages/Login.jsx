import React, {useState} from 'react'
import AuthLayout from '../layouts/authLayout'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import api from '../api/axio';


export default function Login() {
  const [showPassword,setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password){
        alert("please fill all fields")
        return;
    }

    try {
        const response = await api.post("/api/auth/login", {
            email: form.email,
            password: form.password,
    });
        localStorage.setItem("token", response.data.token);
        navigate("/");
  } catch (error) {
    alert(error.response.data.message || "Login failed");
   }
  }

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
          onChange={handleChange}
          type="email"
          placeholder='Email'
          className='mb-5 p-3 rounded-lg border border-gray-400'
        />

        <p className='text-black text-lg'>Password</p>

        <div className="relative">
          <input
            name='password'
            value={form.password}
            onChange={handleChange}
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
            If you don't have an account?{" "}
            <Link
              to="/register"
              className='text-blue-600 underline hover:text-blue-800 transition-colors'
            >
              Sign up
            </Link>
          </p>
        </div>

      </form>
    </AuthLayout>
  );
}