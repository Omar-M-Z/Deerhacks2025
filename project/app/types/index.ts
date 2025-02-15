export interface SearchState {
  papers: string[];
  isLoading: boolean;
  error: string | null;
}

export interface SearchResponse {
  papers: string[];
  error?: string;
}
