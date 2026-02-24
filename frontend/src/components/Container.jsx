export default function Container({ item, setViewingItemID }) {
  return (
    <div onClick={() => {setViewingItemID(item._id);}}
    className="border border-amber-700 bg-black p-4 rounded-lg shadow-md w-60 hover:scale-105 transition-transform duration-200 cursor-pointer">
      
      <img
        src={item.imageURL}
        alt={item.name}
        className="w-full h-40 object-cover rounded"
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