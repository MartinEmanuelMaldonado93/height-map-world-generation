import { useCallback, useEffect, useState } from "react";
import World from "./world.client";
import DrawingCanvas from "./react-components/DrawingCanvas";
import { Button } from "~/components/ui/button";
import { DrawContextProvider, useDrawContext } from "./context/drawCanvasCtx";
import { AnimatePresence } from "motion/react";

export default function Index() {
  const [openCanvas, setIsOpenCanvas] = useState(false);

  return (
    <DrawContextProvider>
      <div className="min-h-screen ">
        <div className="p-4 absolute z-10">
          <h1 className="px-2 py-1">Height Map Generation</h1>
          <Button
            className="text-xs"
            onClick={() => setIsOpenCanvas(!openCanvas)}
            variant={"secondary"}
          >
            {openCanvas ? "X" : "Open blackboard"}
          </Button>
          <AnimatePresence >{openCanvas && <DrawingCanvas />}</AnimatePresence>
        </div>
        <WorldScene />
        <div id="target" className="h-full absolute"></div>
      </div>
    </DrawContextProvider>
  );
}

function WorldScene() {
  const state = useDrawContext();

  useEffect(() => {
    const world = World();
    world.onLoadBackground(state.url_data);
    state.setUrlData("");
  }, [state.url_data]);
  return null;
}
