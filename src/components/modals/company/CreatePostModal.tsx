import * as React from "react";
import { connect } from "react-redux";
import lang from "../../../language.json";
import { createCompanyPost } from "@actions/companies/CompanyActions";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { useModalOpen } from "../../../hooks/useModalOpen";
import { modal, RequestData } from "@lib/utils";

interface Props {
  citizenId: string;
  companyId: string;
  createCompanyPost: (id: string, citizenId: string, data: RequestData) => Promise<boolean>;
}

const CreatePostModalC: React.FC<Props> = ({ createCompanyPost, companyId, citizenId }) => {
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const ref = useModalOpen<HTMLInputElement>(ModalIds.CreateCompanyPost);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const success = await createCompanyPost(companyId, citizenId, {
      title,
      description,
    });

    if (success === true) {
      modal(ModalIds.CreateCompanyPost)?.hide();
      setTitle("");
      setDescription("");
    }

    setLoading(false);
  }

  return (
    <Modal size="lg" title={lang.citizen.create_company_post} id={ModalIds.CreateCompanyPost}>
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
            {loading ? `${lang.global.loading}..` : lang.citizen.company.create_post}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const CreatePostModal = connect(null, { createCompanyPost })(CreatePostModalC);
