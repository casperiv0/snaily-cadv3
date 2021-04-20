import * as React from "react";
import { connect } from "react-redux";
import { Nullable, State } from "types/State";
import Link from "next/link";
import { setEmsStatus, getActiveEmsFd } from "@actions/ems-fd/EmsFdActions";
import { Code10 } from "types/Code10";
import { Deputy } from "types/Deputy";
import { SocketEvents } from "types/Socket";
import { filterCodes } from "@lib/utils";
import { socket } from "@hooks/useSocket";
import { ModalIds } from "types/ModalIds";

interface Props {
  activeDeputy: Nullable<Deputy>;
  statuses: Code10[];

  setEmsStatus: (deputy: Pick<Deputy, "id" | "status" | "status2">) => void;
  getActiveEmsFd: () => void;
}

const StatusesC: React.FC<Props> = ({ activeDeputy, setEmsStatus, getActiveEmsFd, statuses }) => {
  const isDisabled = React.useMemo(() => {
    if (!activeDeputy?.id) return true;
    if (activeDeputy.status === "off-duty") return true;
    if (activeDeputy.status2.startsWith("---")) return true;

    return false;
  }, [activeDeputy]);

  React.useEffect(() => {
    const handler = () => getActiveEmsFd();
    socket.on(SocketEvents.UpdateActiveUnits, handler);

    return () => {
      socket.off(SocketEvents.UpdateActiveUnits, handler);
    };
  }, [getActiveEmsFd]);

  function updateStatus(e: any) {
    const status = e.target.value;

    /* little spam protection */
    if (activeDeputy?.status2 === status) return;
    if (!activeDeputy) return;

    setEmsStatus({
      id: activeDeputy.id,
      status: "on-duty",
      status2: status,
    });
  }

  return (
    <>
      {activeDeputy ? (
        <button
          className={
            activeDeputy?.status2 === "10-8"
              ? "btn btn-primary col-sm-1"
              : "btn btn-secondary col-sm-1"
          }
          type="button"
          onClick={updateStatus}
          value="10-8"
        >
          10-8
        </button>
      ) : (
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.SelectEmsFd}`}
          className="btn btn-secondary col-sm-1"
        >
          10-8
        </button>
      )}
      {statuses.length <= 0 ? (
        <p>
          You can now have custom 10 codes for your CAD!{" "}
          <Link href="/admin/manage/10-codes">
            <a>If you&apos;re an admin, please add them here</a>
          </Link>
        </p>
      ) : (
        <>
          {filterCodes(statuses)
            .filter((code) => {
              const values = code.what_pages.map((page) => {
                return page.value;
              });

              return values.includes("ems_fd");
            })
            .map((code: Code10, idx: number) => {
              return (
                <button
                  disabled={isDisabled}
                  className={
                    activeDeputy?.status2 === code.code
                      ? "btn btn-primary col-sm-1"
                      : `btn ${code.color} col-sm-1`
                  }
                  type="button"
                  id={`${idx}`}
                  key={idx}
                  onClick={updateStatus}
                  value={code.code}
                >
                  {code.code}
                </button>
              );
            })}
        </>
      )}
    </>
  );
};

const mapToProps = (state: State) => ({
  statuses: state.admin.codes,
  activeDeputy: state.ems_fd.activeDeputy,
});

const Memoized = React.memo(StatusesC);

export const Statuses = connect(mapToProps, { setEmsStatus, getActiveEmsFd })(Memoized);
