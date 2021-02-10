import * as React from "react";
import { connect } from "react-redux";
import { add10Code } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Select from "../../../../components/select";
import State from "../../../../interfaces/State";
import Code10 from "../../../../interfaces/Code10";
import { Link } from "react-router-dom";
import Message from "../../../../interfaces/Message";
import AlertMessage from "../../../../components/alert-message";

export const options = [
  {
    value: "leo",
    label: "LEO",
  },
  {
    value: "dispatch",
    label: "Dispatch",
  },
  {
    value: "ems_fd",
    label: "EMS-FD",
  },
];

export const shouldDoOptions = [
  {
    value: "set_status",
    label: "Should set the status",
  },
  {
    value: "set_off_duty",
    label: "Should set the officer to off-duty",
  },
];

export const colorOptions = [
  {
    value: "btn-danger",
    label: "Red",
  },
  {
    value: "btn-secondary",
    label: "Normal",
  },
];

interface Props {
  message: Message;
  add10Code: (data: Partial<Code10>) => void;
}

const Add10CodePage: React.FC<Props> = ({ add10Code, message }) => {
  const [code, setCode] = React.useState("");
  const [whatPages, setWhatPages] = React.useState([]);
  const [color, setColor] = React.useState("");
  const [shouldDo, setShouldDo] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    add10Code({
      code,
      color: color,
      what_pages: whatPages,
      should_do: shouldDo,
    });
  }

  return (
    <AdminLayout>
      <AlertMessage message={message} dismissible />
      <h1 className="h3">Add 10 code</h1>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="code">
            Code
          </label>
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="what_pages">
            Where should these codes be displayed
          </label>
          <Select
            closeMenuOnSelect={false}
            isMulti
            options={options}
            onChange={(v: any) => setWhatPages(v)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="what_pages">
            Select a color
          </label>
          <Select
            closeMenuOnSelect
            isMulti={false}
            options={colorOptions}
            onChange={(v: any) => setColor(v.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="should_do">
            What should this code do?
          </label>
          <Select
            closeMenuOnSelect
            isMulti={false}
            options={shouldDoOptions}
            onChange={(v: any) => setShouldDo(v.value)}
          />
        </div>
        <div className="mb-3 float-end">
          <Link className="btn btn-danger mx-2" to="/admin/manage/10-codes">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  message: state.global.message,
});

export default connect(mapToProps, { add10Code })(Add10CodePage);
