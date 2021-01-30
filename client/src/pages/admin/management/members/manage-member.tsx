import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AdminLayout from "../../../../components/admin/AdminLayout";
import AlertMessage from "../../../../components/alert-message";
import Match from "../../../../interfaces/Match";
import Message from "../../../../interfaces/Message";
import State from "../../../../interfaces/State";
import User from "../../../../interfaces/User";
import lang from "../../../../language.json";
import {
  getMemberById,
  updateMemberPerms,
  banMember,
  unBanMember,
} from "../../../../lib/actions/admin";
import { Item, Span } from "../../../citizen/citizen-info";

interface Props {
  message: Message;
  member: User | null;
  user: User;
  match: Match;
  cad: any;
  getMemberById: (id: string) => void;
  updateMemberPerms: (id: string, data: object) => void;
  unBanMember: (id: string) => void;
  banMember: (id: string, banReason: string) => void;
}

const ManageMember: React.FC<Props> = ({
  member,
  user: authenticatedUser,
  message,
  match,
  cad,
  getMemberById,
  updateMemberPerms,
  banMember,
  unBanMember,
}) => {
  const id = match.params.id;
  const [rank, setRank] = React.useState("");
  const [leo, setLeo] = React.useState("");
  const [dispatch, setDispatch] = React.useState("");
  const [emsFd, setEmsFd] = React.useState("");
  const [tow, setTow] = React.useState("");
  const [banReason, setBanReason] = React.useState("");

  React.useEffect(() => {
    getMemberById(id);
  }, [getMemberById, id]);

  React.useEffect(() => {
    if (member?.id) {
      setRank(member?.rank);
      setLeo(member?.leo);
      setDispatch(member?.dispatch);
      setEmsFd(member?.ems_fd);
      setTow(member?.tow);
    }
  }, [member]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateMemberPerms(id, {
      rank,
      leo,
      dispatch,
      emsFd,
      tow,
    });
  }

  function handleBan() {
    banMember(member?.id!, banReason);
  }

  function handleUnban() {
    unBanMember(member?.id!);
  }

  if (member !== null && !member) {
    return (
      <AdminLayout>
        <AlertMessage message={{ msg: "Not found", type: "danger" }} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {message ? <AlertMessage message={message} dismissible /> : null}

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="rank">
            {lang.global.rank}
          </label>
          {authenticatedUser.username === member?.username ? (
            <AlertMessage message={{ type: "warning", msg: lang.admin.member.own_rank }} />
          ) : member?.rank === "owner" ? (
            <AlertMessage message={{ msg: lang.admin.member.owner, type: "warning" }} />
          ) : (
            <select
              id="rank"
              className="form-control bg-dark border-dark text-light"
              onChange={(e) => setRank(e.target.value)}
            >
              <option value={member?.rank}>{member?.rank}</option>
              <option disabled value="">
                --------
              </option>
              <option value="user">{lang.admin.member.remove_rank}</option>
              <option value="moderator">{lang.admin.member.moderator}</option>
              <option value="admin">{lang.admin.member.admin}</option>
            </select>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="leo">
            {lang.auth.account.police_access}
          </label>
          <select
            id="leo"
            onChange={(e) => setLeo(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          >
            <option value={member?.leo}>
              {member?.leo === "1" ? lang.global.yes : lang.global.no}
            </option>
            <option disabled value="">
              --------
            </option>
            <option value="0">{lang.global.no}</option>
            <option value="1">{lang.global.yes}</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="dispatch">
            {lang.auth.account.dispatch_access}
          </label>
          <select
            id="dispatch"
            onChange={(e) => setDispatch(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          >
            <option value={member?.dispatch}>
              {member?.dispatch === "1" ? lang.global.yes : lang.global.no}
            </option>
            <option disabled value="">
              --------
            </option>
            <option value="0">{lang.global.no}</option>
            <option value="1">{lang.global.yes}</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="ems_fd">
            {lang.auth.account.ems_fd_access}
          </label>
          <select
            id="ems_fd"
            onChange={(e) => setEmsFd(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          >
            <option value={member?.ems_fd}>
              {member?.ems_fd === "1" ? lang.global.yes : lang.global.no}
            </option>
            <option disabled value="">
              --------
            </option>
            <option value="0">{lang.global.no}</option>
            <option value="1">{lang.global.yes}</option>
          </select>
        </div>
        {cad.tow_whitelisted === "1" ? (
          <div className="mb-3">
            <label className="form-label" htmlFor="tow">
              {lang.auth.account.tow_access}
            </label>
            <select
              id="tow"
              onChange={(e) => setTow(e.target.value)}
              className="form-control bg-dark border-dark text-light"
            >
              <option value={member?.tow}>
                {member?.tow === "1" ? lang.global.yes : lang.global.no}
              </option>
              <option disabled value="">
                --------
              </option>
              <option value="0">{lang.global.no}</option>
              <option value="1">{lang.global.yes}</option>
            </select>
          </div>
        ) : null}

        <div className="mb-3 float-end">
          <Link className="btn btn-danger me-2" to="/admin/manage/members">
            {lang.global.cancel}
          </Link>
          <button type="submit" className="btn btn-primary">
            {lang.admin.update_perms}
          </button>
        </div>
      </form>

      <div style={{ marginTop: "5rem", width: "100%" }}>
        <div className="card bg-dark border-dark">
          <div className="card-header">
            <h5 className="card-title">Use the ban hammer</h5>
          </div>

          <div className="card-body">
            {authenticatedUser?.id === member?.id ? (
              <AlertMessage message={{ msg: lang.admin.ban_yourself, type: "warning" }} />
            ) : member?.rank === "owner" ? (
              <AlertMessage message={{ msg: lang.admin.ban_owner, type: "warning" }} />
            ) : member?.banned === "1" ? (
              <>
                <Item id="ban_reason">
                  <Span>{lang.admin.banned_for}: </Span> {member?.ban_reason}
                </Item>
                <button onClick={handleUnban} className="btn btn-success mt-2 col">
                  {lang.admin.un_ban_user}
                </button>
              </>
            ) : (
              <>
                <input
                  id="ban_reason"
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  onChange={(e) => setBanReason(e.target.value)}
                  value={banReason}
                  placeholder={lang.admin.enter_ban_reason}
                  required
                />
                <button onClick={handleBan} className="btn btn-danger mt-2 col">
                  {lang.admin.ban_user}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  member: state.admin.member,
  message: state.global.message,
  user: state.auth.user,
  cad: state.global.cadInfo,
});

export default connect(mapToProps, { getMemberById, updateMemberPerms, banMember, unBanMember })(
  ManageMember,
);
