import { Children } from "react";

export default function AuthLayout({ title, children}) {
  return (
    <>
    <div className="min-h-screen flex flex-col lg:flex-row">

        <div className="w-full lg:w-1/3 bg-[rgb(194,106,46)] justify-start items-start p-10 flex flex-col ite shrink-0">
            <h1 className="text-5xl text-black font-serif mb-6">WELCOME FROM</h1>

            <div className=" justify-start items-start flex flex-col mt-20">
            <h2 className="text-4xl text-center italic text-black font-serif mt-40 p-5">"HAND TO HAND" <br/>Market Place</h2>
            </div>
        </div>

        <div className="w-full lg:w-2/3 last:bg-[rgb(255,213,167)] flex flex-col shrink-0">
            <h1 className="text-black text-5xl font-serif font-semibold text-start p-10"> {title} </h1>

          <div className="flex flex-auto items-start">
            {children}
          </div>

        </div>
    </div>
    </>
  );
}