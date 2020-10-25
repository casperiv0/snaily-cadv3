import * as React from "react";

interface Props {
  id: string;
  size?: "sm" | "lg" | "xl";
}

const Modal: React.FC<Props> = ({ id, size, children }) => {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
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
      data-dismiss="modal"
      aria-label="Close"
      className="close text-light"
    >
      <span aria-hidden={true}>&times;</span>
    </button>
  );
});

export { XButton };
export default Modal;
