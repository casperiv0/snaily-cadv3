import * as React from "react";
import { connect } from "react-redux";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import lang from "../../language.json";
import DeleteAccountModal from "../../components/modals/account/DeleteAccountModal";
import EditPasswordModal from "../../components/modals/account/EditPasswordModal";
import { Item, Span } from "../citizen/citizen-info";
import useDocTitle from "../../hooks/useDocTitle";
import { unlinkSteam } from "../../lib/actions/auth";
import { ModalIds } from "../../lib/types";

interface Props {
  user: User | null;
  unlinkSteam: () => void;
}

const AccountPage: React.FC<Props> = ({ user, unlinkSteam }) => {
  useDocTitle("My account");

  function handleUnlink() {
    unlinkSteam();
  }

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
              <p>{window.lang.account.owner_cannot_delete_account}</p>
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
            <Span>{window.lang.account.steam_id}: </Span>
            {user?.steam_id}
          </Item>

          {user?.steam_id ? (
            <button className="btn btn-danger mt-2" onClick={handleUnlink}>
              {window.lang.account.unlink_steam}
            </button>
          ) : (
            <a
              href={`/api/v1/auth/steam?callback_url=${window.location.origin}`}
              className="d-block mt-2"
            >
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

      <EditPasswordModal />
      <DeleteAccountModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
});

export default connect(mapToProps, { unlinkSteam })(AccountPage);
