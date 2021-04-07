import * as React from "react";
import { connect } from "react-redux";
import { verifyAuth } from "@state/items/auth/AuthActions";
import { initializeStore } from "@state/useStore";
import { GetServerSideProps } from "next";
import { State } from "types/State";
import { User } from "types/User";
import { Layout } from "src/components/Layout";
import lang from "../../language.json";
import { ModalIds } from "types/ModalIds";
import { Item, Span } from "src/components/Item";

interface Props {
  user: User | null;
}

const AccountPage = ({ user }: Props) => {
  console.log(user);

  return (
    <Layout>
      <h3>{lang.auth.account.account_info}</h3>

      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h4>{user?.username}</h4>

          <div className="d-flex">
            <button
              data-bs-toggle="modal"
              data-bs-target={`#${ModalIds.EditPassword}`}
              className="btn btn-primary me-2"
            >
              {lang.auth.account.edit_password}
            </button>
            {user?.rank === "owner" ? (
              <p>{lang.account.owner_cannot_delete_account}</p>
            ) : (
              <button
                data-bs-toggle="modal"
                data-bs-target={`#${ModalIds.DeleteAccount}`}
                className="btn btn-danger"
              >
                {lang.auth.account.delete_acc}
              </button>
            )}
          </div>
        </div>

        <div className="card-body">
          <Item id="rank">
            <Span>{lang.global.rank}: </Span>
            {user?.rank}
          </Item>

          <Item id="leo">
            <Span>{lang.auth.account.police_access}: </Span>
            {user?.leo}
          </Item>

          <Item id="dispatch">
            <Span>{lang.auth.account.dispatch_access}: </Span>
            {user?.dispatch}
          </Item>

          <Item id="ems_fd">
            <Span>{lang.auth.account.ems_fd_access}: </Span>
            {user?.ems_fd}
          </Item>

          <Item id="tow">
            <Span>{lang.auth.account.tow_access}: </Span>
            {user?.tow}
          </Item>

          <Item id="steam">
            <Span>{lang.account.steam_id}: </Span>
            {user?.steam_id}
          </Item>

          {user?.steam_id ? (
            // TODO: onClick={handleUnlink}
            <button className="btn btn-danger mt-2">{lang.account.unlink_steam}</button>
          ) : (
            <a href="/api/auth/steam" className="d-block mt-2">
              <img src="https://community.cloudflare.steamstatic.com/public/images/signinthroughsteam/sits_01.png" />
            </a>
          )}
        </div>

        <div className="card-footer d-flex">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary text-light col-md-4 me-1"
            href="https://github.com/Dev-CasperTheGhost/snaily-cadv3/blob/main/CHANGELOG.md"
          >
            {lang.auth.account.changelog}
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary text-light col-md-4 me-1"
            href="https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/new?assignees=&labels=&template=feature_request.md&title="
          >
            {lang.auth.account.new_feature}
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary text-light col-md-4"
            href="https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/new?assignees=Dev-CasperTheGhost&labels=&template=bug_report.md&title=%5BBug%5D"
          >
            {lang.auth.account.report_a_bug}
          </a>
        </div>
      </div>

      {/* TODO: add modals here */}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers.cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
});

export default connect(mapToProps)(AccountPage);
