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

  // Fetch featured papers on component mount
  useEffect(() => {
    const fetchFeaturedPapers = async () => {
      try {
        const response = await fetch('/api/papers');
        const data = await response.json();
        setFeaturedPapers(data.papers.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch featured papers:', error);
      }
    };

    fetchFeaturedPapers();
  }, []);

  return (
    <div className="w-4/5 h-4/5 p-6 bg-white rounded-2xl outline outline-slate-100 shadow-2xl flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 flex-none">
        Research Paper Search
      </h1>

      <div className="flex-none">
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

      <div className="mt-8 flex-1 min-h-0 overflow-hidden">
        {!searched && featuredPapers.length > 0 && (
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 flex-none">Featured Papers</h2>
            <div className="flex-1 min-h-0">
              <FeaturedGrid papers={featuredPapers} />
            </div>
          </div>
        )}

        {searched && (
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 flex-none">Search Results</h2>
            <div className="flex-1 min-h-0">
              <SearchResults papers={searchResults} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
