import * as React from "react";
import Layout from "../../components/Layout";
import Logger from "../../lib/Logger";
import Markdown from "react-markdown";
import { handleRequest, isSuccess } from "../../lib/functions";
import lang from "../../language.json";

export interface PenalCode {
  title: string;
  des: string;
}

const PenalCodesPage: React.FC = () => {
  const [penalCodes, setPenalCodes] = React.useState<PenalCode[]>([]);
  const [filtered, setFiltered] = React.useState<PenalCode[]>([]);
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

  const getPenalCodes = React.useCallback(async () => {
    try {
      const res = await handleRequest("/officer/penal-codes", "GET");

      if (isSuccess(res)) {
        setPenalCodes(res.data.penalCodes);
        setFiltered(res.data.penalCodes);
      }
    } catch (e) {
      Logger.error("GET_PENAL_CODES", e);
    }
  }, []);

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
              <Markdown escapeHtml={false} source={code.des} />
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default React.memo(PenalCodesPage);
