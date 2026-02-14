import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axio";
import AuthLayout from "../components/Layout";

export default function Register() {
    const [form, setForm] = useState({name:"",email:"",password:""});
    const navigate = useNavigate();
    const submit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/register", form);
            navigate("/login");
        } catch (err) {
            console.error("Registration failed", err);
    }}
    return (
    <>
    <AuthLayout title="SIGNUP">
    <form onSubmit={submit} className="w-full flex flex-col gap-6">
      <input className="input" placeholder="username" onChange={e=>setForm({...form,name:e.target.value})}/>
      <input className="input" placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
      <input className="input" type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
      <button className="self-center px-8 py-3 text-black text-lg bg-orange-400 rounded-xl hover:bg-orange-500 transition ">Sign up</button>
      <div className="flex justify-center items-center gap-2">
      <span className="text-black">if you already have an account?</span>
      <Link to="/login" className="underline text-blue-700 hover:text-blue-900">Login</Link>
      </div>
    </form>
    </AuthLayout>
    </>
    )
}