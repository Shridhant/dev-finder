import React, { useState, useEffect, useCallback } from "react";
import Input from "./components/Input";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Debounce the searchTerm with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    // Cleanup function to clear the timeout if searchTerm changes
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // useEffect to fetch data when debouncedSearchTerm changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      async function fetchData() {
        try {
          const res = await fetch(
            `https://api.github.com/users/${debouncedSearchTerm}`
          );
          if (!res.ok) {
            throw new Error(`User not found. Status: ${res.status}`);
          }
          const data = await res.json();
          setResults(data);

          setError(null); // Clear any previous errors
        } catch (err) {
          setError(err.message);
          setResults(null); // Clear previous results
        }
      }

      fetchData();
    }
  }, [debouncedSearchTerm]);

  // Handle the input search term change
  const handleSearch = useCallback((inputValue) => {
    setSearchTerm(inputValue);
  }, []);

  return (
    <div>
      <h1
        className="text-center font-extrabold mt-5"
        style={{
          fontFamily: "'ITC Souvenir Std Demi', sans-serif",
          fontSize: "4rem", // Make sure to wrap values with units in quotes
          fontWeight: "bold",
          lineHeight: 1.2,
          color: "#333",
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
          letterSpacing: "0.05em",
        }}
      >
        DEV.FINDER
      </h1>

      <Input gitsearch={handleSearch} />
      <div className="results mt-5 text-center">
        {error && <p className="text-red-500">{error}</p>}
        {results && (
          <div className="flex p-2 max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mt-5">
            <img
              className="w-32 h-32 rounded-full object-cover"
              src={results.avatar_url}
              alt={`${results.login}'s avatar`}
            />
            <div className="p-5 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {results.name || "No Name Provided"}
              </h2>
              <p className="text-gray-500 mb-2">@{results.login}</p>
              <div className="flex justify-center gap-4 mt-4">
                <div>
                  <p className="text-gray-700 font-semibold">
                    {results.followers}
                  </p>
                  <p className="text-gray-500 text-sm">Followers</p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">
                    {results.following}
                  </p>
                  <p className="text-gray-500 text-sm">Following</p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">
                    {results.public_repos}
                  </p>
                  <p className="text-gray-500 text-sm">Repos</p>
                </div>
              </div>
              <a
                href={results.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
              >
                View Profile
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
