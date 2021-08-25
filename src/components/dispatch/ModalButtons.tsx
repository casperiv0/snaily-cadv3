import * as React from "react";
import { connect } from "react-redux";
import { Cad } from "types/Cad";
import { Nullable, State } from "types/State";
import { Perm } from "types/Perm";
import lang from "../../language.json";
import { playSound } from "lib/utils";
import { SocketEvents } from "types/Socket";
import { ModalIds } from "types/ModalIds";
import { MButton } from "../leo/ModalButtons";
import { socket } from "hooks/useSocket";

const modalButtons: MButton[] = [
  {
    name: lang.global.name_search,
    target: ModalIds.NameSearch,
  },
  {
    name: lang.global.plate_search,
    target: ModalIds.PlateSearch,
  },
  {
    name: lang.global.weapon_search,
    target: ModalIds.WeaponSearch,
  },
  {
    name: lang.global.address_search,
    target: ModalIds.AddressSearch,
  },
  {
    name: lang.global.create_bolo,
    target: ModalIds.CreateBolo,
  },
  {
    name: lang.global.create_911_call,
    target: ModalIds.Create911,
  },
  {
    name: lang.global.notepad,
    target: ModalIds.Notepad,
  },
];

interface Props {
  cadInfo: Nullable<Cad>;
}

const ModalButtonsC: React.FC<Props> = ({ cadInfo }) => {
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

    socket.on(SocketEvents.Signal100, handler);

    return () => {
      socket.off(SocketEvents.Signal100, handler);
      sound.stop();
    };
  }, []);

  function signal100Func() {
    const value = signal100 === "1" ? "0" : "1";
    socket?.emit(SocketEvents.Signal100, value);
  }

  function panicButton() {
    socket?.emit(SocketEvents.PanicButton, { officer_name: "Dispatcher" });
  }

  return (
    <>
      <a href="/dispatch/map" className="btn btn-primary col-md-2">
        {lang.dispatch.live_map}
      </a>
      {modalButtons.map((mButton: MButton, idx: number) => {
        return (
          <button
            id={`${idx}`}
            key={idx}
            className="btn btn-secondary col-md-2"
            data-bs-target={`#${mButton.target}`}
            data-bs-toggle="modal"
          >
            {mButton.name}
          </button>
        );
      })}

      <button onClick={signal100Func} className="btn btn-secondary col-md-2">
        {signal100 === "0" || !signal100
          ? lang.dispatch.en_signal_100
          : lang.dispatch.dis_signal_100}
      </button>
      <button onClick={panicButton} className="btn btn-danger col-md-2">
        {lang.dispatch.panic_button}
      </button>
    </>
  );
};

const mapToProps = (state: State) => ({
  cadInfo: state.global.cadInfo,
});

export const ModalButtons = connect(mapToProps)(ModalButtonsC);
