import * as React from "react";
import lang from "src/language.json";
import { Modal } from "components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { Citizen } from "types/Citizen";

interface Props {
  citizen: Citizen;
}

export const CitizenImageModal = ({ citizen }: Props) => {
  return (
    <Modal title={citizen.full_name} id={ModalIds.CitizenImage} size="lg">
      <div className="modal-body">
        <img
          alt={citizen.image_id}
          className="rounded-circle object-fit-center w-100 h-100"
          src={`/static/citizen-images/${citizen.image_id}`}
        />
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          {lang.global.close}
        </button>
      </div>
    </Modal>
  );
};
