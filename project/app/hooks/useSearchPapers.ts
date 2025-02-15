import { useState, useEffect, useCallback } from 'react';
import { SearchResponse } from '../types/index';
import { useDebounce } from './useDebounce';

export function useSearchPapers() {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);

  const searchPapers = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setPapers([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/papers?q=${encodeURIComponent(searchQuery)}`);
      const data: SearchResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search papers');
      }

      setPapers(data.papers);
      setSelectedIndex(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPapers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchPapers(debouncedQuery);
  }, [debouncedQuery, searchPapers]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (papers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < papers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectPaper(papers[selectedIndex]);
        }
        break;
      case 'Escape':
        setPapers([]);
        setSelectedIndex(-1);
        break;
    }
  }, [papers]);

  const handleSelectPaper = useCallback((paper: string) => {
    setQuery(paper);
    setPapers([]);
    setSelectedIndex(-1);
  }, []);

  return {
    query,
    papers,
    isLoading,
    error,
    selectedIndex,
    setQuery,
    handleKeyDown,
    handleSelectPaper,
  };
}
