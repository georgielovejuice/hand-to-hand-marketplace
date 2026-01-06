import { useEffect, useState } from "react";

export default function MyItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/my-items")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <div>
      <h1>My Items</h1>
      {items.map(item => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>{item.price}</p>
          <button onClick={() => deleteItem(item._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
