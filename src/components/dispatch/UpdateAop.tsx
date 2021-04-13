import * as React from "react";
import { connect } from "react-redux";
import lang from "src/language.json";
import { updateAop } from "@actions/global/GlobalActions";

interface Props {
  updateAop: (aop: string) => void;
}

const UpdateAOPC: React.FC<Props> = ({ updateAop }) => {
  const [aop, setAop] = React.useState<string>("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateAop(aop);
    setTimeout(() => {
      setAop("");
    }, 200);
  }

  return (
    <div className="card bg-dark border-dark">
      <div className="card-header">
        <h5>{lang.dispatch.update_aop}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="aop">
              {lang.dispatch.enter_new_aop}
            </label>
            <input
              type="text"
              onChange={(e) => setAop(e.target.value)}
              value={aop}
              id="aop"
              className="form-control bg-dark border-secondary text-light"
              placeholder={lang.dispatch.aop}
              required
            />
          </div>
          <div className="mb-3">
            <button className="btn btn-secondary w-100" type="submit">
              {lang.dispatch.update_aop}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const UpdateAOP = connect(null, { updateAop })(UpdateAOPC);
