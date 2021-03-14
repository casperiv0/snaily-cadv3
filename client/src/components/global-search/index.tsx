import * as React from "react";
import ReactDOM from "react-dom";
import { Options, useHotkeys } from "react-hotkeys-hook";
import "./styles.css";
import { Items } from "./items";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import User from "../../interfaces/User";

interface Props {
  user: User | null;
}

const KeyOptions: Options = {
  filterPreventDefault: false,
  enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
};

const GlobalSearch: React.FC<Props> = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLInputElement>(null);
  const filteredItems = React.useMemo(() => {
    return Items.filter((item) => item.query.join(" ").includes(search.toLowerCase()));
  }, [search]);

  React.useEffect(() => {
    if (open) {
      ref.current?.focus();
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [open]);

  useHotkeys(
    "esc",
    (e) => {
      e.preventDefault();

      setOpen(false);
    },
    KeyOptions,
  );

  useHotkeys(
    "cmd+k, ctrl+k",
    (e) => {
      e.preventDefault();

      setOpen((v) => !v);
    },
    KeyOptions,
  );

  if (open === false) return null;

  return ReactDOM.createPortal(
    <div id="globalSearch">
      <div onClick={() => setOpen(false)} className="modal-backdrop fade show" />
      <div className="global-search rounded bg-dark">
        <form className="global-search-form">
          <input
            ref={ref}
            className="global-search-input"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            placeholder="Start typing..."
          />
        </form>

        <div className="global-search-results mt-2 px-2">
          {search !== "" ? (
            filteredItems.length <= 0 ? (
              <p className="text-center">No search results found</p>
            ) : (
              filteredItems.map((item, idx) => {
                if (!item.show(user)) return null;

                return (
                  <Link to={item.href || "#"} className="global-search-item rounded" key={idx}>
                    {item.title}
                  </Link>
                );
              })
            )
          ) : (
            Items.map((item, idx) => {
              if (!item.show(user)) return null;

              return (
                <Link to={item.href || "#"} className="global-search-item rounded" key={idx}>
                  {item.title}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.getElementById("global-search")!,
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
});

export default connect(mapToProps)(GlobalSearch);
