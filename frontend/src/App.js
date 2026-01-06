import { useState } from "react";
import Login from "./Login";
import MyItems from "./MyItems";

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return <MyItems token={token} />;
}
