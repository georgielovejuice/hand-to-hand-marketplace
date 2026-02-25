export default function Container({ item, setViewingItemID }) {
  
  return (
    <div onClick={() => {setViewingItemID(item._id);}}
    className="relative border border-amber-700 bg-black p-4 rounded-lg shadow-md w-60 hover:scale-105 transition-transform duration-200 cursor-pointer">
      
      {
        (item.status === "sold") &&
        <div className="absolute top-0 left-0 z-10 w-[100%] h-[100%] flex justify-center items-center bg-[rgba(127,127,127,0.9)]">
          <p className="font-semibold text-[18px]">This item is sold.</p>
        </div>
      }
      
      <img
        src={item.imageURL}
        alt={item.name}
        className="top-0 w-full h-40 object-cover rounded"
      />

      <div className="mt-2 text-white">
        <h2 className="font-semibold text-lg truncate">
          {item.name}
        </h2>

        <p className="text-amber-400 font-bold">
          {item.priceTHB} ฿
        </p>

        <p className="text-sm text-gray-400">
          {item.location}
        </p>
      </div>
    </div>
  );
}