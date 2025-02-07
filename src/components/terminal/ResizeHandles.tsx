import React, { useRef } from "react";

interface ResizeHandlesProps {
  onResize: (direction: string, movementX: number, movementY: number) => void;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResize }) => {
  const lastPos = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>();

  const handleMouseDown = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lastPos.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (e: MouseEvent) => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const movementX = e.clientX - lastPos.current.x;
        const movementY = e.clientY - lastPos.current.y;

        if (Math.abs(movementX) > 0 || Math.abs(movementY) > 0) {
          onResize(direction, movementX, movementY);
          lastPos.current = { x: e.clientX, y: e.clientY };
        }
      });
    };

    const handleMouseUp = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      {/* Corner handles */}
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50"
        onMouseDown={handleMouseDown("nw")}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50"
        onMouseDown={handleMouseDown("ne")}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50"
        onMouseDown={handleMouseDown("sw")}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
        onMouseDown={handleMouseDown("se")}
      />

      {/* Edge handles */}
      <div
        className="absolute top-0 left-4 right-4 h-2 cursor-n-resize z-50"
        onMouseDown={handleMouseDown("n")}
      />
      <div
        className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize z-50"
        onMouseDown={handleMouseDown("s")}
      />
      <div
        className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize z-50"
        onMouseDown={handleMouseDown("w")}
      />
      <div
        className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize z-50"
        onMouseDown={handleMouseDown("e")}
      />
    </>
  );
};

export default ResizeHandles;
