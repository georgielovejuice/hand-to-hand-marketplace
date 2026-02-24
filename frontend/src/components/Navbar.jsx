export default function Navbar({
    redirectToBrowsePage,
	redirectToChatsPage,
	redirectToMyListingsPage,
	redirectToProfilePage,
	username,
	userProfilePictureURL,
	logout,
}) {
  return (
    <div className='navbar bg-[rgb(255,202,141)] shadow-md justify-between px-6'>
        <div className='flex'>
            <div className='w-14 bg-orange-950 flex flex-col p-2 text-center text-lg'>H2H</div>
            <div className='mt-1 ml-2'>
                <h1 className='text-black text-2xl font-semibold'>Hand2Hand</h1>
            </div>
        </div>

        <div className='flex'>
            <div onClick={redirectToMyListingsPage} className="px-3 py-2 text-md text-black text-lg hover:underline transition hover:bg-orange-700">My Items</div>
            <div onClick={redirectToBrowsePage} className="px-3 py-2 text-md text-black text-lg hover:underline transition hover:bg-orange-700">Marketplace</div>
            <div onClick={redirectToChatsPage} className="px-3 py-2 text-md text-black text-lg hover:underline transition hover:bg-orange-700">Chats</div>
            <div className="px-3 py-2 text-md text-black text-lg hover:underline transition hover:bg-orange-700">Cart</div>

            <div className="ml-[15px] mr-[15px] dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full ring ring-orange-400 ring-offset-2">
                        <img src={userProfilePictureURL || "https://via.placeholder.com/150"} alt="Profile" />
                    </div>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-orange-100 rounded-box w-52 border border-orange-100">
                    <li className="menu-title">
                        <span className="text-gray-700">{username || "User"}</span>
                    </li>
                    <li>
                        <button onClick={redirectToProfilePage} className="bg-zinc-950 text-white hover:bg-zinc-800 hover:text-orange-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            Profile
                        </button>
                    </li>
                    <li>
                        <button onClick={logout} className="bg-zinc-950   text white hover:bg-zinc-800 hover:text-orange-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}
