export default function HomeTab({
	redirectToBrowsePage,
	redirectToChatsPage,
	redirectToMyListingsPage,
	redirectToProfilePage,
	username,
	userProfilePictureURL,
	logout,
}){
	return (
		<nav className="bg-white shadow-md border-b border-orange-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
							<span className="text-white text-xl font-bold">H2H</span>
						</div>
						<span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
							Hand2Hand
						</span>
					</div>

					{/* Nav Links */}
					<div className="hidden md:flex items-center gap-6">
						<button onClick={redirectToBrowsePage} className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
							Marketplace
						</button>
						<button onClick={redirectToChatsPage} className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
							Chats
						</button>
						<button onClick={redirectToMyListingsPage} className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
							My Listings
						</button>
						
						{/* Profile Picture & Dropdown */}
						<div className="dropdown dropdown-end">
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

					{/* Mobile Menu Button */}
					<button className="md:hidden btn btn-ghost btn-circle">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
						</svg>
					</button>
				</div>
			</div>
		</nav>
	);
}