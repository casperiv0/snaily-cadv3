import * as React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { Layout } from "@components/Layout";
import { Nullable, State } from "types/State";
import { Value } from "types/Value";
import lang from "src/language.json";
import { AdminLayout } from "@components/admin/AdminLayout";
import { ValuePaths } from "types/ValuePaths";
import { getValuesByPath, deleteValueById } from "@actions/values/ValuesActions";
import { Loader } from "@components/Loader/Loader";
import { useObserver } from "@hooks/useObserver";
import { ModalIds } from "types/ModalIds";
import { Seo } from "@components/Seo";
import { initializeStore } from "@state/useStore";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { GetServerSideProps } from "next";
import { EditValueModal } from "@components/modals/admin/EditValueModal";
import AddValueModal from "@components/modals/admin/AddValueModal";
import { RanksArr } from "@lib/consts";
import { User } from "types/User";
import { useSearch } from "@hooks/useSearch";

interface Props {
  values: any;
  loading: boolean;
  user: Nullable<User>;

  deleteValueById: (path: ValuePaths, id: string) => void;
}

const paths: string[] = [
  "departments",
  "ethnicities",
  "genders",
  "legal-statuses",
  "cad-licenses",
  "vehicles",
  "weapons",
  "call-types",
];

const Values: React.FC<Props> = ({
  values,
  loading,
  user,

  deleteValueById,
}) => {
  const [tempValue, setTempValue] = React.useState<Value | null>(null);
  const router = useRouter();
  const path = `${router.query.path}` as ValuePaths;
  const { filtered, onChange, search } = useSearch<Value>("name", values[path]);
  const { ref, length } = useObserver<Value>(
    values[path]?.sort((a: Value, _b: Value) => a?.defaults === "1"),
  );

  React.useEffect(() => {
    if (!RanksArr.includes(user?.rank ?? "user")) {
      router.push("/403");
    }
  }, [router, user]);

  function handleDelete(id: string) {
    deleteValueById(path, id);
  }

  if (!paths.includes(path)) {
    return (
      <Layout>
        <AlertMessage message={{ msg: lang.admin.value_not_found, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <AdminLayout>
      <Seo title={lang.admin.values[path].manage} />
      <header className="d-flex justify-content-between">
        <div>
          <h4 style={{ marginBottom: "0.2rem" }}>{lang.admin.values[path].manage}</h4>
          <p style={{ marginTop: "0" }}>
            {lang.admin.total_items}: {values[path]?.length ?? 0}
          </p>
        </div>

        <div>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.AddValue}`}
          >
            {lang.admin.values[path].add}
          </button>
        </div>
      </header>

      <div className="mt-3">
        <input
          type="text"
          value={search}
          onChange={onChange}
          className="form-control bg-dark border-secondary mb-2 text-light"
          placeholder={lang.global.search}
        />

        {!values[path]?.[0] ? (
          <AlertMessage message={{ msg: lang.admin.values[path].none, type: "warning" }} />
        ) : loading ? (
          <Loader />
        ) : (
          <ul className="list-group">
            {filtered.slice(0, length).map((value: Value, idx: number) => {
              return (
                <li
                  ref={ref}
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
                  key={idx}
                  id={`${idx}`}
                >
                  <div>
                    {++idx} | {value.name}
                  </div>

                  <div>
                    {value?.defaults && value.defaults === "0" ? (
                      <>
                        <button onClick={() => handleDelete(value.id)} className="btn btn-danger">
                          {lang.global.delete}
                        </button>
                        <button
                          className="btn btn-success ms-2"
                          data-bs-target={`#${ModalIds.EditValue}`}
                          data-bs-toggle="modal"
                          onClick={() => setTempValue(value)}
                        >
                          {lang.global.edit}
                        </button>
                      </>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <EditValueModal value={tempValue} path={path} />
      <AddValueModal />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);
  await getValuesByPath(`${query.path}` as ValuePaths, req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  values: state.values,
  loading: state.values.loading,
  user: state.auth.user,
});

export default connect(mapToProps, {
  deleteValueById,
})(Values);
