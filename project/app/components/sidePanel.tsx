import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

interface OpenAlexPaper {
  display_name?: string;
  doi?: string;
  publication_year?: number;
  type?: string;
  abstract_inverted_index?: Record<string, number[]>;
  // Additional fields:
  authorships?: Array<{
    author: {
      id: string;
      display_name: string;
    };
  }>;
  keywords?: string[];
  concepts?: Array<{
    id: string;
    display_name: string;
  }>;
  topics?: Array<{
    id: string;
    display_name: string;
  }>;
}

/**
 * Reconstructs an abstract string from the inverted index provided by OpenAlex.
 * @param invertedIndex A record where keys are words and values are arrays of positions.
 * @returns The reconstructed abstract string.
 */
function reconstructAbstract(invertedIndex: Record<string, number[]>): string {
  let maxIndex = 0;
  Object.values(invertedIndex).forEach((positions) => {
    positions.forEach((pos) => {
      if (pos > maxIndex) maxIndex = pos;
    });
  });

  const words = new Array(maxIndex + 1).fill("");
  Object.entries(invertedIndex).forEach(([word, positions]) => {
    positions.forEach((pos) => {
      words[pos] = word;
    });
  });

  return words.join(" ");
}

export function ResearchPaperSheet({
  paperId,
  isOpen,
  onOpenChange,
}: {
  paperId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [paperData, setPaperData] = useState<OpenAlexPaper | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paperId && isOpen) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setPaperData(null);
        try {
          console.log("fetching data for paperId:" + paperId);
          const response = await fetch(`https://api.openalex.org/works/${paperId}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data: OpenAlexPaper = await response.json();
          setPaperData(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [paperId, isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {/* Adjust width as needed */}
      <SheetContent className="bg-white text-black p-4" style={{ maxWidth: '30vw' }}>
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {paperData?.display_name || "Untitled Paper"}
          </SheetTitle>
        </SheetHeader>
        {loading && <p>Loading paper data...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {paperData && (
          <div>
            {paperData.doi ? (
              <p>
                <strong>DOI:</strong>{" "}
                <a
                  href={`https://doi.org/${paperData.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {paperData.doi}
                </a>
              </p>
            ) : (
              <p>
                <strong>DOI:</strong> N/A
              </p>
            )}
            <p>
              <strong>Publication Year:</strong> {paperData.publication_year || "N/A"}
            </p>
            <p>
              <strong>Type:</strong> {paperData.type || "N/A"}
            </p>
            {/* Authors */}
            {paperData.authorships && paperData.authorships.length > 0 && (
              <div className="mt-2">
                <strong>Authors:</strong>{" "}
                {paperData.authorships
                  .map((auth) => auth.author.display_name)
                  .join(", ")}
              </div>
            )}
            {/* Keywords */}
            {paperData.keywords && paperData.keywords.length > 0 && (
              <div className="mt-2">
                <strong>Keywords:</strong> {paperData.keywords.join(", ")}
              </div>
            )}
            {/* Concepts */}
            {paperData.concepts && paperData.concepts.length > 0 && (
              <div className="mt-2">
                <strong>Concepts:</strong>{" "}
                {paperData.concepts
                  .map((concept) => concept.display_name)
                  .join(", ")}
              </div>
            )}
            {/* Topics */}
            {paperData.topics && paperData.topics.length > 0 && (
              <div className="mt-2">
                <strong>Topics:</strong>{" "}
                {paperData.topics
                  .map((topic) => topic.display_name)
                  .join(", ")}
              </div>
            )}
            <div className="mt-4">
              <strong>Abstract:</strong>
              {paperData.abstract_inverted_index ? (
                <p>{reconstructAbstract(paperData.abstract_inverted_index)}</p>
              ) : (
                <p>No abstract available.</p>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
