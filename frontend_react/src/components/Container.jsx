export default function Container({ item }) {

  const firstImage =
    item.imageURL
      ? `https://auctionproject-bucket.s3.ap-southeast-1.amazonaws.com/${item.imageUrl}`
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="border border-amber-700 bg-black p-4 rounded-lg shadow-md w-60 hover:scale-105 transition-transform duration-200 cursor-pointer">
      
      <img
        src={firstImage}
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