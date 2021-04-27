import * as React from "react";
import ReactDOM from "react-dom";
import { modal } from "@lib/utils";
import { ModalIds } from "types/ModalIds";
import { usePortal } from "@casper124578/useful/hooks/usePortal";

interface Props {
  id: ModalIds;
  title: string;
  size?: "sm" | "lg" | "xl";
}

export const Modal: React.FC<Props> = ({ id, size, title, children }) => {
  const portal = usePortal(`Modal_Portal_${id}`);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted
    ? ReactDOM.createPortal(
        <div
          id={id}
          className="modal fade"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-hidden="true"
        >
          <div className={`modal-dialog modal-${size} modal-dialog-centered`}>
            <div className="modal-content bg-dark border-dark">
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  className="btn-close btn-close-white"
                  onClick={() => modal(id)?.hide()}
                ></button>
              </div>

              {children}
            </div>
          </div>
        </div>,
        portal!,
      )
    : null;
};
