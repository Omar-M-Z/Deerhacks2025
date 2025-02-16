"use client"
import { useEffect, useState } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph, useRegisterEvents } from "@react-sigma/core";
import "@react-sigma/core/lib/style.css";
import { useWorkerLayoutForce } from "@react-sigma/layout-force";
import { ShowPreview } from './previewPaper';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

async function loadMapNodes(graph: Graph, paperID: string, depth: number) {
    // TODO: finish this function for loading nodes and edges

    const response = await fetch(`/api/papersData?id=${paperID}&depth=${depth}`);
    const data = await response.json();

    const centerNode = data.centerPaper
    const nodes = data.nodes
    const edges = data.relations

    //graph.addNode(centerNode.id, { x: 0, y: 0, size: 15, label: centerNode.title, color: "#FA4F40"})

    for (const node of nodes) {
        graph.addNode(node.id, { x: getRandomNumber(0, 25), y: getRandomNumber(0, 25), size: 15, label: node.title, color: "#FA4F40" });
    }


    for (let i = 0; i < edges.length; i++) {
        graph.addEdgeWithKey(i, edges[i][0], edges[i][1], { label: 'REL_1' });
    }
}

const GraphEvents: React.FC = () => {
    const registerEvents = useRegisterEvents();
    const [showDialogBox, setShowDialogBox] = useState(false)
    const [selectedPaperID, setSelectedPaperID] = useState("")

    useEffect(() => {
        registerEvents({
            clickNode: (event) => {
                event.preventSigmaDefault()
                setShowDialogBox(true);
                console.log(event.node)
                setSelectedPaperID(event.node)
                console.log("asdfasdfas")
            },
        }
        );
    }, [registerEvents, showDialogBox])

    useEffect(() => {
        registerEvents({
            clickNode: (event) => {
                event.preventSigmaDefault()
                setShowDialogBox(true);
            },
        }
        );
    }, [registerEvents, showDialogBox])

    return (
        <div>
            <ShowPreview
                paperID={selectedPaperID}
                showingDialog={showDialogBox}
                onShowingDialogChange={setShowDialogBox}
            ></ShowPreview>
        </div>
    );
}

export const LoadGraph = ({ paperID }: { paperID: string }) => {
    const loadGraph = useLoadGraph();
    useEffect(() => {
        const initializeGraph = async () => {
            const graph = new Graph();
            await loadMapNodes(graph, paperID, 1); // Ensure it completes before proceeding
            loadGraph(graph);
        };

        initializeGraph();
    }, [loadGraph]);
    return null;
};

const LayoutControl: React.FC = () => {
    const { start } = useWorkerLayoutForce({
        settings: {
            repulsion: 0.00001,
            attraction: 0.0004
        }
    });

    useEffect(() => {
        start();
    }, [start]);
    return null;
}

// Component that display the graph
export const DisplayGraph = ({ paperID }: { paperID: string }) => {
    const router = useRouter();
    return (
        <main style={{ position: 'relative' }}>
            <div className="flex flex-row" style={{ margin: "10px", textAlign: "center", alignItems: "center" }}>
                <Button
                    onClick={() => {
                        router.push('/');
                    }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </Button>
                <h1 className="w-full font-size-40">{paperID}</h1>
            </div>
            <SigmaContainer style={{ height: "100vh", width: "100vw" }} settings={{ allowInvalidContainer: true }}>
                <LoadGraph paperID={paperID} />
                <GraphEvents />
                <LayoutControl />
            </ SigmaContainer >
        </main>
    );
};
