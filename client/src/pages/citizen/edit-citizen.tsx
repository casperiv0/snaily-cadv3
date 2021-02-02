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
import Message from "../../interfaces/Message";
import { Link } from "react-router-dom";

interface Props {
  message: Message;
  genders: Value[];
  ethnicities: Value[];
  legalStatuses: Value[];
  match: Match;
  citizen: Citizen | null;
  getGenders: () => void;
  getEthnicities: () => void;
  getLegalStatuses: () => void;
  updateCitizen: (id: string, data: Partial<Citizen>) => void;
  getCitizenById: (id: string) => void;
}

const CreateCitizenPage: React.FC<Props> = ({
  message,
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
  const [gender, setGender] = React.useState<string>("");
  const [ethnicity, setEthnicity] = React.useState<string>("");
  const [birth, setBirth] = React.useState<string>("");
  const [hairColor, setHairColor] = React.useState<string>("");
  const [eyeColor, setEyeColor] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [height, setHeight] = React.useState<string>("");
  const [weight, setWeight] = React.useState<string>("");
  const [dmv, setDmv] = React.useState<string>("");
  const [pilotsLicense, setPilotsLicense] = React.useState<string>("");
  const [firearmsLicense, setFirearmsLicense] = React.useState<string>("");
  const [ccw, setCcw] = React.useState<string>("");

  React.useEffect(() => {
    getGenders();
    getEthnicities();
    getLegalStatuses();
    getCitizenById(citizenId);
  }, [getGenders, getEthnicities, getLegalStatuses, getCitizenById, citizenId]);

  React.useEffect(() => {
    if (citizen !== null) {
      setName(citizen?.full_name!);
      setGender(citizen?.gender!);
      setEthnicity(citizen?.ethnicity!);
      setBirth(citizen?.birth!);
      setHairColor(citizen?.hair_color!);
      setEyeColor(citizen?.eye_color!);
      setAddress(citizen?.address!);
      setHeight(citizen?.height!);
      setWeight(citizen?.weight!);
      setDmv(citizen?.dmv!);
      setFirearmsLicense(citizen?.fire_license!);
      setPilotsLicense(citizen?.pilot_license!);
      setCcw(citizen?.ccw!);
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
      value: gender,
      onChange: (e) => setGender(e.target.value),
      label: lang.citizen.gender,
      selectLabel: lang.citizen.select_gender,
      id: "gender",
      select: true,
      data: genders,
    },
    {
      type: "text",
      value: ethnicity,
      onChange: (e) => setEthnicity(e.target.value),
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
      value: dmv,
      onChange: (e) => setDmv(e.target.value),
      id: "dmv",
      label: lang.citizen.drivers_license,
      select: true,
      data: legalStatuses,
    },
    {
      type: "text",
      value: firearmsLicense,
      onChange: (e) => setFirearmsLicense(e.target.value),
      id: "firearmsLicense",
      label: lang.citizen.firearms_license,
      select: true,
      data: legalStatuses,
    },
    {
      type: "text",
      value: pilotsLicense,
      onChange: (e) => setPilotsLicense(e.target.value),
      id: "pilotsLicense",
      label: lang.citizen.pilot_license,
      select: true,
      data: legalStatuses,
    },
    {
      type: "text",
      value: ccw,
      onChange: (e) => setCcw(e.target.value),
      id: "ccw",
      label: lang.citizen.ccw,
      select: true,
      data: legalStatuses,
    },
  ];

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateCitizen(citizenId, {
      image: image,
      full_name: name,
      gender,
      ethnicity,
      birth,
      hair_color: hairColor,
      eye_color: eyeColor,
      address,
      height,
      weight,
      dmv,
      pilot_license: pilotsLicense,
      fire_license: firearmsLicense,
      ccw,
    });
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
        <AlertMessage message={message} dismissible />

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
                <select
                  disabled={field?.disabled}
                  className="form-control bg-dark border-dark text-light"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <option value="">{field.selectLabel}</option>
                  <option value="" disabled>
                    -------
                  </option>
                  {field.data?.map((option: any, idx: number) => {
                    return (
                      <option key={idx} id={`${idx}`} value={option.name}>
                        {option.name}
                      </option>
                    );
                  })}
                </select>
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
                <select
                  className="form-control bg-dark border-dark text-light"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <option value="">{lang.citizen.select_license}</option>
                  <option value="" disabled>
                    -------
                  </option>
                  {field.data?.map((option: any, idx: number) => {
                    return (
                      <option key={idx} id={`${idx}`} value={option.name}>
                        {option.name}
                      </option>
                    );
                  })}
                </select>
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
  message: state.global.message,
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
