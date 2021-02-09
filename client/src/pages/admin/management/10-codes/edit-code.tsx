import * as React from "react";
import { connect } from "react-redux";
import { update10Code, get10Codes } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Select from "../../../../components/select";
import State from "../../../../interfaces/State";
import Code10 from "../../../../interfaces/Code10";
import { Link, useParams } from "react-router-dom";
import Message from "../../../../interfaces/Message";
import AlertMessage from "../../../../components/alert-message";
import { colorOptions, options } from "./add-code";

interface Props {
  message: Message;
  update10Code: (id: string, data: Partial<Code10>) => void;
  get10Codes: () => void;
  codes: Code10[];
}

const Edit10Code: React.FC<Props> = ({ update10Code, message, codes, get10Codes }) => {
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = React.useState("");
  const [whatPages, setWhatPages] = React.useState<Code10["what_pages"]>([]);
  const [color, setColor] = React.useState("");

  const value = {
    value: colorOptions.find((clr) => clr.value === color)?.value,
    label: colorOptions.find((clr) => clr.value === color)?.label,
  };

  React.useEffect(() => {
    get10Codes();
  }, [get10Codes]);

  React.useEffect(() => {
    const code = codes?.find((code) => code.id === id);
    if (!code) return;

    setCode(code?.code);
    setWhatPages(code.what_pages);
    setColor(code.color);
  }, [codes, id]);

  if (codes?.length > 0) {
    if (!value.value) {
      return <AlertMessage message={{ msg: "Code not found", type: "danger" }} />;
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    update10Code(id, {
      code,
      what_pages: whatPages,
      color: color,
    });
  }

  return (
    <AdminLayout>
      <AlertMessage message={message} dismissible />

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
            value={whatPages}
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
            value={value as any}
          />
        </div>
        <div className="mb-3 float-end">
          <Link className="btn btn-danger mx-2" to="/admin/manage/10-codes">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  message: state.global.message,
  codes: state.admin.codes,
});

export default connect(mapToProps, { update10Code, get10Codes })(Edit10Code);
