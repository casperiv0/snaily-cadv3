import * as React from "react";
import Modal, { XButton } from ".";
import lang from "../../language.json";

const NotepadModal: React.FC = () => {
  const local = localStorage.getItem("snailycad_notepad") || "";
  const [note, setNote] = React.useState<string>(String(local));
  const btnRef = React.createRef<HTMLButtonElement>();

  function saveToLocal() {
    localStorage.setItem("snailycad_notepad", String(note));
  }

  function clearLocal() {
    setNote("");
    localStorage.removeItem("snailycad_notepad");
  }

  return (
    <Modal size="lg" id="notepad">
      <div className="modal-header">
        <h5 className="modal-title">{lang.global.notepad}</h5>
        <XButton ref={btnRef} />
      </div>

      <div className="modal-body">
        <textarea
          className="form-control bg-secondary border-secondary text-light"
          cols={30}
          rows={30}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">
          {lang.global.close}
        </button>
        <button onClick={clearLocal} type="button" className="btn btn-danger">
          {lang.global?.clear}
        </button>
        <button
          type="button"
          className="ml-1 btn btn-success"
          data-dismiss="modal"
          onClick={saveToLocal}
        >
          {lang.global?.save}
        </button>
      </div>
    </Modal>
  );
};

export default NotepadModal;
