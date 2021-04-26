import Link from "next/link";
import * as React from "react";
import { connect } from "react-redux";
import { Layout } from "@components/Layout";
import { Officer } from "types/Officer";
import { State } from "types/State";
import lang from "src/language.json";
import { getMyOfficers, deleteOfficer } from "@actions/officer/OfficerActions";
import { CreateOfficerModal } from "@components/modals/leo/CreateOfficerModal";
import { ModalIds } from "types/ModalIds";
import { Seo } from "@components/Seo";
import { GetServerSideProps } from "next";
import { initializeStore } from "@state/useStore";
import { getCadInfo } from "@actions/global/GlobalActions";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getValuesByPath } from "@actions/values/ValuesActions";
import { useClientPerms } from "@hooks/useClientPerms";
import { useOpenModal } from "@hooks/useOpenModal";
import { Item, Span } from "@components/Item";

interface Props {
  officers: Officer[];
  deleteOfficer: (id: string) => void;
}

const MyOfficersPage: React.FC<Props> = ({ officers, deleteOfficer }) => {
  useClientPerms("leo");
  useOpenModal();

  return (
    <Layout classes="mt-5">
      <Seo title="My officers" />

      <h3>{lang.officers.my_officers}</h3>

      <div className="d-flex justify-content-between mb-2">
        <Link href="/leo/dash">
          <a className="btn btn-primary text-light w-100">{lang.global.back_to_dashboard}</a>
        </Link>
        <Link href="/leo/my-logs">
          <a className="btn btn-primary text-light w-100 ms-2">{lang.officers.logs}</a>
        </Link>
      </div>

      <button
        data-bs-toggle="modal"
        data-bs-target={`#${ModalIds.CreateOfficer}`}
        className="btn btn-dark text-light w-100 p-2"
      >
        {lang.officers.create_an_officer}
      </button>

      <ul className="list-group mt-2">
        {!officers[0] ? (
          <p>{lang.officers.no_officers}</p>
        ) : (
          officers.map((officer: Officer, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
              >
                <div>
                  <Item>
                    <Span>{lang.dispatch.officer_name}: </Span>
                    {officer.officer_name}
                  </Item>
                  <Item>
                    <Span>{lang.officers.callsign}: </Span>
                    {officer.callsign}
                  </Item>
                  <Item>
                    <Span>{lang.dispatch.officer_dept}: </Span>
                    {officer.officer_dept}
                  </Item>
                  {officer?.citizen_id ? (
                    <Item>
                      <Span>{lang.citizen.citizen}: </Span>
                      {officer.citizen.full_name}
                    </Item>
                  ) : null}
                </div>
                <div>
                  <button onClick={() => deleteOfficer(officer.id)} className="btn btn-danger">
                    {lang.global.delete}
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <CreateOfficerModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getMyOfficers(req.headers)(store.dispatch);
  await getValuesByPath("departments", req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
});

export default connect(mapToProps, { deleteOfficer })(MyOfficersPage);
