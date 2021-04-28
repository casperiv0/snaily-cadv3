import * as React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Link from "next/link";
import { usePortal } from "@casper124578/useful/hooks/usePortal";
import { Options, useHotkeys } from "react-hotkeys-hook";
import { Items } from "./items";
import { Nullable, State } from "types/State";
import { User } from "types/User";
import { useModalOpen } from "@hooks/useModalOpen";
import { ModalIds } from "types/ModalIds";

interface Props {
  user: Nullable<User>;
}

const KeyOptions: Options = {
  filterPreventDefault: false,
  enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
};

const GlobalSearchC: React.FC<Props> = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const inputRef = useModalOpen<HTMLInputElement>("globalSearch" as ModalIds);
  const ref = usePortal("React_Portal_GlobalSearch");
  const filteredItems = React.useMemo(() => {
    return Items.filter((item) => item.query.join(" ").includes(search.toLowerCase()));
  }, [search]);

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

  return (
    ref &&
    ReactDOM.createPortal(
      <div id="globalSearch">
        <div onClick={() => setOpen(false)} className="modal-backdrop fade show" />
        <div className="global-search rounded bg-dark">
          <form className="global-search-form">
            <input
              ref={inputRef}
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
                    <Link href={item.href || "#"} key={idx}>
                      <a onClick={() => setOpen(false)} className="global-search-item rounded">
                        {item.title}
                      </a>
                    </Link>
                  );
                })
              )
            ) : (
              Items.map((item, idx) => {
                if (!item.show(user)) return null;

                return (
                  <Link href={item.href || "#"} key={idx}>
                    <a onClick={() => setOpen(false)} className="global-search-item rounded">
                      {item.title}
                    </a>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>,
      ref,
    )
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
});

export const GlobalSearch = connect(mapToProps)(GlobalSearchC);
