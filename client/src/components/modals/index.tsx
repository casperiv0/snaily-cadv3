import * as React from "react";

interface Props {
  id: string;
  size?: "sm" | "lg" | "xl";
}

const Modal: React.FC<Props> = ({ id, size, children }) => {
  return (
    <div
      id={id}
      className="modal fade"
      tabIndex={-1}
      aria-labelledby={`${id}-label`}
      aria-hidden="true"
    >
      <div className={`modal-dialog modal-${size}`}>
        <div className="modal-content bg-dark border-dark">{children}</div>
      </div>
    </div>
  );
};

const XButton = React.forwardRef((_props, ref: React.Ref<HTMLButtonElement>) => {
  return (
    <button
      ref={ref}
      type="button"
      data-bs-dismiss="modal"
      aria-label="Close"
      className="btn-close btn-close-white"
    ></button>
  );
});

export { XButton };
export default Modal;
