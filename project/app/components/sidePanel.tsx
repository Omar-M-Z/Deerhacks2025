import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

interface OpenAlexPaper {
    display_name?: string;
    doi?: string;
    publication_year?: number;
    type?: string;
    abstract_inverted_index?: Record<string, number[]>;
}

/**
 * Reconstructs an abstract string from the inverted index provided by OpenAlex.
 * @param invertedIndex A record where keys are words and values are arrays of positions.
 * @returns The reconstructed abstract string.
 */
function reconstructAbstract(invertedIndex: Record<string, number[]>): string {
    // Determine the maximum index in the inverted index.
    let maxIndex = 0;
    Object.values(invertedIndex).forEach((positions) => {
        positions.forEach((pos) => {
            if (pos > maxIndex) maxIndex = pos;
        });
    });

    // Initialize an array with empty strings to hold the words.
    const words = new Array(maxIndex + 1).fill("");

    // Place each word at its respective positions.
    Object.entries(invertedIndex).forEach(([word, positions]) => {
        positions.forEach((pos) => {
            words[pos] = word;
        });
    });

    // Join the words to form the full abstract.
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
            <SheetTitle>
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
                                <p>{reconstructAbstract(paperData.abstract_inverted_index)}</p>
                            ) : (
                                <p>No abstract available.</p>
                            )}
                        </div>
                    </div>
                )}
            </SheetContent>
            </SheetTitle>
        </Sheet>
    );
}
