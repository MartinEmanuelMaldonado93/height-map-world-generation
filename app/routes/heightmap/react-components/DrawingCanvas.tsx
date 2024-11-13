import React, { useRef, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useDrawContext } from "../context/drawCanvasCtx";
import { motion } from "motion/react";
import { GiPencil, GiTrashCan } from "react-icons/gi";

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const drawing = useRef<boolean>(false);
  const { setUrlData, setRestoreOriginalTerrain } = useDrawContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    const radio = 5;

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
      drawing.current = true;
      const rect = canvasRef.current.getBoundingClientRect();
      drawPoint(event.clientX - rect.left, event.clientY - rect.top);
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current.getBoundingClientRect();
      if (drawing.current) {
        drawPoint(event.clientX - rect.left, event.clientY - rect.top);
      }
    };

    const drawPoint = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, radio, 0, Math.PI * 2);
      ctx.fill();
    };

    const stopDrawing = () => {
      drawing.current = false;
    };
    //@ts-ignore
    canvas.addEventListener("mousedown", startDrawing);
    //@ts-ignore
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      //@ts-ignore
      canvas.removeEventListener("mousedown", startDrawing);
      //@ts-ignore
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, []);

  function saveCanvas() {
    const dataURL = canvasRef.current.toDataURL("image/jpeg", 0.8);
    setUrlData(dataURL);
  }

  function clearCanvas() {
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const w = canvasRef.current.clientWidth;
    const h = canvasRef.current.clientHeight;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "white"; // come back to white after clear the board
  }
  return (
    <div className="relative p-4 pl-0">
      <motion.canvas
        animate={{ opacity: [0, 1], x: ["-10%", "0%"] }}
        exit={{ opacity: 0 }}
        ref={canvasRef}
        width={300}
        height={300}
        className="z-10 cursor-crosshair border border-black rounded-md absolute top-3/4 left-0 m-4 ml-0"
      />
      <br />
      <motion.div
        animate={{
          opacity: [0, 1],
          y: ["50%", "0%"],
        }}
        transition={{ type: "spring", damping: 13, stiffness: 60 }}
        exit={{ opacity: 0 }}
        className="flex gap-4"
      >
        <Button onClick={() => saveCanvas()} variant={"secondary"}>
          Draw <GiPencil />
        </Button>
        <Button variant={"secondary"} onClick={() => clearCanvas()}>
          Clean <GiTrashCan />
        </Button>
        {/* <Button
          variant={"secondary"}
          onClick={() => {
            setRestoreOriginalTerrain(true);
          }}
        >
          Clean Terrain ⛰️
        </Button> */}
      </motion.div>
    </div>
  );
}

export default DrawingCanvas;
