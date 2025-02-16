import { ResearchPaperSheet } from "../components/sidePanel";
import {
    Popover,
    PopoverContent,
} from "@/components/ui/popover"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { useRouter } from 'next/navigation';

const getPaperDetails = (paperID: string) => {
    // TODO: get paper details for nodes
    const title = "asdf";
    const link = "google.com";
    const citedBy = 5;
    const id = "asdf";
    return { title, link, citedBy, id};
}

interface ShowPreviewProps {
    paperID: string; // Define the paperID prop if needed
    showingDialog: boolean
    onShowingDialogChange: any
    paperLink: string,
    paperTitle: string
}

export function ShowPreview({ paperID, showingDialog, onShowingDialogChange, paperLink, paperTitle }: ShowPreviewProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const router = useRouter();

    // Function to truncate the title after 50 characters
    const truncateTitle = (title: any, maxLength: number = 50) => {
        const strTitle = String(title);
        console.log(strTitle.length)
        return strTitle.length > maxLength ? strTitle.slice(0, maxLength) + "..." : strTitle;
      };

    useEffect(() => {
        paperTitle = truncateTitle(paperTitle)
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [showingDialog]);

    const style = {
        position: 'absolute',
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
    };

    return (
        <main>
            <Popover open={showingDialog} onOpenChange={onShowingDialogChange}>
                <PopoverAnchor style={style}></PopoverAnchor>
                <PopoverContent>
                    <div className="flex flex-col">
                        <strong>{truncateTitle(paperTitle)}</strong>
                        <div>
                            <strong>Link:</strong> <a href={paperLink} target="_blank" rel="noopener noreferrer">{paperLink}</a>
                        </div>
                        <Button 
                            onClick={() => {
                                setSideBarOpen(true);
                            }}
                            style={{ marginTop: "10px" }}
                        >
                            Read More
                        </Button>
                        <Button 
                            style={{ marginTop: "10px" }}
                            onClick={() => {
                                console.log("asdfasdf");
                                router.push(`/map/?id=${paperID}`);
                            }}
                        >
                            Make Center {/*TODO: make sure this button works*/}
                        </Button>
                        <ResearchPaperSheet paperId={paperID} isOpen={sidebarOpen} onOpenChange={setSideBarOpen}></ResearchPaperSheet>
                    </div>
                </PopoverContent>
            </Popover>
        </main>
    );
}
