import { useState, useEffect } from "react";
import { fs } from "@/lib/terminal/fileSystem";

export function useComputerName() {
  const [computerName, setComputerName] = useState("");

  useEffect(() => {
    async function fetchComputerName() {
      try {
        const name = await fs.getComputerName();
        setComputerName(name);
      } catch (error) {
        console.error("Failed to get computer name:", error);
        setComputerName("Computer");
      }
    }

    fetchComputerName();
  }, []);

  return computerName;
}
