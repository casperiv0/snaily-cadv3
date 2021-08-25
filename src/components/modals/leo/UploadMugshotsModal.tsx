import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "components/Modal/Modal";
import lang from "../../../language.json";
import { ModalIds } from "types/ModalIds";
import { getMugshots, uploadFiles } from "actions/officer/OfficerActions";
import { State } from "types/State";
import { modal } from "lib/utils";

interface Props {
  search: any;
  uploadFiles: (files: FileList, citizenId: string) => Promise<boolean>;
  getMugshots: (citizenId: string) => void;
}

const UploadMugshotsModalC: React.FC<Props> = ({ search, uploadFiles, getMugshots }) => {
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!files) return;
    if (search?.type !== "name") return;

    setLoading(true);

    const citizenId = search?.citizen?.id;
    const uploaded = await uploadFiles(files, citizenId);

    if (uploaded === true) {
      getMugshots(citizenId);
      modal(ModalIds.UploadMugShots)?.hide();
      setFiles(null);
    }

    setLoading(false);
  }

  return (
    <Modal
      styles={{ zIndex: 9999 }}
      title={lang.officers.select_officer_msg}
      id={ModalIds.UploadMugShots}
    >
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="officer">
              {lang.officers.select_mugshot_files}
            </label>

            <input
              type="file"
              className="form-control bg-secondary border-secondary text-light"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button
            disabled={!files || files.length <= 0 || loading}
            type="submit"
            className="btn btn-primary"
          >
            {loading ? `${lang.global.loading}..` : lang.officers.upload_mugshots}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  search: state.officers.search,
});

export const UploadMugshotsModal = connect(mapToProps, { uploadFiles, getMugshots })(
  UploadMugshotsModalC,
);
