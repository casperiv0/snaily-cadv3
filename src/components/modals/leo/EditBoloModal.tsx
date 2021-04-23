import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import lang from "src/language.json";
import { updateBoloById } from "@actions/bolos/BoloActions";
import { ModalIds } from "types/ModalIds";
import { Bolo } from "types/Bolo";
import { Select, SelectValue } from "@components/Select/Select";
import { Nullable } from "types/State";

const options = [
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
];

interface Props {
  bolo: Nullable<Bolo>;
  updateBoloById: (id: string, data: Record<string, unknown>) => void;
}

const EditBoloModalC: React.FC<Props> = ({ bolo, updateBoloById }) => {
  const [type, setType] = React.useState<Nullable<SelectValue>>({
    label: lang.global.person,
    value: "person",
  });
  const [name, setName] = React.useState("");
  const [plate, setPlate] = React.useState("");
  const [color, setColor] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    const option = options.find((v) => v.value === bolo?.type);
    setType(option!);
    setName(bolo?.name ?? "");
    setPlate(bolo?.plate ?? "");
    setColor(bolo?.color ?? "");
    setDescription(bolo?.description ?? "");
  }, [bolo]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateBoloById(bolo?.id!, {
      type: type?.value,
      name,
      plate,
      color,
      description,
    });
  }

  return (
    <Modal title={lang.global.plate_search} size="lg" id={ModalIds.EditBolo}>
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
              options={options}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              {lang.global.description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="edit_bolo_description"
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
            {lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const EditBoloModal = connect(null, { updateBoloById })(EditBoloModalC);
