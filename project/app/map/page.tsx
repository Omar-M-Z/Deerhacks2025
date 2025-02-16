"use client";
import "@react-sigma/core/lib/style.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Map() {
  const [DynamicContent, setDynamicContent] = useState<React.ComponentType<{ paperID: string | null }>>(() => () => null);
  const searchParams = useSearchParams();
  const paperID = searchParams.get("id");

  useEffect(() => {
    import("./map").then((module) => {
      const DisplayGraph = module.DisplayGraph as React.ComponentType<{ paperID: string | null }>;
      setDynamicContent(() => DisplayGraph);
    });
  }, []);

  return (
    <div>
      <DynamicContent paperID={paperID} />
    </div>
  );
}
