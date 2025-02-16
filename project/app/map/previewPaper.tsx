import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const getPaperDetails = (paperID: string) => {
    const title = "asdf";
    const link = "google.com";
    const citedBy = 5;
    return {title, link, citedBy};
}

interface ShowPreviewProps {
    paperID: string; // Define the paperID prop if needed
    showingDialog: boolean
    onShowingDialogChange: any
}

export function ShowPreview({ paperID, showingDialog, onShowingDialogChange }: ShowPreviewProps) {
    const [open, setOpen] = useState(false);

    // Automatically open the dialog on mount
    useEffect(() => {
        setOpen(true); // Set open to true when the component mounts
    }, []);
    
    const paperDetails = getPaperDetails(paperID);

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
                </DialogContent>
            </Dialog>
        </main>
    );
}
