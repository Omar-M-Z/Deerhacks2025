import React, { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet"; // Adjust the import paths as needed
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Define the type for the research paper data returned by OpenAlex.
// Adjust the interface as needed based on the actual API response.
interface OpenAlexPaper {
  display_name?: string;
  doi?: string;
  publication_year?: number;
  type?: string;
  abstract_inverted_index?: Record<string, any>;
}

// Props for the ResearchPaperSheet component.
interface ResearchPaperSheetProps {
  paperId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResearchPaperSheet: React.FC<ResearchPaperSheetProps> = ({
  paperId,
  isOpen,
  onOpenChange,
}) => {
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
      <SheetContent className="bg-white p-4">
        {loading && <p>Loading paper data...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {paperData && (
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {paperData.display_name || "Untitled Paper"}
            </h2>
            <p>
              <strong>DOI:</strong> {paperData.doi || "N/A"}
            </p>
            <p>
              <strong>Publication Year:</strong> {paperData.publication_year || "N/A"}
            </p>
            <p>
              <strong>Type:</strong> {paperData.type || "N/A"}
            </p>
            <div className="mt-4">
              <strong>Abstract:</strong>
              {paperData.abstract_inverted_index ? (
                <p>
                  {/* 
                    The abstract is returned as an inverted index.
                    You might implement a function to reconstruct the actual abstract text.
                  */}
                  [Abstract available. Processing inverted index required.]
                </p>
              ) : (
                <p>No abstract available.</p>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
