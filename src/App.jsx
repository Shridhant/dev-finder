import React, { useState, useEffect, useCallback } from "react";
import Input from "./components/Input";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1); // Page for pagination
  const [totalPages, setTotalPages] = useState(0); // Fix total pages calculation

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      async function fetchData() {
        try {
          // Fetch user profile
          const res = await fetch(
            `https://api.github.com/users/${debouncedSearchTerm}`
          );
          if (!res.ok) {
            throw new Error(`User not found. Status: ${res.status}`);
          }
          const data = await res.json();
          setResults(data);
          setError(null);

          // Calculate total pages
          const calculatedTotalPages = Math.ceil(data.public_repos / 5);
          setTotalPages(calculatedTotalPages);

          // Fetch repositories for the first page
          fetchRepos(1, data.login);
        } catch (err) {
          setError(err.message);
          setResults(null);
          setRepos([]);
          setTotalPages(0);
        }
      }

      fetchData();
    }
  }, [debouncedSearchTerm]);

  const fetchRepos = async (pageNum, login) => {
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${login || debouncedSearchTerm}/repos?page=${pageNum}&per_page=5` // 5 repos per page
      );
      if (!reposRes.ok) {
        throw new Error(`Failed to fetch repositories.`);
      }
      const reposData = await reposRes.json();
      setRepos(reposData);
    } catch (err) {
      setError("Error fetching repositories");
      setRepos([]);
    }
  };

  const handleSearch = useCallback((inputValue) => {
    setSearchTerm(inputValue);
  }, []);

  const handleNextPage = () => {
    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      setPage(nextPage);
      fetchRepos(nextPage, results?.login);
    }
  };

  const handlePrevPage = () => {
    const prevPage = page - 1;
    if (prevPage > 0) {
      setPage(prevPage);
      fetchRepos(prevPage, results?.login);
    }
  };

  return (
    <div className="min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <h1 className="text-center font-extrabold mt-5 text-4xl sm:text-5xl md:text-6xl text-gray-800 shadow-sm">
        DEV.FINDER
      </h1>

      <Input gitsearch={handleSearch} />
      <div className="results mt-5 text-center px-4">
        {error && <p className="text-red-500">{error}</p>}
        {results && (
          <div className="flex flex-col sm:flex-row items-center sm:items-start p-4 max-w-lg mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mt-5 space-y-4 sm:space-y-0 sm:space-x-4">
            <img
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
              src={results.avatar_url}
              alt={`${results.login}'s avatar`}
            />
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {results.name || "No Name Provided"}
              </h2>
              <p className="text-gray-500 mb-2">@{results.login}</p>
              <div className="flex justify-center sm:justify-start gap-6 mt-4">
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

        {/* Repositories Section */}
        {repos.length > 0 && (
          <div className="repos mt-10 mx-auto max-w-4xl">
            <h2 className="text-xl font-bold mb-5 text-gray-800">Repositories</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="bg-gray-100 p-4 rounded-md shadow hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-blue-600">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {repo.name}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {repo.description || "No description available."}
                  </p>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🍴 {repo.forks_count}</span>
                    <span>🔄 {repo.language || "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
