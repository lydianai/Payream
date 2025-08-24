import { useEffect } from "react";

export function useResponsiveFix() {
  useEffect(() => {
    function handleResize() {
      document.body.style.zoom = "";
      document.body.style.width = "100vw";
      document.body.style.maxWidth = "100vw";
      document.body.style.overflowX = "hidden";
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
}
