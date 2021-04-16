import * as React from "react";

export type NullableIntersection = IntersectionObserver | null;

export function useObserver<T = unknown>(items: T[], amountToAdd = 15) {
  const observer = React.useRef<unknown>(null);
  const [length, setLength] = React.useState<number>(15);

  const ref = React.useCallback(
    (node) => {
      if (length > items.length) return;

      if (observer.current) {
        (observer.current as NullableIntersection)?.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setLength((prev) => prev + amountToAdd);
        }
      });

      if (node) {
        (observer.current as NullableIntersection)?.observe(node);
      }

      return () => {
        observer.current = null;
        setLength(15);
      };
    },
    [items, amountToAdd, length],
  );

  return {
    ref,
    length,
  };
}
