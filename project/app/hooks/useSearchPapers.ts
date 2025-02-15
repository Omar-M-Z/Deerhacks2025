import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface Paper {
  id: number;
  title: string;
}

interface SearchResponse {
  papers: Paper[];
  error?: string;
}

export function useSearchPapers() {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);

  const searchPapers = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
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
  }, [papers, selectedIndex]);

  const handleSelectPaper = useCallback((paper: Paper) => {
    setQuery(paper.title);
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
    setPapers,
    handleKeyDown,
    handleSelectPaper,
  };
}
