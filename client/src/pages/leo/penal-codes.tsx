import * as React from "react";
import Layout from "../../components/Layout";
import Markdown from "react-markdown";
import lang from "../../language.json";
import PenalCode from "../../interfaces/PenalCode";
import { getPenalCodes } from "../../lib/actions/admin";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import { Link } from "react-router-dom";
import useDocTitle from "../../hooks/useDocTitle";
import { useObserver } from "../../hooks/useObserver";

interface Props {
  penalCodes: PenalCode[];
  getPenalCodes: () => void;
}

const PenalCodesPage: React.FC<Props> = ({ penalCodes, getPenalCodes }) => {
  useDocTitle(lang.global.penal_codes);
  const [filtered, setFiltered] = React.useState<PenalCode[]>(penalCodes);
  const { ref, length } = useObserver<PenalCode>(penalCodes);

  React.useEffect(() => {
    getPenalCodes();
  }, [getPenalCodes]);

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
      <Link className="btn btn-secondary mb-2" to="/leo/dash">
        {window.lang.global.go_back}
      </Link>

      <ul className="list-group">
        <input
          placeholder={lang.global.search}
          type="search"
          className="form-control bg-dark border-secondary mb-3 text-light"
          onChange={(e) => handleSearch(e.target.value)}
        />
        {filtered?.slice(0, length)?.map((code: PenalCode, idx: number) => {
          return (
            <li
              ref={ref}
              key={idx}
              id={`${idx}`}
              className="list-group-item bg-dark border-secondary"
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

const mapToProps = (state: State) => ({
  penalCodes: state.admin.penalCodes,
});

export default connect(mapToProps, { getPenalCodes })(React.memo(PenalCodesPage));
