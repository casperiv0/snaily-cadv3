import * as React from "react";
import { Modal } from "@components/Modal/Modal";
import lang from "src/language.json";
import { State } from "types/State";
import { connect } from "react-redux";
import { getEmsFdDeputies, setEmsStatus } from "@actions/ems-fd/EmsFdActions";
import { Deputy } from "types/Deputy";
import { Select, SelectValue } from "@components/Select/Select";
import { modal, notify } from "@lib/utils";
import { ModalIds } from "types/ModalIds";

interface Props {
  deputies: Deputy[];
  getEmsFdDeputies: () => void;
  setEmsStatus: (deputy: Pick<Deputy, "status" | "status2" | "id">) => Promise<boolean>;
}

const SelectEmsFdModalC: React.FC<Props> = ({ deputies, getEmsFdDeputies, setEmsStatus }) => {
  const [selected, setSelected] = React.useState<SelectValue | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getEmsFdDeputies();
  }, [getEmsFdDeputies]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected?.value) {
      return notify.warn("Must select an EMS/FD member before continuing");
    }

    setLoading(true);

    await setEmsStatus({
      id: selected?.value,
      status: "on-duty",
      status2: "10-8",
    });

    modal(ModalIds.SelectEmsFd)?.hide();
    setLoading(false);
  }

  return (
    <Modal title={lang.ems_fd.select_dept} id={ModalIds.SelectEmsFd}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="deputy">
              {lang.ems_fd.select_dept_2}
            </label>

            {!deputies[0] ? (
              <p className="font-weight-bold">{lang.ems_fd.no_dept}</p>
            ) : (
              <Select
                isMulti={false}
                onChange={(v) => setSelected(v)}
                value={selected}
                options={deputies.map((dep) => ({
                  label: `${dep.callsign} ${dep.name}`,
                  value: dep.id,
                }))}
              />
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={!deputies.length || loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.global.go_on_duty}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  deputies: state.ems_fd.deputies,
});

export const SelectEmsFdModal = connect(mapToProps, { getEmsFdDeputies, setEmsStatus })(
  SelectEmsFdModalC,
);
