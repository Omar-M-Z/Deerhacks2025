import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PopoverAnchor } from "@radix-ui/react-popover";

const getPaperDetails = (paperID: string) => {
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
                        <Button style={{ marginTop: "10px" }}>
                            Make Center
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </main>
    );

    /*
    return (
        <main>
            <Dialog open={showingDialog} onOpenChange={onShowingDialogChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{paperDetails.title}</DialogTitle>
                        <DialogDescription>
                            <strong>Link:</strong> <a href={paperDetails.link} target="_blank" rel="noopener noreferrer">{paperDetails.link}</a><br/>
                            <strong>Cited By:</strong> {paperDetails.citedBy}
                        </DialogDescription>
                    </DialogHeader>
                    <Button>
                        Make Center
                    </Button>
                </DialogContent>
            </Dialog>
        </main>
    );*/
}
