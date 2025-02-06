import React from "react";
import { WindowControlsProps } from "@/types/terminal";

const WindowControls = ({
  onMinimize,
  onMaximize,
  onClose,
}: WindowControlsProps) => {
  return (
    <div className="w-24 flex-shrink-0 bg-zinc-900/50 flex items-center justify-end pr-2 gap-2">
      <button
        onClick={onMinimize}
        className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors"
      />
      <button
        onClick={onMaximize}
        className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors"
      />
      <button
        onClick={onClose}
        className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors"
      />
    </div>
  );
};

export default WindowControls;
