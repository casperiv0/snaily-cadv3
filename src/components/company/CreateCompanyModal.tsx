import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import lang from "src/language.json";
import { State } from "types/State";
import { Citizen } from "types/Citizen";
import { createCompany } from "@actions/companies/CompanyActions";
import { Select, SelectValue } from "@components/Select/Select";
import { ModalIds } from "types/ModalIds";
import { RequestData } from "@lib/utils";
import { useRouter } from "next/router";

interface Props {
  citizens: Citizen[];
  createCompany: (data: RequestData) => Promise<string | boolean>;
}

const CreateCompanyModalC: React.FC<Props> = ({ citizens, createCompany }) => {
  const [address, setAddress] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [whitelist, setWhitelist] = React.useState<string>("no");
  const [ownerId, setOwnerId] = React.useState<SelectValue | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const success = await createCompany({
      address,
      name,
      whitelist,
      owner_id: ownerId?.value,
    });

    if (typeof success === "string") {
      router.push(success);
    }
  }

  return (
    <Modal title={lang.citizen.company.create} id={ModalIds.CreateCompany}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="company_name">
              {lang.citizen.company.name}
            </label>
            <input
              type="text"
              id="company_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="address">
              {lang.citizen.company.address}
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="whitelist">
              {lang.citizen.company.whitelisted}
            </label>

            <Select
              closeMenuOnSelect
              isMulti={false}
              onChange={(v) => setWhitelist(v?.value)}
              options={[
                { label: lang.global.yes, value: "1" },
                { label: lang.global.no, value: "0" },
              ]}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="ownerId">
              {lang.citizen.company.select_owner}
            </label>

            <Select
              closeMenuOnSelect
              onChange={(v) => setOwnerId(v)}
              isMulti={false}
              value={ownerId}
              options={citizens.map((citizen) => ({
                value: citizen.id,
                label: citizen.full_name,
              }))}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button
            disabled={!name || !address || !ownerId?.value || !whitelist || loading}
            type="submit"
            className="btn btn-primary"
          >
            {loading ? `${lang.global.loading}..` : lang.citizen.company.create}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizens: state.citizen.citizens,
});

export const CreateCompanyModal = connect(mapToProps, { createCompany })(CreateCompanyModalC);
