import { useCallback, useEffect } from "react";
import World from "./world.client";

export default function Index() {
  useEffect(() => {
    const { dispose } = World();
  
    // return () => dispose(); 
  }, []);
  return (
    <div className="min-h-screen ">
      <h1>Height map route</h1>
      <div id="target" className="h-full absolute"></div>
    </div>
  );
}
