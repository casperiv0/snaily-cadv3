import * as React from "react";
import Modal from "./index";
import lang from "../../language.json";

const SelectOfficerModal: React.FC = () => {
  return (
    <Modal
      title={lang.officers.select_officer_msg}
      id="selectOfficerModal"
      footerButtons={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.global.go_on_duty}
          </button>
        </>
      }
    >
      <div>hello world</div>
    </Modal>
  );
};

export default SelectOfficerModal;
