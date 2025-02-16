"use client"
import { useState, useEffect } from "react";
import PaperSearch from "./PaperSearch";
import { FeaturedGrid, SearchResults } from "./paperCard";

interface Paper {
  id: number;
  title: string;
}

export default function LandingPanel() {
  const [searched, setSearched] = useState(false);
  const [featuredPapers, setFeaturedPapers] = useState<Paper[]>([]);
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchFeaturedPapers = async () => {
      try {
        const response = await fetch('/api/papers');
        const data = await response.json();
        setFeaturedPapers(data.papers.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch featured papers:', error);
      }
      setIsLoaded(true);
    };

    fetchFeaturedPapers();
  }, []);

  return (
    <div className={`w-4/5 h-4/5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col 
      transition-all duration-500 ease-out transform 
      ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="p-8 flex flex-col h-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 animate-fade-in">
          PaperOrbit
        </h1>
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 animate-fade-in">
          Naviagate the cosmic network of research
        </h2>

        <div className="relative z-10">
          <PaperSearch
            onSearch={(results) => {
              if (results.length === 0) {
                setSearched(false);
                setSearchResults([]);
              } else {
                setSearched(true);
                setSearchResults(results);
              }
            }}
          />
        </div>

        {/* Added pt-2 to account for hover effects at the top */}
        <div className="mt-6 flex-1 min-h-0 pt-2">
          {!searched && featuredPapers.length > 0 && (
            <div className="h-full flex flex-col animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                Featured Papers
              </h2>
              <div className="flex-1 min-h-0 overflow-hidden">
                <FeaturedGrid papers={featuredPapers} />
              </div>
            </div>
          )}

          {searched && (
            <div className="h-full flex flex-col animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                Search Results
              </h2>
              <div className="flex-1 min-h-0 overflow-hidden">
                <SearchResults papers={searchResults} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
