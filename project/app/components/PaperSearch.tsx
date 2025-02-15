"use client"

import { useSearchPapers } from '../hooks/useSearchPapers';
import { Search } from 'lucide-react';

export default function PaperSearch() {
  const {
    query,
    papers,
    isLoading,
    error,
    setQuery,
    selectedIndex,
    handleKeyDown,
    handleSelectPaper,
  } = useSearchPapers();

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search research papers..."
            className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 shadow-sm text-black placeholder-gray-500"
            aria-label="Search papers"
            aria-expanded={papers.length > 0}
            role="combobox"
            aria-controls="search-suggestions"
            aria-autocomplete="list"
          />
          <Search
            className={`absolute right-4 top-4 ${isLoading ? 'animate-spin' : ''} text-gray-400`}
            size={20}
          />
        </div>

        {papers.length > 0 && (
          <ul
            id="search-suggestions"
            className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
            role="listbox"
          >
            {papers.map((paper, index) => (
              <li
                key={index}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <button
                  onClick={() => handleSelectPaper(paper)}
                  className={`w-full p-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-none text-black
                    ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                >
                  {paper}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div className="text-red-500 mt-2" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
