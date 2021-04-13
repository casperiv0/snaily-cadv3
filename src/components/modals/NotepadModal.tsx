import * as React from "react";
import { Modal } from "@components/Modal/Modal";
import lang from "../../language.json";
import { ModalIds } from "types/ModalIds";

export const NotepadModal: React.FC = () => {
  const [note, setNote] = React.useState<string>(String(""));

  React.useEffect(() => {
    const local = localStorage.getItem("snailycad_notepad") || "";

    setNote(local);
  }, []);

  function saveToLocal() {
    localStorage.setItem("snailycad_notepad", String(note));
  }

  function clearLocal() {
    setNote("");
    localStorage.removeItem("snailycad_notepad");
  }

  return (
    <Modal title={lang.global.notepad} size="lg" id={ModalIds.Notepad}>
      <div className="modal-body">
        <textarea
          className="form-control bg-secondary border-secondary text-light"
          cols={30}
          rows={15}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          {lang.global.close}
        </button>
        <button onClick={clearLocal} type="button" className="btn btn-danger">
          {lang.global?.clear}
        </button>
        <button
          type="button"
          className="ms-1 btn btn-success"
          data-bs-dismiss="modal"
          onClick={saveToLocal}
        >
          {lang.global?.save}
        </button>
      </div>
    </Modal>
  );
};
