import * as React from "react";
import { connect } from "react-redux";
import { add10Code } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Select from "../../../../components/select";
import Code10 from "../../../../interfaces/Code10";
import { Link, useHistory } from "react-router-dom";
import useDocTitle from "../../../../hooks/useDocTitle";

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
    label: window.lang.admin.set_status,
  },
  {
    value: "set_off_duty",
    label: window.lang.admin.set_off_duty,
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
  add10Code: (data: Partial<Code10>) => Promise<boolean>;
}

const Add10CodePage: React.FC<Props> = ({ add10Code }) => {
  const [code, setCode] = React.useState("");
  const [whatPages, setWhatPages] = React.useState([]);
  const [color, setColor] = React.useState("");
  const [shouldDo, setShouldDo] = React.useState("");
  const history = useHistory();
  useDocTitle(window.lang.admin.add_10_code);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const added = await add10Code({
      code,
      color: color,
      what_pages: whatPages,
      should_do: shouldDo,
    });

    if (added === true) {
      history.push("/admin/manage/10-codes");
    }
  }

  return (
    <AdminLayout>
      <h1 className="h3">{window.lang.admin.add_10_code}</h1>

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
            {window.lang.admin.code_where}
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
            {window.lang.admin.select_color}
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
            {window.lang.admin.what_it_do}
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
            {window.lang.global.cancel}
          </Link>
          <button type="submit" className="btn btn-primary">
            {window.lang.admin.add_code}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default connect(null, { add10Code })(Add10CodePage);
