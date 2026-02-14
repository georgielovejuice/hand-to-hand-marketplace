export default function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/3 bg-[rgb(194,106,46)] text-black relative p-10 flex flex-col shrink-0">
        <h1 className="text-5xl font-serif mb-6">WELCOME FROM</h1>

        <div className="h-3/4 flex flex-col justify-center items-center">
        <h2 className="text-4xl italic text-center">
          “Hand2Hand” <br /> Marketplace
        </h2>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-2/3 last:bg-[rgb(255,213,167)] flex flex-col shrink-0 ">
       <h1 className="text-black text-5xl font-serif font-bold text-start p-10 "> {title}</h1>
    
       <div className="flex flex-autojustify-center p-9">
        {children}
        </div>
      </div>

    </div>
  );
}