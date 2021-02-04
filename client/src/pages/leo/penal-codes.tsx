import * as React from "react";
import Layout from "../../components/Layout";
import Markdown from "react-markdown";
import lang from "../../language.json";
import PenalCode from "../../interfaces/PenalCode";
import { getPenalCodes } from "../../lib/actions/officer";
import { connect } from "react-redux";
import State from "../../interfaces/State";

interface Props {
  penalCodes: PenalCode[];
  getPenalCodes: () => void;
}

const PenalCodesPage: React.FC<Props> = ({ penalCodes, getPenalCodes }) => {
  const [filtered, setFiltered] = React.useState<PenalCode[]>(penalCodes);
  const [length, setLength] = React.useState<number>(15);

  const observer = React.useRef<any>(null);
  const lastRef = React.useCallback(
    (node) => {
      if (length > penalCodes.length) return;
      if (observer.current) observer.current?.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setLength((prev) => prev + 15);
        }
      });
      if (node) observer.current?.observe(node);
    },
    [penalCodes, length],
  );

  React.useEffect(() => {
    getPenalCodes();
  }, [getPenalCodes]);

  function handleSearch(value: string) {
    const filtered = penalCodes.filter((code) =>
      code.title.toLowerCase().includes(value.toLowerCase()),
    );

    setFiltered(filtered);
  }

  return (
    <Layout classes="mt-5 pb-5">
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
              ref={lastRef}
              key={idx}
              id={`${idx}`}
              className="list-group-item bg-dark border-secondary"
            >
              <h4>{code.title}</h4>
              <Markdown className="mt-4 pl-4" escapeHtml={false} source={code.des} />
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  penalCodes: state.officers.penalCodes,
});

export default connect(mapToProps, { getPenalCodes })(React.memo(PenalCodesPage));
