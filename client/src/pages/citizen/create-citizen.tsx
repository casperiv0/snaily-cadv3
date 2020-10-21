import * as React from "react";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { connect } from "react-redux";
import { getEthnicities, getGenders } from "../../lib/actions/values";
import Value from "../../interfaces/Value";

interface Props {
  error: string;
  genders: Value[];
  ethnicities: Value[];
  getGenders: () => void;
  getEthnicities: () => void;
}

interface Field {
  type: "text" | "email" | "file";
  value: string;
  onChange: (e: any) => void;
  label: string;
  id: string;
  select?: boolean;
  data?: any[];
}

const CreateCitizenPage: React.FC<Props> = ({
  error,
  genders,
  ethnicities,
  getGenders,
  getEthnicities,
}) => {
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
  }, [getGenders, getEthnicities]);

  const fields: Field[] = [
    {
      type: "text",
      value: name,
      onChange: (e) => setName(e.target.value),
      label: lang.record.enter_full_name,
      id: "full_name",
    },
    {
      type: "text",
      value: gender,
      onChange: (e) => setGender(e.target.value),
      label: lang.citizen.select_gender,
      id: "gender",
      select: true,
      data: genders,
    },
    {
      type: "text",
      value: ethnicity,
      onChange: (e) => setEthnicity(e.target.value),
      label: lang.citizen.select_ethnicity,
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        {fields.map((field: Field, idx: number) => {
          return (
            <div key={idx} id={`${idx}`} className="form-group">
              <label htmlFor={field.id}>{field.label}</label>
              {field.select ? (
                <select
                  className="form-control bg-dark border-dark text-light"
                  value={field.value}
                  onChange={field.onChange}
                >
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
                  value={field.value}
                  id={field.id}
                  className="form-control bg-dark border-dark text-light"
                  onChange={field.onChange}
                />
              )}
            </div>
          );
        })}
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  error: state.citizen.error,
  genders: state.values.genders,
  ethnicities: state.values.ethnicities,
  legalStatuses: state.values.legalStatuses,
});

export default connect(mapToProps, { getGenders, getEthnicities })(
  CreateCitizenPage
);
