import { connect } from "react-redux";
import * as React from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { verifyAuth } from "@actions/auth/AuthActions";
import {
  deleteCitizenById,
  getCitizenById,
  getCitizenVehicles,
  getCitizenWeapons,
} from "@actions/citizen/CitizenActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { initializeStore } from "@state/useStore";
import { Layout } from "src/components/Layout";
import { Citizen } from "types/Citizen";
import { Nullable, State } from "types/State";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import lang from "../../../language.json";
import { Item, Span } from "@components/Item";
import { isCadFeatureEnabled } from "@lib/utils";
import { Cad } from "types/Cad";
import { Seo } from "@components/Seo";
import { RegisteredWeapons } from "@components/Citizen/RegisteredWeapons";
import RegisteredVehicles from "@components/Citizen/RegisteredVehicles";
import { RegisterWeaponModal } from "@components/modals/citizen/RegisterWeaponModal";
import { RegisterVehicleModal } from "@components/modals/citizen/RegisterVehicleModal";
import { LicenseCard } from "@components/Citizen/Licenses";
import { EditLicensesModal } from "@components/modals/citizen/EditLicensesModal";
import { MedicalRecordsCard } from "@components/Citizen/MedicalRecords";
import { CreateMedicalRecordModal } from "@components/modals/citizen/CreateMedicalRecordModal";

interface Props {
  citizen: Nullable<Citizen>;
  cadInfo: Nullable<Cad>;
  deleteCitizenById: (id: string) => Promise<boolean>;
}

const CitizenInfoPage = ({ citizen, cadInfo, deleteCitizenById }: Props) => {
  const router = useRouter();

  async function handleDelete() {
    const deleted = await deleteCitizenById(citizen?.id!);

    if (deleted === true) {
      router.push("/citizen");
    }
  }

  if (!citizen) {
    return (
      <Layout>
        <AlertMessage message={{ msg: lang.citizen.not_found, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout fluid>
      <Seo title={citizen?.id ? `Viewing citizen: ${citizen.full_name}` : "Citizens"} />

      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h3>{lang.admin.cad_settings.general_info}</h3>

          <div>
            <Link href={`/citizen/${citizen?.id}/edit`}>
              <a className="btn btn-success me-2">{lang.citizen.edit_citizen}</a>
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              {lang.citizen.delete_citizen}
            </button>
          </div>
        </div>

        <div style={{ display: "flex" }} className="card-body">
          <Image
            objectFit="cover"
            width="120px"
            height="120px"
            layout="fixed"
            className="rounded-circle object-fit-center"
            src={`/citizen-images/${citizen.image_id}`}
            alt={citizen.image_id}
          />

          <div className="ms-4">
            <Item id="full_name">
              <Span>{lang.citizen.full_name}: </Span>
              {citizen.full_name}
            </Item>
            <Item id="birth">
              <Span>{lang.citizen.date_of_birth}: </Span>
              {citizen.birth}
            </Item>
            <Item id="gender">
              <Span>{lang.citizen.gender}: </Span>
              {citizen.gender}
            </Item>
            <Item id="ethnicity">
              <Span>{lang.citizen.ethnicity}: </Span>
              {citizen.ethnicity}
            </Item>
            <Item id="hair_color">
              <Span>{lang.citizen.hair_color}: </Span>
              {citizen.hair_color}
            </Item>
            <Item id="phone_nr">
              <Span>{lang.citizen.phone_number}: </Span>
              {citizen.phone_nr || "None"}
            </Item>
          </div>

          <div className="ms-4">
            <Item id="eye_color">
              <Span>{lang.citizen.eye_color}: </Span>
              {citizen.eye_color}
            </Item>
            <Item id="address">
              <Span>{lang.citizen.address}: </Span>
              {citizen.address}
            </Item>
            <Item id="height">
              <Span>{lang.citizen.height}: </Span>
              {citizen.height}
            </Item>
            <Item id="weight">
              <Span>{lang.citizen.weight}: </Span>
              {citizen.weight}
            </Item>

            {isCadFeatureEnabled(cadInfo?.features, "company") ? (
              <Item id="height">
                <Span>{lang.citizen.employer}: </Span>
                {citizen.business !== "none" ? (
                  <Link href={`/company/${citizen.id}/${citizen.business_id}`}>
                    <a>{citizen.business}</a>
                  </Link>
                ) : (
                  lang.citizen.not_working
                )}
              </Item>
            ) : null}
          </div>
        </div>
      </div>

      <LicenseCard citizen={citizen} />
      <MedicalRecordsCard />
      <RegisteredWeapons />
      <RegisteredVehicles />

      <CreateMedicalRecordModal />
      <EditLicensesModal />
      <RegisterWeaponModal />
      <RegisterVehicleModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getCitizenById(`${query.id}`, req.headers)(store.dispatch);
  await getCitizenWeapons(`${query.id}`, req.headers)(store.dispatch);
  await getCitizenVehicles(`${query.id}`, req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  citizen: state.citizen.citizen ?? null,
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps, { deleteCitizenById })(CitizenInfoPage);
