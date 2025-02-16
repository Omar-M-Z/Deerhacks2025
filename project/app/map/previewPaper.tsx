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
}

export function ShowPreview({ paperID, showingDialog, onShowingDialogChange }: ShowPreviewProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const router = useRouter();

    const paperDetails = getPaperDetails(paperID);

    useEffect(() => {
        const handleMouseMove = (e: any) => {
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
                        <Button 
                        style={{ marginTop: "10px" }}
                        onClick={() => {
                            router.push(`/map/?id=${paperDetails.id}`)
                        }}>
                            Make Center {/* TODO: make this push user to link of that node*/}
                        </Button>
                        <ResearchPaperSheet paperId="asdf"isOpen={sidebarOpen} onOpenChange={setSideBarOpen}></ResearchPaperSheet>
                    </div>
                </PopoverContent>
            </Popover>
        </main>
    );
}
