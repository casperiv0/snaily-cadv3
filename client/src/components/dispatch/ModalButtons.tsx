import * as React from "react";
import { connect } from "react-redux";
import CadInfo from "../../interfaces/CadInfo";
import State from "../../interfaces/State";
import { Perm } from "../../interfaces/User";
import lang from "../../language.json";
import { playSound } from "../../lib/functions";
import socket from "../../lib/socket";
import { SOCKET_EVENTS } from "../../lib/types";
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
  cadInfo: CadInfo | null;
}

const ModalButtons: React.FC<Props> = ({ cadInfo }) => {
  const [signal100, setSignal100] = React.useState<Perm>(cadInfo?.signal_100 ?? "0");

  React.useEffect(() => {
    setSignal100(cadInfo?.signal_100 ?? "0");
  }, [cadInfo]);

  React.useEffect(() => {
    const sound = playSound("/sounds/signal-100.wav");
    const handler = (value: Perm) => {
      if (value === "1") {
        sound.play();
      }
      setSignal100(value);
    };

    socket.on(SOCKET_EVENTS.SIGNAL_100, handler);

    return () => {
      socket.off(SOCKET_EVENTS.SIGNAL_100, handler);
      sound.stop();
    };
  }, []);

  function signal100Func() {
    const value = signal100 === "1" ? "0" : "1";
    socket.emit(SOCKET_EVENTS.SIGNAL_100, value);
  }

  function panicButton() {
    socket.emit(SOCKET_EVENTS.PANIC_BUTTON, { officer_name: "Dispatcher" });
  }

  return (
    <>
      <a href="/dispatch/map" className="btn btn-primary col-md-2">
        {window.lang.dispatch.live_map}
      </a>
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
        {signal100 === "0" || !signal100
          ? window.lang.dispatch.en_signal_100
          : window.lang.dispatch.dis_signal_100}
      </button>
      <button onClick={panicButton} className="btn btn-danger col-md-2">
        {window.lang.dispatch.panic_button}
      </button>
    </>
  );
};

const mapToProps = (state: State) => ({
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps)(ModalButtons);
