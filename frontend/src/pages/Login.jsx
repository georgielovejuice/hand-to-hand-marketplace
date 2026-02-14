import { useState } from 'react'
import api from '../api/axio'
import { useNavigate, Link } from 'react-router';
import AuthLayout from '../components/Layout';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState(null)
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/login', form)
      localStorage.setItem('token', data.token)
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`
      setMessage({ type: 'success', text: 'Logged in' })
      navigate('/');
      // redirect or update app state
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Login failed' })
    }
  }

  return (
    <>
    <AuthLayout title="LOGIN">
      <form onSubmit={submit} className='w-full flex flex-col gap-6'>
        <input value={form.email} className="input" placeholder="Email" onChange={e => {setForm({ ...form, email: e.target.value });
        if(message) setMessage(null)}} />
        <input value={form.password} className="input" type="password" placeholder="Password" onChange={e => {setForm({ ...form, password: e.target.value });
        if(message) setMessage(null)}} />
        <button className="self-center px-8 py-3 text-black text-lg bg-orange-400 rounded-xl hover:bg-orange-500 transition ">Log in</button>
              {message && (
  <div
    className={`self-center flex justify-center items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium shadow-md transition-all duration-300
      ${
        message.type === "success"
          ? "bg-green-50 text-green-700 border-green-300"
          : "bg-red-50 text-red-700 border-red-300"
      }`}
  >
    {message.type === "success" ? (
      <span>✅</span>
    ) : (
      <span>❌</span>
    )}
    <span>{message.text}</span>
  </div>
)}

        <div className="flex justify-center items-center gap-2">
      <span className="text-black">if you already have an account?</span>
      <Link to="/register" className="underline text-blue-700 hover:text-blue-900">Signup</Link>
      </div>
      </form>


    </AuthLayout>
    </>
  )
}
