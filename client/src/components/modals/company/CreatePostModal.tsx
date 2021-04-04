import * as React from "react";
import { connect } from "react-redux";
import lang from "../../../language.json";
import { createCompanyPost } from "../../../lib/actions/company";
import { useParams } from "react-router-dom";
import Modal from "..";
import { ModalIds } from "../../../lib/types";
import Match from "../../../interfaces/Match";
import { useModalOpen } from "../../../hooks/useModalOpen";

interface Props {
  createCompanyPost: (data: object) => void;
}

const CreatePostModal: React.FC<Props> = ({ createCompanyPost }) => {
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const { companyId, citizenId } = useParams<Match["params"]>();
  const ref = useModalOpen<HTMLInputElement>(ModalIds.CreateCompanyPost);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createCompanyPost({
      title,
      description,
      company_id: companyId,
      citizen_id: citizenId,
    });
  }

  return (
    <Modal
      size="lg"
      title={window.lang.citizen.create_company_post}
      id={ModalIds.CreateCompanyPost}
    >
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              {lang.citizen.company.post_title}
            </label>
            <input
              ref={ref}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              {lang.citizen.company.post_desc}
            </label>
            <textarea
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              required
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button className="btn btn-primary" type="submit">
            {lang.citizen.company.create_post}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { createCompanyPost })(CreatePostModal);
