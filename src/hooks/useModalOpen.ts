import * as React from "react";
import { ModalIds } from "types/ModalIds";

// returns a ref to focus on an element such as a button or input
export function useModalOpen<T = Element>(id: ModalIds) {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const el = document.getElementById(id as unknown as string);

    const handler = () => {
      // @ts-expect-error ignore line below
      ref.current?.focus?.();
    };

    el?.addEventListener("shown.bs.modal", handler);

    return () => {
      el?.removeEventListener("shown.bs.modal", handler);
    };
  }, [id]);

  return ref;
}
