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

interface Props {
  genders: Value[];
  ethnicities: Value[];
  legalStatuses: Value[];
  citizen: Nullable<Citizen>;

  getValuesByPath: (path: ValuePaths) => void;
  updateCitizen: (id: string, data: Partial<Citizen>) => Promise<boolean | string>;
}

const CreateCitizenPage = ({
  genders,
  ethnicities,
  legalStatuses,
  getValuesByPath,
  updateCitizen,
  citizen,
}: Props) => {
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
      setDmv({ label: citizen?.dmv, value: citizen?.dmv });
      setFirearmsLicense({ label: citizen?.fire_license, value: citizen?.fire_license });
      setPilotsLicense({ label: citizen?.pilot_license, value: citizen?.pilot_license });
      setCcw({ label: citizen?.ccw, value: citizen?.ccw });
      setPhoneNumber(citizen?.phone_nr || "");
    }
  }, [citizen]);

  React.useEffect(() => {
    getValuesByPath("ethnicities");
    getValuesByPath("genders");
    getValuesByPath("legal-statuses");
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
      label: lang.citizen.phone_number,
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
    if (!citizen) return;
    setLoading(true);

    const updated = await updateCitizen(citizen?.id, {
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
                  isMulti={false}
                  theme="dark"
                  closeMenuOnSelect
                  isClearable={false}
                  value={(field.value as unknown) as SelectValue}
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

        <div className="row">
          {licenseFields.map((field: Field, idx: number) => {
            return (
              <div key={idx} id={`${idx}`} className="mb-3 col-md-3">
                <label className="form-label" htmlFor={field.id}>
                  {field.label}
                </label>

                <Select
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
          <Link href="/citizen">
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
  legalStatuses: state.values["legal-statuses"],
  citizen: state.citizen.citizen,
});

export default connect(mapToProps, {
  getValuesByPath,
  updateCitizen,
})(CreateCitizenPage);
