import * as React from "react";
import { Link } from "react-router-dom";
import Bleet from "../../interfaces/Bleet";
import lang from "../../language.json";

interface Props {
  bleet: Bleet;
  idx: number;
}

const BleetItem: React.FC<Props> = ({ bleet, idx }) => {
  return (
    <div
      className="card bg-dark border-secondary mt-2"
      style={{ minHeight: "5rem" }}
      key={idx}
      id={`${idx}`}
    >
      <div className="card-header d-flex justify-content-between">
        {bleet.title}
        <Link className="btn btn-primary" to={"/bleet/" + bleet.id}>
          {lang.bleeter.view_bleet}
        </Link>
      </div>

      <div className="card-body">
        {bleet.body?.length > 120
          ? bleet.body?.split("").slice(0, 120).join("") + "..."
          : bleet.body}
      </div>
    </div>
  );
};

export default BleetItem;
