"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { fetchSearch } from "../api/tmdb";
import { SearchResult } from "../types/types";
import logoUrl from "../assets/greenLogo.png";


const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Clear search results and query when page changes
    setSearchQuery("");
    setSearchResults([]);

    // Fetch search results based on query in URL
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get('query') || "";
    setSearchQuery(query);
    if (query.length > 2) {
      const fetchResults = async () => {
        const results = await fetchSearch(query);
        setSearchResults(results?.results || []);
      };
      fetchResults();
    } else {
      setSearchResults([]);
    }

    // Ensure only one of the search box or menu is open at a time
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    if (isMobileSearchOpen) {
      setIsMobileSearchOpen(false);
    }
  }, [pathname]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      const results = await fetchSearch(query);
      setSearchResults(results?.results || []);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.length > 2) {
      router.push(`/search-results?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults([]); // Clear the results after submission
      setSearchQuery(""); // Optionally, clear the search query
    }
  };

  const handleMouseEnter = (id: number) => {
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMobileSearchOpen) {
      setIsMobileSearchOpen(false); // Close mobile search if menu is toggled
    }
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMenuOpen) {
      setIsMenuOpen(false); // Close menu if mobile search is toggled
    }
  };

  const imageUrl = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL || "";

  return (
    <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg text-white py-2 px-6 rounded-full z-50 shadow-md flex items-center justify-between space-x-8 w-auto">
      {/* Logo */}
      <div className="flex items-center hover:text-green cursor-pointer">
        <a href="https://streamly-zeta.vercel.app/">
        <img src={logoUrl.src} alt="Logo" className="h-8 sm:w-20 w-12" />
        </a>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden flex items-center space-x-4">
        {/* Search Icon for Mobile */}
        <button onClick={toggleMobileSearch} className="focus:outline-none">
          <i className="fas fa-search text-lg"></i>
        </button>

        {/* Hamburger Menu */}
        <button onClick={toggleMenu} className="focus:outline-none">
          <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
        </button>
      </div>

      {/* Menu Items (Hidden on small screens, visible on md+) */}
      <ul
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute top-full left-0 w-full bg-mixed-100 text-white rounded-lg shadow-lg md:static md:bg-transparent md:flex space-y-4 md:space-y-0 md:space-x-6 text-sm font-medium p-4 md:p-0`}>
        <li className="hover:text-green cursor-pointer transition-colors duration-300">
          <Link href="https://streamly-zeta.vercel.app/">Home</Link>
        </li>
        <li className="hover:text-green cursor-pointer transition-colors duration-300">
          <Link href="/movies">Movies</Link>
        </li>
        <li className="hover:text-green cursor-pointer transition-colors duration-300">
          <Link href="/tv">TV Shows</Link>
        </li>
      </ul>

      {/* Search Box (Visible on md+ screens) */}
      <div className="relative hidden md:flex items-center">
        <form onSubmit={handleSearchSubmit} className="w-56">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-4 pr-10 py-1 rounded-full bg-transparent border border-white/30 text-green text-vsmall placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green transition duration-300 ease-in-out w-full"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green">
            <i className="fas fa-search"></i>
          </div>
        </form>

        {/* Search Results Dropdown */}
        {searchQuery.length > 2 && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-64 bg-mixed-100 text-white rounded-lg shadow-lg max-h-64 overflow-y-auto">
            <ul>
              {searchResults
                .filter((result) => result.media_type !== "person")
                .map((result) => (
                  <li
                    key={result.id}
                    className={`p-2 ${
                      hoveredId === result.id ? "bg-gray-300" : "hover:bg-gray-200"
                    }`}
                    onMouseEnter={() => handleMouseEnter(result.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link href={`/details?type=${result.media_type}&id=${result.id}`}>
                      <div className="flex items-center space-x-4">
                        {result.poster_path ? (
                          <img
                            src={`${imageUrl}${result.poster_path}`}
                            alt={result.title || result.name}
                            className="w-12 h-12 rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded" />
                        )}
                        <span className="text-sm">{result.title || result.name}</span>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Search Box (Visible when search icon is clicked) */}
      {isMobileSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-mixed-100 p-4 shadow-lg rounded-lg">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-transparent border border-white/30 text-green text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green transition duration-300 ease-in-out"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-green px-4 py-2 rounded-full focus:outline-none"
            >
              <i className="fas fa-search"></i>
            </button>
          </form>

          {/* Search Results Dropdown for Mobile */}
          {searchQuery.length > 2 && searchResults.length > 0 && (
            <div className="mt-2 bg-mixed-100 text-white rounded-lg shadow-lg max-h-64 overflow-y-auto">
              <ul>
                {searchResults
                  .filter((result) => result.media_type !== "person")
                  .map((result) => (
                    <li
                      key={result.id}
                      className={`p-2 ${
                        hoveredId === result.id ? "bg-gray-300" : "hover:bg-gray-200"
                      }`}
                      onMouseEnter={() => handleMouseEnter(result.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link href={`/details?type=${result.media_type}&id=${result.id}`}>
                        <div className="flex items-center space-x-4">
                          {result.poster_path ? (
                            <img
                              src={`${imageUrl}${result.poster_path}`}
                              alt={result.title || result.name}
                              className="w-12 h-12 rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded" />
                          )}
                          <span className="text-sm">{result.title || result.name}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
