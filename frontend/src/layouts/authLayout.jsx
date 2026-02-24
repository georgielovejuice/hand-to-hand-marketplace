export default function AuthLayout({ title, children}) {
  return (
    <>
    <div className="min-h-screen flex flex-row bg-[#FFF1C7]">
        <div className="w-1/3 bg-[rgb(194,106,46)] justify-start items-start flex flex-col ite shrink-0">
          <img src="auth_bg.jpg" className="inline-block h-[100%] object-cover"/>
          <div className="absolute inline-block top-0 left-0 w-1/3 h-[100%] flex justify-center items-center bg-[rgba(255,185,85,0.8)]">
            <div className="inline-block">
              <h1 className="text-[40px] lg:text-[70px] font-bold text-white mb-0">Hand2Hand</h1>
              <h2 className="text-[20px] lg:text-[30px] text-white font-semibold mt-[-10px]">KMITL Marketplace</h2>
              <p className="text-[24px] text-white font-semibold mt-[50px]">Let's trade! :)</p>
            </div>
          </div>
        </div>

        <div className="w-2/3 flex flex-col shrink-0">
            <h1 className="text-[#F37E00] text-5xl font-bold text-start p-10"> {title} </h1>

          <div className="flex flex-auto items-start">
            {children}
          </div>

        </div>
    </div>
    </>
  );
}