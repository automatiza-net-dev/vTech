import { useEffect, useState } from "react";

export function useResizeWindowUpdate() {
  const [resize, setResize] = useState(false);

  useEffect(() => {
    if (process.browser) {
      window.addEventListener("resize", () => {
        setResize(true);

        setTimeout(() => {
          setResize(false);
        }, 1000);
      });
    }
  }, []);

  return resize;
}
