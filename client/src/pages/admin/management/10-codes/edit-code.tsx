import * as React from "react";
import { connect } from "react-redux";
import { update10Code, get10Codes } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Select from "../../../../components/select";
import State from "../../../../interfaces/State";
import Code10 from "../../../../interfaces/Code10";
import { Link, useHistory, useParams } from "react-router-dom";
import Message from "../../../../interfaces/Message";
import AlertMessage from "../../../../components/alert-message";
import { colorOptions, options, shouldDoOptions } from "./add-code";
import useDocTitle from "../../../../hooks/useDocTitle";
import { notify } from "../../../../lib/functions";

interface Props {
  message: Message | null;
  update10Code: (id: string, data: Partial<Code10>) => Promise<boolean>;
  get10Codes: () => void;
  codes: Code10[];
}

const Edit10Code: React.FC<Props> = ({ update10Code, message, codes, get10Codes }) => {
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = React.useState("");
  const [whatPages, setWhatPages] = React.useState<Code10["what_pages"]>([]);
  const [color, setColor] = React.useState("");
  const [shouldDo, setShouldDo] = React.useState("");
  const history = useHistory();
  useDocTitle("Edit 10 Code");

  const value = {
    value: colorOptions.find((clr) => clr.value === color)?.value,
    label: colorOptions.find((clr) => clr.value === color)?.label,
  };
  const shouldDoValue = {
    value: shouldDoOptions.find((option) => option.value === shouldDo)?.value,
    label: shouldDoOptions.find((option) => option.value === shouldDo)?.label,
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
    setShouldDo(code.should_do);
  }, [codes, id]);

  if (codes?.length > 0) {
    if (!value.value) {
      return <AlertMessage message={{ msg: "Code not found", type: "danger" }} />;
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (whatPages.length <= 0) {
      return notify("Please fill in all fields").error();
    }

    const updated = await update10Code(id, {
      code,
      what_pages: whatPages,
      color: color,
      should_do: shouldDo,
    });

    if (updated === true) {
      history.push("/admin/manage/10-codes");
    }
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
        <div className="mb-3">
          <label className="form-label" htmlFor="should_do">
            What should this code do?
          </label>
          <Select
            closeMenuOnSelect
            isMulti={false}
            options={shouldDoOptions}
            onChange={(v: any) => setShouldDo(v.value)}
            value={shouldDoValue as any}
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
