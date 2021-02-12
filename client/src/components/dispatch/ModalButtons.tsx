import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import CadInfo from "../../interfaces/CadInfo";
import State from "../../interfaces/State";
import { Perm } from "../../interfaces/User";
import lang from "../../language.json";
import socket from "../../lib/socket";
import { MButton } from "../leo/ModalButtons";

const modalButtons: MButton[] = [
  {
    name: lang.global.name_search,
    target: "#nameSearchModal",
  },
  {
    name: lang.global.plate_search,
    target: "#plateSearchModal",
  },
  {
    name: lang.global.weapon_search,
    target: "#weaponSearchModal",
  },
  {
    name: lang.global.address_search,
    target: "#addressSearchModal",
  },
  {
    name: lang.global.create_bolo,
    target: "#createBoloModal",
  },
  {
    name: lang.global.create_911_call,
    target: "#call911Modal",
  },
  {
    name: lang.global.notepad,
    target: "#notepad",
  },
];

interface Props {
  cadInfo: CadInfo;
}

const ModalButtons: React.FC<Props> = ({ cadInfo }) => {
  const [signal100, setSignal100] = React.useState<Perm>(cadInfo.signal_100);

  React.useEffect(() => {
    setSignal100(cadInfo.signal_100);
  }, [cadInfo]);

  React.useEffect(() => {
    socket.on("SIGNAL_100", (value: Perm) => {
      setSignal100(value);
    });
  }, []);

  function signal100Func() {
    const value = signal100 === "1" ? "0" : "1";
    socket.emit("SIGNAL_100", value);
  }

  function panicButton() {
    socket.emit("PANIC_BUTTON", { officer_name: "Dispatcher" });
  }

  return (
    <>
      <Link to="/dispatch/map" className="btn btn-primary col-md-2">
        Live map
      </Link>
      {modalButtons.map((mButton: MButton, idx: number) => {
        return (
          <button
            id={`${idx}`}
            key={idx}
            className="btn btn-secondary col-md-2"
            data-bs-target={mButton.target}
            data-bs-toggle="modal"
          >
            {mButton.name}
          </button>
        );
      })}

      <button onClick={signal100Func} className="btn btn-secondary col-md-2">
        {signal100 === "0" || !signal100 ? "Enable" : "Disable"} Signal 100
      </button>
      <button onClick={panicButton} className="btn btn-danger col-md-2">
        Panic Button
      </button>
    </>
  );
};

const mapToProps = (state: State) => ({
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps)(ModalButtons);
