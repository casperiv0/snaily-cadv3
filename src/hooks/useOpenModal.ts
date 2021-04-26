import { useRouter } from "next/router";
import * as React from "react";
import { ModalIds } from "types/ModalIds";

// open a modal on page load via `?modal=<modalID>`
export function useOpenModal() {
  const router = useRouter();
  const [opened, setOpened] = React.useState(false);

  React.useEffect(() => {
    if (router.query.modal && typeof window !== "undefined") {
      const modalId = `${router.query.modal}` as ModalIds;

      setTimeout(() => {
        const el = document.getElementById(modalId);

        const m = new window.bootstrap.Modal(el as HTMLDivElement);
        !el?.classList.contains("show") && m.show();

        setOpened(true);
      }, 500);
    }
  }, [router]);

  return opened;
}
