import * as React from "react";

export function usePortal(id = "unknown") {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let element: HTMLDivElement | null = null;

    if (!ref.current) {
      element = document.createElement("div");

      element.setAttribute("id", `Modal_Portal_${id}`);

      document.body.appendChild(element);

      // @ts-expect-error ignore
      ref.current = element;
    }

    return () => {
      // @ts-expect-error ignore
      ref.current = null;
      element && document.body.removeChild(element);
    };
  }, [id]);

  // return the ref so it can be used
  return ref.current;
}
