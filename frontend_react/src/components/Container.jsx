export default function Container({ item }) {

  const imageURL =
    item.images && item.images.length > 0
      ? item.images[0]
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="border border-amber-700 bg-black p-4 rounded-lg shadow-md w-60 hover:scale-105 transition-transform duration-200 cursor-pointer">
      
      <img
        src={imageURL}
        alt={item.name}
        className="w-full h-40 object-cover rounded"
      />

      <div className="mt-2 text-white">
        <h2 className="font-semibold text-lg truncate">
          {item.title}
        </h2>

        <p className="text-amber-400 font-bold">
          {item.price} ฿
        </p>

        <p className="text-sm text-gray-400">
          {item.location}
        </p>
      </div>
    </div>
  );
}