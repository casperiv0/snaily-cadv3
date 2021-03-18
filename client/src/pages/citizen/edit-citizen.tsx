import * as React from "react";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import lang from "../../language.json";
import Value from "../../interfaces/Value";
import AlertMessage from "../../components/alert-message";
import Citizen from "../../interfaces/Citizen";
import Field from "../../interfaces/Field";
import { updateCitizen, getCitizenById } from "../../lib/actions/citizen";
import { connect } from "react-redux";
import { getEthnicities, getGenders, getLegalStatuses } from "../../lib/actions/values";
import Match from "../../interfaces/Match";
import { Link, useHistory } from "react-router-dom";
import useDocTitle from "../../hooks/useDocTitle";
import Select, { Value as SelectValue } from "../../components/select";

interface Props {
  genders: Value[];
  ethnicities: Value[];
  legalStatuses: Value[];
  match: Match;
  citizen: Citizen | null;
  getGenders: () => void;
  getEthnicities: () => void;
  getLegalStatuses: () => void;
  updateCitizen: (id: string, data: Partial<Citizen>) => Promise<boolean>;
  getCitizenById: (id: string) => void;
}

const CreateCitizenPage: React.FC<Props> = ({
  genders,
  ethnicities,
  legalStatuses,
  citizen,
  match,
  getGenders,
  getEthnicities,
  getLegalStatuses,
  updateCitizen,
  getCitizenById,
}) => {
  const citizenId = match.params.id;
  const [image, setImage] = React.useState<any>(null);
  const [name, setName] = React.useState<string>("");
  const [gender, setGender] = React.useState<SelectValue | null>(null);
  const [ethnicity, setEthnicity] = React.useState<SelectValue | null>(null);
  const [birth, setBirth] = React.useState<string>("");
  const [hairColor, setHairColor] = React.useState<string>("");
  const [eyeColor, setEyeColor] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [height, setHeight] = React.useState<string>("");
  const [weight, setWeight] = React.useState<string>("");

  const [dmv, setDmv] = React.useState<SelectValue | null>(null);
  const [pilotsLicense, setPilotsLicense] = React.useState<SelectValue | null>(null);
  const [firearmsLicense, setFirearmsLicense] = React.useState<SelectValue | null>(null);
  const [ccw, setCcw] = React.useState<SelectValue | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const history = useHistory();
  useDocTitle(`${citizen?.id ? `Editing citizen: ${name}` : ""}`);

  React.useEffect(() => {
    getGenders();
    getEthnicities();
    getLegalStatuses();
    getCitizenById(citizenId);
  }, [getGenders, getEthnicities, getLegalStatuses, getCitizenById, citizenId]);

  React.useEffect(() => {
    if (citizen !== null) {
      setName(citizen?.full_name!);
      setGender({ label: citizen?.gender, value: citizen?.gender });
      setEthnicity({ label: citizen?.ethnicity, value: citizen?.ethnicity });
      setBirth(citizen?.birth!);
      setHairColor(citizen?.hair_color!);
      setEyeColor(citizen?.eye_color!);
      setAddress(citizen?.address!);
      setHeight(citizen?.height!);
      setWeight(citizen?.weight!);
      setDmv({ label: citizen?.dmv, value: citizen?.dmv });
      setFirearmsLicense({ label: citizen?.fire_license, value: citizen?.fire_license });
      setPilotsLicense({ label: citizen?.pilot_license, value: citizen?.pilot_license });
      setCcw({ label: citizen?.ccw, value: citizen?.ccw });
      setPhoneNumber(citizen?.phone_nr || "");
    }
  }, [citizen]);

  const fields: Field[] = [
    {
      type: "text",
      value: name,
      onChange: (e) => setName(e.target.value),
      label: lang.record.enter_full_name,
      id: "full_name",
      disabled: true,
    },
    {
      type: "text",
      value: (gender as unknown) as string,
      onChange: (e) => setGender(e),
      label: lang.citizen.gender,
      selectLabel: lang.citizen.select_gender,
      id: "gender",
      select: true,
      data: genders,
    },
    {
      type: "text",
      value: (ethnicity as unknown) as string,
      onChange: (e) => setEthnicity(e),
      label: lang.citizen.ethnicity,
      selectLabel: lang.citizen.select_ethnicity,
      id: "ethnicity",
      select: true,
      data: ethnicities,
    },
    {
      type: "text",
      value: birth,
      onChange: (e) => setBirth(e.target.value),
      label: lang.citizen.date_of_birth,
      id: "birth",
    },
    {
      type: "text",
      value: hairColor,
      onChange: (e) => setHairColor(e.target.value),
      label: lang.citizen.hair_color,
      id: "hair_color",
    },
    {
      type: "text",
      value: eyeColor,
      onChange: (e) => setEyeColor(e.target.value),
      label: lang.citizen.eye_color,
      id: "eye_color",
    },
    {
      type: "text",
      value: address,
      onChange: (e) => setAddress(e.target.value),
      label: lang.citizen.address,
      id: "address",
    },
    {
      type: "text",
      value: phoneNumber,
      onChange: (e) => setPhoneNumber(e.target.value),
      label: "Phone Number",
      id: "phone_nr",
    },
    {
      type: "text",
      value: height,
      onChange: (e) => setHeight(e.target.value),
      label: lang.citizen.height,
      id: "height",
    },
    {
      type: "text",
      value: weight,
      onChange: (e) => setWeight(e.target.value),
      label: lang.citizen.weight,
      id: "weight",
    },
  ];

  const licenseFields: Field[] = [
    {
      type: "text",
      value: (dmv as unknown) as string,
      onChange: (e) => setDmv(e),
      id: "dmv",
      label: lang.citizen.drivers_license,
      select: true,
      data: legalStatuses,
    },
    {
      type: "text",
      value: (firearmsLicense as unknown) as string,
      onChange: (e) => setFirearmsLicense(e),
      id: "firearmsLicense",
      label: lang.citizen.firearms_license,
      select: true,
      data: legalStatuses,
    },
    {
      type: "text",
      value: (pilotsLicense as unknown) as string,
      onChange: (e) => setPilotsLicense(e),
      id: "pilotsLicense",
      label: lang.citizen.pilot_license,
      select: true,
      data: legalStatuses,
    },
    {
      type: "text",
      value: (ccw as unknown) as string,
      onChange: (e) => setCcw(e),
      id: "ccw",
      label: lang.citizen.ccw,
      select: true,
      data: legalStatuses,
    },
  ];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const updated = await updateCitizen(citizenId, {
      image: image,
      full_name: name,
      gender: gender?.value,
      ethnicity: ethnicity?.value,
      birth,
      hair_color: hairColor,
      eye_color: eyeColor,
      address,
      height,
      weight,
      dmv: dmv?.value,
      pilot_license: pilotsLicense?.value,
      fire_license: firearmsLicense?.value,
      ccw: ccw?.value,
      phone_nr: phoneNumber,
    });

    if (updated === true) {
      history.push(`/citizen/${citizenId}`);
    }
  }

  if (citizen !== null && !citizen) {
    return (
      <Layout>
        <AlertMessage message={{ msg: lang.citizen.citizen_not_found_by_name, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <div key="image" id="-1" className="mb-3">
          <label className="form-label" htmlFor="image">
            {lang.global.image}
          </label>
          <input
            onChange={(e) => setImage(e.target.files![0])}
            type="file"
            className="form-control bg-dark border-dark text-light"
          />
        </div>

        {fields.map((field: Field, idx: number) => {
          return (
            <div key={idx} id={`${idx}`} className="mb-3">
              <label className="form-label" htmlFor={field.id}>
                {field.label}
              </label>
              {field.select ? (
                <Select
                  value={(field.value as unknown) as SelectValue}
                  isMulti={false}
                  theme="dark"
                  closeMenuOnSelect
                  isClearable={false}
                  onChange={field.onChange}
                  options={field.data?.map((item: Value) => ({
                    label: item.name,
                    value: item.name,
                  }))}
                />
              ) : (
                <input
                  disabled={field?.disabled}
                  value={field.value}
                  id={field.id}
                  className="form-control bg-dark border-dark text-light"
                  onChange={field.onChange}
                  type={field.type}
                />
              )}
            </div>
          );
        })}

        <div className="row">
          {licenseFields.map((field: Field, idx: number) => {
            return (
              <div key={idx} id={`${idx}`} className="mb-3 col-md-3">
                <label className="form-label" htmlFor={field.id}>
                  {field.label}
                </label>

                <Select
                  value={(field.value as unknown) as SelectValue}
                  isMulti={false}
                  theme="dark"
                  closeMenuOnSelect
                  isClearable={false}
                  onChange={field.onChange}
                  options={field.data?.map((item: Value) => ({
                    label: item.name,
                    value: item.name,
                  }))}
                />
              </div>
            );
          })}
        </div>

        <div className="mb-3 float-end">
          <Link to={`/citizen/${citizenId}`} className="btn btn-danger">
            {lang.global.cancel}
          </Link>

          <button className="btn btn-primary ms-2" type="submit">
            {lang.citizen.update_citizen}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  genders: state.values.genders,
  ethnicities: state.values.ethnicities,
  legalStatuses: state.values["legal-statuses"],
  citizen: state.citizen.citizen,
});

export default connect(mapToProps, {
  getGenders,
  getEthnicities,
  getLegalStatuses,
  updateCitizen,
  getCitizenById,
})(CreateCitizenPage);
