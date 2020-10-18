import * as React from "react";

interface Props {
  title: string;
  id: string;
  footerButtons: React.ReactChildren | any;
}

const Modal: React.FC<Props> = ({ title, id, children, footerButtons }) => {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content bg-dark border-dark">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {title}
            </h5>
            <button
              type="button"
              className="close text-light"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">{footerButtons}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
