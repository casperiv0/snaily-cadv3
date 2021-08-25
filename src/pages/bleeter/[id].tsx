import * as React from "react";
import Markdown from "react-markdown";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "components/Layout";
import { Nullable, State } from "types/State";
import { getBleetById, deleteBleet } from "actions/bleeter/BleeterActions";
import { Bleet } from "types/Bleet";
import lang from "src/language.json";
import { User } from "types/User";
import { AlertMessage } from "components/AlertMessage/AlertMessage";
import { EditBleetModal } from "components/modals/bleeter/EditBleetModal";
import { ModalIds } from "types/ModalIds";
import { Seo } from "components/Seo";
import { GetServerSideProps } from "next";
import { initializeStore } from "state/useStore";
import { getCadInfo } from "actions/global/GlobalActions";
import { verifyAuth } from "actions/auth/AuthActions";

interface Props {
  bleet: Nullable<Bleet>;
  user: Nullable<User>;
  deleteBleet: (id: string) => Promise<boolean | undefined>;
}

const BleetPage: React.FC<Props> = ({ bleet, user, deleteBleet }) => {
  const router = useRouter();
  const id = `${router.query.id}`;

  async function handleDelete() {
    const deleted = await deleteBleet(id);

    if (deleted) {
      router.push("/bleeter");
    }
  }

  if (!bleet) {
    return (
      <Layout>
        <AlertMessage message={{ msg: lang.bleeter?.not_found, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout classes="mt-5 pb-5">
      <Seo title={`${bleet?.id ? `${bleet.title} - ` : ""} ${lang.nav.bleeter}`} />

      <Link href="/bleeter">
        <a className="btn btn-secondary mb-3">{lang.bleeter.go_back}</a>
      </Link>

      <div className="d-flex justify-content-between border-bottom">
        <div>
          <h3 className="mb-2">{bleet?.title}</h3>
          <p className="mt-1 mb-1">
            <strong>{lang.bleeter.uploaded_by}: </strong>
            {bleet?.uploadedBy}
          </p>
        </div>
        <div>
          {bleet?.id && user?.id === bleet?.user_id ? (
            <button
              className="btn btn-success mx-2"
              type="button"
              data-bs-target={`#${ModalIds.EditBleet}`}
              data-bs-toggle="modal"
            >
              {lang.bleeter.edit_bleet}
            </button>
          ) : null}

          {(user?.id && ["owner", "admin", "moderator"].includes(user.rank)) ||
          bleet?.user_id === user?.id ? (
            <button onClick={handleDelete} className="btn btn-danger">
              {lang.bleeter.delete_bleet}
            </button>
          ) : null}
        </div>
      </div>

      {bleet?.image_id !== "" ? (
        <img
          alt="bleet-image"
          className="object-fit-center"
          src={`/static/bleeter-images/${bleet.image_id}`}
          style={{ width: "100%", height: "350px" }}
        />
      ) : null}

      <Markdown className="mt-3">{bleet?.body ?? ""}</Markdown>

      {bleet?.id && user?.id === bleet.user_id ? <EditBleetModal bleet={bleet} /> : null}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getBleetById(`${query.id}`, req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  bleet: state.bleeter.bleet,
  user: state.auth.user,
});

export default connect(mapToProps, { getBleetById, deleteBleet })(BleetPage);
