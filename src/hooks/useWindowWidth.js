import { useState, useEffect } from "react";

export default function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

// breakpoints
export const isMobile = (w) => w <= 480;
export const isTablet = (w) => w > 480 && w <= 768;
export const isSmall  = (w) => w <= 768;
