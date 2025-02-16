"use client";
import "@react-sigma/core/lib/style.css"
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'


export const Loading = () => {
    return (
        <main style={{ position: 'relative' }}>
            <p>Loading</p>
        </main>
    );
};

export default function Map() {
    const [DynamicContent, setDynamicContent] = useState<React.ComponentType<{ paperID: string | null }>>(() => Loading);
    const searchParams = useSearchParams()
    const paperID = searchParams.get('paper-id')
 
    useEffect(() => {
      import('./map').then((module) => {
        const DisplayGraph = module.DisplayGraph as React.ComponentType<{ paperID: string | null }>;
        setDynamicContent(() => DisplayGraph);
    });
    }, [])
   
    return <div><DynamicContent paperID={paperID}></DynamicContent>
    </div>
}
