import * as React from "react";
import Layout from "../../components/Layout";
import Citizen from "../../interfaces/Citizen";
import Match from "../../interfaces/Match";
import State from "../../interfaces/State";
import lang from "../../language.json";
import SERVER_URL from "../../config";
import LicenseCard from "../../components/citizen/LicenseCard";
import RegisteredWeapons from "../../components/citizen/weapons/RegisteredWeapons";
import RegisteredVehicles from "../../components/citizen/vehicles/RegisteredVehicles";
import MedicalRecords from "../../components/citizen/MedicalRecords";
import { connect } from "react-redux";
import { getCitizenById, deleteCitizen } from "../../lib/actions/citizen";

interface Props {
  citizen: Citizen;
  match: Match;
  getCitizenById: (id: string) => void;
  deleteCitizen: (id: string) => void;
}

export const Span: React.FC = ({ children }) => (
  <span className="font-weight-bold">{children}</span>
);

export const Item: React.FC<{ id: string }> = ({ id, children }) => {
  return (
    <p id={id} style={{ marginBottom: "0" }}>
      {children}
    </p>
  );
};

const CitizenInfoPage: React.FC<Props> = ({
  citizen,
  match,
  getCitizenById,
  deleteCitizen,
}) => {
  const citizenId = match.params.id;

  React.useEffect(() => {
    getCitizenById(citizenId);
  }, [getCitizenById, citizenId]);

  if (!citizen) {
    return null;
  }

  function handleDelete() {
    deleteCitizen(citizenId);
  }

  return (
    <Layout>
      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h3>{lang.admin.cad_settings.general_info}</h3>

          <div>
            <a
              className="btn btn-success mr-2"
              href={`/citizen/${citizenId}/edit`}
            >
              {lang.citizen.edit_citizen}
            </a>
            <button onClick={handleDelete} className="btn btn-danger">
              {lang.citizen.delete_citizen}
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row ml-4 mt-2 mb-2">
            <img
              className="rounded-circle object-fit-center"
              src={`${SERVER_URL}/static/citizen-images/${citizen.image_id}`}
              alt={citizen.image_id}
            />

            <div className="ml-5">
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
            </div>

            <div className="ml-4">
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
              <Item id="height">
                <Span>{lang.citizen.employer}: </Span>
                {citizen.business !== "none" ? (
                  <a href={`/company/${citizen.id}/${citizen.business}`}>
                    {citizen.business}
                  </a>
                ) : (
                  lang.citizen.not_working
                )}
              </Item>
            </div>
          </div>
        </div>
      </div>

      <LicenseCard citizen={citizen} />

      <MedicalRecords citizenId={citizenId} />

      <RegisteredWeapons citizenId={citizenId} />

      <RegisteredVehicles citizenId={citizenId} />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  citizen: state.citizen.citizen,
});

export default connect(mapToProps, { getCitizenById, deleteCitizen })(
  CitizenInfoPage
);
