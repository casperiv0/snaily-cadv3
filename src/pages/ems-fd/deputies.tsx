import { GetServerSideProps } from "next";
import Link from "next/link";
import { connect } from "react-redux";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { initializeStore } from "@state/useStore";
import { getEmsFdDeputies, deleteEmsFdDeputy } from "@actions/ems-fd/EmsFdActions";
import { Layout } from "@components/Layout";
import { Deputy } from "types/Deputy";
import lang from "src/language.json";
import { ModalIds } from "types/ModalIds";
import { CreateDeputyModal } from "@components/modals/ems-fd/CreateDeputyModal";
import { State } from "types/State";

interface Props {
  deputies: Deputy[];
  deleteEmsFdDeputy: (id: string) => void;
}

const MyDeputies = ({ deputies, deleteEmsFdDeputy }: Props) => {
  return (
    <Layout>
      <h4 className="card-title mt-3">{lang.ems_fd.my_deputies}</h4>

      <div className="d-flex gap-2 mb-2">
        <Link href="/ems-fd/dash">
          <a className="btn btn-primary container">{lang.ems_fd.ems_dash}</a>
        </Link>
        <button
          className="btn btn-primary container"
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.CreateEmsFd}`}
        >
          {lang.ems_fd.create_a_dept}
        </button>
      </div>

      <ul className="list-group mt-1">
        {deputies.map((deputy: Deputy, idx: number) => {
          return (
            <li
              key={idx}
              id={`${idx}`}
              className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
            >
              <p>
                {++idx} | {deputy.name}
              </p>
              <div>
                <button onClick={() => deleteEmsFdDeputy(deputy.id)} className="btn btn-danger">
                  {lang.global.delete}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <CreateDeputyModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getEmsFdDeputies(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  deputies: state.ems_fd.deputies,
});

export default connect(mapToProps, { deleteEmsFdDeputy })(MyDeputies);
