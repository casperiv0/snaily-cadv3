import Link from "next/link";
import * as React from "react";
import { connect } from "react-redux";
import Markdown from "react-markdown";
import { Layout } from "@components/Layout";
import { State } from "types/State";
import lang from "src/language.json";
import { Seo } from "@components/Seo";
import { initializeStore } from "@state/useStore";
import { getCadInfo } from "@actions/global/GlobalActions";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getPenalCodes } from "@actions/admin/AdminActions";
import { PenalCode } from "types/PenalCode";
import { useObserver } from "@hooks/useObserver";
import { GetServerSideProps } from "next";

interface Props {
  penalCodes: PenalCode[];
}

const MyOfficersPage: React.FC<Props> = ({ penalCodes }) => {
  const [filtered, setFiltered] = React.useState<PenalCode[]>(penalCodes);
  const { ref, length } = useObserver<PenalCode>(penalCodes);

  React.useEffect(() => {
    setFiltered(penalCodes);
  }, [penalCodes]);

  function handleSearch(value: string) {
    const filtered = penalCodes.filter((code) =>
      code.title.toLowerCase().includes(value.toLowerCase()),
    );

    setFiltered(filtered);
  }

  return (
    <Layout classes="mt-5 pb-5">
      <Seo title={lang.global.penal_codes} />

      <div className="d-flex mb-2 gap-2">
        <Link href="/leo/dash">
          <a className="btn btn-secondary col-2">{lang.global.go_back}</a>
        </Link>

        <input
          placeholder={lang.global.search}
          type="search"
          className="form-control bg-dark border-secondary text-light"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <ul className="list-group">
        {filtered?.slice(0, length)?.map((code: PenalCode, idx: number) => {
          return (
            <li
              ref={ref}
              key={idx}
              id={`${idx}`}
              className="list-group-item bg-dark border-secondary text-white"
            >
              <h4>{code.title}</h4>
              <div className="mt-4 py-2">
                <Markdown>{code.des}</Markdown>
              </div>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getPenalCodes(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  penalCodes: state.admin.penalCodes,
});

export default connect(mapToProps)(MyOfficersPage);
