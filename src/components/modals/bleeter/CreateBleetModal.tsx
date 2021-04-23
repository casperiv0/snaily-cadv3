import * as React from "react";
import { connect } from "react-redux";
import { createBleet } from "@actions/bleeter/BleeterActions";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal } from "@lib/utils";
import lang from "src/language.json";

interface Props {
  createBleet: (data: { title: string; body: string; image: any }) => Promise<boolean>;
}

const CreateBleetModalC: React.FC<Props> = ({ createBleet }) => {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [image, setImage] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const created = await createBleet({
      title,
      body,
      image,
    });

    if (created === true) {
      modal(ModalIds.CreateBleet)?.hide();
    }

    setLoading(false);
  }

  return (
    <Modal size="lg" title="Create bleet" id={ModalIds.CreateBleet}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              {lang.global.image}
            </label>
            <input
              type="file"
              id="image"
              className="form-control bg-secondary border-secondary text-light"
              onChange={(e) => setImage(e.target?.files?.[0])}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              {lang.bleeter.bleet_title}
            </label>
            <input
              type="text"
              value={title}
              id="title"
              className="form-control bg-secondary border-secondary text-light"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="body">
              {lang.bleeter.bleet_body}
            </label>
            <textarea
              className="form-control bg-secondary border-secondary text-light"
              title="body"
              value={body}
              rows={10}
              style={{ resize: "vertical" }}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>

          <button disabled={loading} className="btn btn-primary ms-2" type="submit">
            {loading ? `${lang.global.loading}..` : lang.bleeter.create_bleet}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const CreateBleetModal = connect(null, { createBleet })(CreateBleetModalC);
