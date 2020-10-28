import * as React from "react";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import AlertMessage from "../../components/alert-message";
import lang from "../../language.json";
import DeleteAccountModal from "../../components/modals/account/deleteAccountModal";
import EditPasswordModal from "../../components/modals/account/editPasswordModal";
import { connect } from "react-redux";
import { Item, Span } from "../citizen/citizen-info";

interface Props {
  user: User;
  message: string;
}

const AccountPage: React.FC<Props> = ({ user, message }) => {
  return (
    <Layout>
      {message ? <AlertMessage type="success" message={message} /> : null}

      <h3>{lang.auth.account.account_info}</h3>

      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h4>{user.username}</h4>

          <div>
            <button
              data-toggle="modal"
              data-target="#editPasswordModal"
              className="btn btn-primary"
            >
              {lang.auth.account.edit_password}
            </button>
            <button
              data-toggle="modal"
              data-target="#deleteAccountModal"
              className="btn btn-danger ml-2"
            >
              {lang.auth.account.delete_acc}
            </button>
          </div>
        </div>

        <div className="card-body">
          <Item id="rank">
            <Span>{lang.global.rank}: </Span>
            {user.rank}
          </Item>

          <Item id="leo">
            <Span>{lang.auth.account.police_access}: </Span>
            {user.leo}
          </Item>

          <Item id="dispatch">
            <Span>{lang.auth.account.dispatch_access}: </Span>
            {user.dispatch}
          </Item>

          <Item id="ems_fd">
            <Span>{lang.auth.account.ems_fd_access}: </Span>
            {user.ems_fd}
          </Item>

          <Item id="tow">
            <Span>{lang.auth.account.tow_access}: </Span>
            {user.tow}
          </Item>
        </div>

        <div className="card-footer d-flex">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary col-md-4 mr-1"
            href="https://github.com/Dev-CasperTheGhost/snaily-cadv3/blob/main/CHANGELOG.md"
          >
            {lang.auth.account.changelog}
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary col-md-4 mr-1"
            href="https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/new?assignees=&labels=&template=feature_request.md&title="
          >
            {lang.auth.account.new_feature}
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary col-md-4"
            href="https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/new"
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
  message: state.global.message,
});

export default connect(mapToProps)(AccountPage);
