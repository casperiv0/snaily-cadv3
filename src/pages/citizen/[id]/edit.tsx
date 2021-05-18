import * as React from "react";
import { Layout } from "@components/Layout";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { Value } from "types/Value";
import { Citizen } from "types/Citizen";
import { Field } from "types/Field";
import { getCitizenById, updateCitizen } from "@actions/citizen/CitizenActions";
import { getValuesByPath } from "@actions/values/ValuesActions";
import { Select, SelectValue } from "@components/Select/Select";
import { ValuePaths } from "types/ValuePaths";
import { Seo } from "@components/Seo";
import { GetServerSideProps } from "next";
import { initializeStore } from "@state/useStore";
import { getCadInfo } from "@actions/global/GlobalActions";
import { verifyAuth } from "@actions/auth/AuthActions";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { Cad } from "types/Cad";

interface Props {
  genders: Value[];
  ethnicities: Value[];
  citizen: Nullable<Citizen>;
  cadInfo: Nullable<Cad>;

  getValuesByPath: (path: ValuePaths) => void;
  updateCitizen: (id: string, data: Partial<Citizen>) => Promise<boolean | string>;
}

const CreateCitizenPage = ({
  genders,
  ethnicities,
  cadInfo,
  citizen,
  getValuesByPath,
  updateCitizen,
}: Props) => {
  const [image, setImage] = React.useState<any>(null);
  const [name, setName] = React.useState<string>("");
  const [gender, setGender] = React.useState<Nullable<SelectValue>>(null);
  const [ethnicity, setEthnicity] = React.useState<Nullable<SelectValue>>(null);
  const [birth, setBirth] = React.useState<string>("");
  const [hairColor, setHairColor] = React.useState<string>("");
  const [eyeColor, setEyeColor] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [height, setHeight] = React.useState<string>("");
  const [weight, setWeight] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

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

      setPhoneNumber(citizen?.phone_nr || "");
    }
  }, [citizen]);

  React.useEffect(() => {
    getValuesByPath("ethnicities");
    getValuesByPath("genders");
  }, [getValuesByPath]);

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
      value: gender as unknown as string,
      onChange: (e) => setGender(e),
      label: lang.citizen.gender,
      selectLabel: lang.citizen.select_gender,
      id: "gender",
      select: true,
      data: genders,
    },
    {
      type: "text",
      value: ethnicity as unknown as string,
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
      label: lang.citizen.phone_number,
      id: "phone_nr",
    },
    {
      type: "text",
      value: height,
      onChange: (e) => setHeight(e.target.value),
      label: `${lang.citizen.height} (${cadInfo?.height_prefix ?? "cm"})`,
      id: "height",
    },
    {
      type: "text",
      value: weight,
      onChange: (e) => setWeight(e.target.value),
      label: `${lang.citizen.weight} (${cadInfo?.weight_prefix ?? "kg"})`,
      id: "weight",
    },
  ];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizen) return;
    setLoading(true);

    const updated = await updateCitizen(citizen?.id, {
      image,
      full_name: name,
      gender: gender?.value,
      ethnicity: ethnicity?.value,
      birth,
      hair_color: hairColor,
      eye_color: eyeColor,
      address,
      height,
      weight,
      phone_nr: phoneNumber,
    });

    if (updated === true) {
      router.push(`/citizen/${citizen.id}`);
    }

    setLoading(false);
  }

  if (!citizen) {
    return (
      <Layout>
        <AlertMessage message={{ msg: lang.citizen.citizen_not_found_by_name, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo title={lang.citizen.create_citizen} />

      <form onSubmit={onSubmit}>
        <div key="image" id="-1" className="mb-3">
          <label className="form-label" htmlFor="image">
            {lang.global.image}
          </label>

          <div style={{ display: "flex" }}>
            <div style={{ width: "90%" }}>
              <input
                onChange={(e) => setImage(e.target.files![0])}
                type="file"
                className="form-control bg-dark border-dark text-light"
              />
            </div>

            <div style={{ width: "16%" }}>
              {image === "delete" ? (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="btn btn-success ms-3"
                  style={{ width: "84%" }}
                >
                  {lang.global.revert}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setImage("delete")}
                  className="btn btn-danger ms-3"
                >
                  {lang.citizen.remove_image}
                </button>
              )}
            </div>
          </div>
        </div>

        {fields.map((field: Field, idx: number) => {
          return (
            <div key={idx} id={`${idx}`} className="mb-3">
              <label className="form-label" htmlFor={field.id}>
                {field.label}
              </label>
              {field.select ? (
                <Select
                  isMulti={false}
                  theme="dark"
                  closeMenuOnSelect
                  isClearable={false}
                  value={field.value as unknown as SelectValue}
                  onChange={field.onChange}
                  options={field.data?.map((item: Value) => ({
                    label: item.name,
                    value: item.name,
                  }))}
                />
              ) : (
                <input
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

        <div className="mb-3 float-end">
          <Link href={`/citizen/${citizen.id}`}>
            <a className="btn btn-danger">{lang.global.cancel}</a>
          </Link>

          <button disabled={loading} className="btn btn-primary ms-2" type="submit">
            {loading ? `${lang.global.loading}...` : lang.citizen.update_citizen}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getCitizenById(`${query.id}`, req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  genders: state.values.genders,
  ethnicities: state.values.ethnicities,
  citizen: state.citizen.citizen,
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps, {
  getValuesByPath,
  updateCitizen,
})(CreateCitizenPage);
