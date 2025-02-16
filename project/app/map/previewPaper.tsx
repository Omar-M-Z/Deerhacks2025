import { ResearchPaperSheet } from "../components/sidePanel";
import {
    Popover,
    PopoverContent,
} from "@/components/ui/popover"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";

const getPaperDetails = (paperID: string) => {
    // TODO: get paper details for nodes
    const title = "asdf";
    const link = "google.com";
    const citedBy = 5;
    return { title, link, citedBy };
}

interface ShowPreviewProps {
    paperID: string; // Define the paperID prop if needed
    showingDialog: boolean
    onShowingDialogChange: any
}

export function ShowPreview({ paperID, showingDialog, onShowingDialogChange }: ShowPreviewProps) {
    const paperDetails = getPaperDetails(paperID);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [sidebarOpen, setSideBarOpen] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: any) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [showingDialog]);

    // Define the style to position PopoverAnchor at mouse position
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
                        <strong>{paperDetails.title}</strong>
                        <div>
                            <strong>Link:</strong> <a href={paperDetails.link} target="_blank" rel="noopener noreferrer">{paperDetails.link}</a>
                        </div>
                        <div>
                            <strong>Cited By:</strong> {paperDetails.citedBy}
                        </div>
                        <Button 
                        onClick={() => {
                            setSideBarOpen(true)
                        }}
                        style={{ marginTop: "10px" }}
                        >
                            Read More
                        </Button>
                        <Button style={{ marginTop: "10px" }}>
                            Make Center {/* TODO: make this push user to link of that node*/}
                        </Button>
                        <ResearchPaperSheet paperId="asdf"isOpen={sidebarOpen} onOpenChange={setSideBarOpen}></ResearchPaperSheet>
                    </div>
                </PopoverContent>
            </Popover>
        </main>
    );
}
