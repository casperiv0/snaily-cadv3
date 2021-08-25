import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "components/Modal/Modal";
import lang from "../../../language.json";
import { ModalIds } from "types/ModalIds";
import { getMugshots, deleteMugshot } from "actions/officer/OfficerActions";
import { State } from "types/State";
import { Mugshot } from "types/Mugshot";

interface Props {
  search: any;
  mugshots: Mugshot[];
  getMugshots: (citizenId: string) => void;
  deleteMugshot: (citizenId: string, shotId: string, imageId: string) => void;
}

const MugshotsModalC: React.FC<Props> = ({ search, mugshots, getMugshots, deleteMugshot }) => {
  const [index, setIndex] = React.useState(0);

  const noShots = () => {
    if (mugshots.length <= 0) return true;
    const d = mugshots.filter((m) => m.data.length > 0);

    return d.length === 0;
  };

  React.useEffect(() => {
    if (!search) return;
    if (search?.type !== "name") return;

    getMugshots(search?.citizen?.id);
    setIndex(0);
  }, [search, getMugshots]);

  const deleteShot = (shotId: string, imageId: string) => () => {
    setIndex(0);
    deleteMugshot(search?.citizen?.id, shotId, imageId);
  };

  return (
    <Modal size={noShots() ? "lg" : "xl"} title={lang.officers.mugshots} id={ModalIds.Mugshots}>
      <div className="modal-body">
        {noShots() ? (
          <p>{lang.officers.no_mugshots} </p>
        ) : (
          <div
            id="mugshot-controls"
            className="carousel slide"
            data-bs-interval="100000000"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {mugshots
                .filter((m) => m.data.length > 0)
                .map((shot, sIdx) => {
                  if (!shot.data || shot.data.length <= 0) return null;

                  return shot.data.map((imageId, idx) => {
                    return (
                      <div
                        key={imageId}
                        className={`carousel-item ${sIdx === 0 && index === idx ? "active" : ""}`}
                      >
                        <img
                          src={`/static/mugshots/${imageId}`}
                          className="d-block w-100"
                          alt={imageId}
                        />

                        <div className="d-flex justify-content-center">
                          <button
                            onClick={deleteShot(shot.id, imageId)}
                            type="button"
                            className="btn btn-danger mt-2"
                          >
                            {lang.officers.delete_current_mugshot}
                          </button>
                        </div>
                      </div>
                    );
                  });
                })}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#mugshot-controls"
              data-bs-slide="prev"
              onClick={() => setIndex((p) => p - 1)}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#mugshot-controls"
              data-bs-slide="next"
              onClick={() => setIndex((p) => p + 1)}
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          {lang.global.cancel}
        </button>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.UploadMugShots}`}
        >
          {lang.officers.upload_mugshots}
        </button>
      </div>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  search: state.officers.search,
  mugshots: state.officers.mugshots,
});

export const MugshotsModal = connect(mapToProps, { getMugshots, deleteMugshot })(MugshotsModalC);
