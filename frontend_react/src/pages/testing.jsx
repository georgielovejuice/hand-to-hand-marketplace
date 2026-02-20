import React from 'react'
import AuthLayout from '../layouts/authLayout'
import { Link } from 'react-router-dom'

export default function Test() {

    return(
        <>
        <AuthLayout title="Sign Up">
            <div className='w-full flex flex-col px-5 ml-4 mr-5'>
                <p className='text-black text-lg'>Username</p>
                <input type="username" placeholder='Username' className='mb-5 p-3 rounded-lg border border-gray-400' />

                <p className='text-black text-lg'>Email</p>
                <input type="email" placeholder='Email' className='mb-5 p-3 rounded-lg border border-gray-400' />

                <p className='text-black text-lg'>Password</p>
                <input type="password" placeholder='At Least 6 letters' className='p-3 rounded-lg border border-gray-400 mb-5' />

                <p className='text-black text-lg'>Re-enter Password</p>
                <input type="password" placeholder='Enter your password again' className='p-3 rounded-lg border border-gray-400' />


                <div className='mt-10 flex flex-col justify-center items-center'>
                    <button className='w-40 bg-[rgb(243,126,0)] text-black text-lg px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300'>
                        Sign Up
                    </button>

                    <p className='mt-1 text-black text-lg'>Already have an account? <Link to="/login" className='text-blue-600 underline hover:text-blue-800 transition-colors'>Login</Link></p>
                </div>
            </div>


        </AuthLayout>
        </>
    )
}