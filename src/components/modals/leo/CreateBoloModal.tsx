import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import lang from "../../../language.json";
import { createBolo } from "@actions/bolos/BoloActions";
import { Select, SelectValue } from "@components/Select/Select";
import { modal, RequestData } from "@lib/utils";
import { ModalIds } from "types/ModalIds";

interface Props {
  createBolo: (data: RequestData) => Promise<boolean>;
}

const CreateBoloModalC: React.FC<Props> = ({ createBolo }) => {
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState<SelectValue | null>({
    label: lang.global.person,
    value: "person",
  });
  const [name, setName] = React.useState("");
  const [plate, setPlate] = React.useState("");
  const [color, setColor] = React.useState("");
  const [description, setDescription] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const created = await createBolo({
      type: type?.value,
      name,
      plate: plate.toUpperCase(),
      color,
      description,
    });

    if (created === true) {
      modal(ModalIds.CreateBolo)?.hide();

      setType({
        label: lang.global.person,
        value: "person",
      });
      setName("");
      setPlate("");
      setColor("");
      setDescription("");
    }

    setLoading(false);
  }

  return (
    <Modal title={lang.global.create_bolo} size="lg" id={ModalIds.CreateBolo}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="type">
              {lang.citizen.medical.type}
            </label>

            <Select
              value={type}
              closeMenuOnSelect
              isMulti={false}
              isClearable={false}
              onChange={(v) => setType(v)}
              options={[
                {
                  label: lang.global.person,
                  value: "person",
                },
                {
                  label: lang.global.vehicle,
                  value: "vehicle",
                },
                {
                  label: lang.global.other,
                  value: "other",
                },
              ]}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              {lang.global.description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="create_bolo_description"
              rows={5}
              className="form-control bg-secondary border-secondary text-light"
            ></textarea>
          </div>

          {type?.value === "person" ? (
            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                {lang.record.enter_per_name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control bg-secondary border-secondary text-light"
              />
            </div>
          ) : type?.value === "vehicle" ? (
            <>
              <div className="mb-3">
                <label className="form-label" htmlFor="plate">
                  {lang.record.enter_plate}
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value?.toUpperCase())}
                  className="form-control bg-secondary border-secondary text-light"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="color">
                  {lang.record.enter_color}
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="form-control bg-secondary border-secondary text-light"
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button type="submit" disabled={description === ""} className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.global.create_bolo}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const CreateBoloModal = connect(null, { createBolo })(CreateBoloModalC);
