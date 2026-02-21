import React from 'react'
import { Link } from 'react-router'

export default function Navbar() {
  return (
    <>
    <div className='navbar bg-[rgb(255,202,141)] shadow-md justify-between px-6'>
        <div className='flex'>
            <div className='w-14 bg-orange-950 flex flex-col p-2 text-center text-lg'>H2H</div>
            <div className='mt-1 ml-2'>
                <h1 className='text-black text-2xl font-semibold'>Hand2Hand</h1>
            </div>
        </div>

        <div className='flex'>
            <div className="px-3 py-2 text-md text-black text-lg hover:underline transition hover:bg-orange-700"><Link to="/myitem">My Item</Link></div>
            <div className="px-3 py-2 text-md text-black text-lg hover:underline transition hover:bg-orange-700"><Link to="/myitem">Marketplace</Link></div>
            <div className="px-3 py-2 text-md text-black text-lg hover:underline transition hover:bg-orange-700"><Link to="/myitem">Chats</Link></div>
            <div className="px-3 py-2 text-md text-black text-lg hover:underline transition hover:bg-orange-700"><Link to="/myitem">Cart</Link></div>

            <div className='bg-orange-900 p-6 items-center rounded-2xl ml-2'>
             
            {/* pfp image implement here */}

            </div>
        </div>

    </div>
    </>

  )
}
