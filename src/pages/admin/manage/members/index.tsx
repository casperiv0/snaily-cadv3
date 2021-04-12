import * as React from "react";
import { connect } from "react-redux";
import { getMembers } from "@actions/admin/AdminActions";
import { AdminLayout } from "@components/admin/AdminLayout";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { State } from "types/State";
import { User } from "types/User";
import { AllMembersTab } from "@components/admin/AllMembers";
import { PendingMembersTab } from "@components/admin/PendingMembers";
import { GetServerSideProps } from "next";
import { initializeStore } from "@state/useStore";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { Seo } from "@components/Seo";
import lang from "src/language.json";
import { useClientPerms } from "@hooks/useClientPerms";

interface Props {
  members: User[];
}

const ManageMembersPage: React.FC<Props> = ({ members }) => {
  const [filtered, setFiltered] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState<string>("");
  useClientPerms("admin");

  React.useEffect(() => {
    setFiltered(members);
  }, [members]);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);

    const filteredItems = members.filter((member: User) =>
      member.username.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFiltered(filteredItems);
  }

  return (
    <AdminLayout>
      <Seo title="Member management" />

      <input
        type="text"
        value={filter}
        onChange={handleFilter}
        className="form-control bg-dark border-dark mb-2 text-light"
        placeholder={`${lang.global.search}..`}
      />

      {!members[0] ? (
        <AlertMessage message={{ msg: lang.admin.no_members_cad, type: "warning" }} />
      ) : !filtered[0] ? (
        <AlertMessage message={{ msg: lang.admin.no_member_found_by_name, type: "warning" }} />
      ) : (
        <>
          <div className="nav nav-tabs">
            <a
              className="nav-item nav-link active bg-dark text-light border-secondary"
              id="all-members-tab"
              data-bs-toggle="tab"
              href="#members_tab"
              role="tab"
              aria-controls="members-tab"
              aria-selected="true"
            >
              {lang.admin.all_members}
            </a>
            <a
              className="nav-item nav-link bg-dark text-light border-secondary mx-1"
              id="pending-members-tab"
              data-bs-toggle="tab"
              href="#pending_tab"
              role="tab"
              aria-controls="nav-contact"
              aria-selected="false"
            >
              {lang.admin.pending_members}
              <div className="badge bg-primary ms-2">
                {members.filter((m) => m.whitelist_status === "pending").length}
              </div>
            </a>
          </div>

          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="members_tab"
              role="tabpanel"
              aria-labelledby="members-tab"
            >
              <AllMembersTab members={filtered} />
            </div>

            <div
              className="tab-pane fade"
              id="pending_tab"
              role="tabpanel"
              aria-labelledby="pending-tab"
            >
              <PendingMembersTab members={filtered} />
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers.cookie)(store.dispatch);
  await getCadInfo(req.headers.cookie)(store.dispatch);
  await getMembers(req.headers.cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  members: state.admin.members,
});

export default connect(mapToProps)(ManageMembersPage);
