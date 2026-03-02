import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({ setSearchText, fetchItems }) {
  const [query, setQuery] = useState("");

  async function sendSearchText(htmlEvent) {
    htmlEvent.preventDefault();
    setSearchText(query);
  }

  return (
    <form onSubmit={(htmlEvent) => {
        sendSearchText(htmlEvent);
        fetchItems();
      }} 
      className="relative w-full max-w-lg mx-auto pt-6"
    >
      <input
        type="text"
        placeholder="Search marketplace items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 
                   focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm"
      />
      <button 
        className="absolute right-4 top-9 text-gray-500"
      ><FontAwesomeIcon icon={faSearch} />
      </button>
    </form>
  );
}