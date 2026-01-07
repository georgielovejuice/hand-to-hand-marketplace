import React, { useEffect, useMemo, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Hard-coded users for prototype login
const USERS = [
  { username: "alice", password: "alice123" },
  { username: "bob", password: "bob123" },
  { username: "carol", password: "carol123" }
];

export default function App() {
  const [me, setMe] = useState("alice");
  const [withUser, setWithUser] = useState("bob");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const creds = useMemo(() => USERS.find(u => u.username === me), [me]);
  const bottomRef = useRef(null);

  async function loadMessages() {
    if (!creds) return;
    setError("");

    const res = await fetch(`${API_URL}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: creds.username,
        password: creds.password,
        withUser
      })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Failed to load messages");
      return;
    }
    setMessages(data.messages || []);
  }

  async function send() {
    if (!creds) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    setText("");
    setError("");

    const res = await fetch(`${API_URL}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: creds.username,
        password: creds.password,
        to: withUser,
        text: trimmed
      })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Failed to send");
      return;
    }

    await loadMessages();
  }

  // "braindead" polling
  useEffect(() => {
    loadMessages();
    const id = setInterval(loadMessages, 1500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, withUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <div>
        <div>Logged in as:</div>
        <select value={me} onChange={(e) => setMe(e.target.value)}>
          {USERS.map(u => (
            <option key={u.username} value={u.username}>{u.username}</option>
          ))}
        </select>
      </div>

      <div>
        <div>Talking to:</div>
        <select value={withUser} onChange={(e) => setWithUser(e.target.value)}>
          {USERS.filter(u => u.username !== me).map(u => (
            <option key={u.username} value={u.username}>{u.username}</option>
          ))}
        </select>
      </div>

      <hr />

      <div>Chat with: <b>{withUser}</b></div>
      {error ? <div>{error}</div> : null}

      <div>
        {messages.map(m => (
          <div key={m._id}>
            <b>{m.from}</b>: {m.text}{" "}
            <small>({new Date(m.sentAt).toLocaleString()})</small>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <hr />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        onKeyDown={(e) => { if (e.key === "Enter") send(); }}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
