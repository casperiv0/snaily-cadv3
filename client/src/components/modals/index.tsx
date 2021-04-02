import * as React from "react";
import ReactDOM from "react-dom";
import { modal } from "../../lib/functions";

interface Props {
  id: string;
  title: string;
  size?: "sm" | "lg" | "xl";
}

const el = document.getElementById("modal-portal");

const Modal: React.FC<Props> = ({ id, size, title, children }) => {
  return ReactDOM.createPortal(
    <div
      id={id}
      className="modal fade"
      tabIndex={-1}
      aria-labelledby={`${id}-label`}
      aria-hidden="true"
    >
      <div className={`modal-dialog modal-${size}`}>
        <div className="modal-content bg-dark border-dark">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              className="btn-close btn-close-white"
              onClick={() => modal(id).hide()}
            ></button>
          </div>

          {children}
        </div>
      </div>
    </div>,
    el as Element,
  );
};

export default Modal;
