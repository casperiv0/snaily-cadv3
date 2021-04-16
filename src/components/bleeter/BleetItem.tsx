import * as React from "react";
import Link from "next/link";
import { Bleet } from "types/Bleet";
import lang from "../../language.json";

interface Props {
  bleet: Bleet;
  idx: number;
}

export const BleetItem: React.FC<Props> = ({ bleet, idx }) => {
  return (
    <div
      className="card bg-dark border-secondary mt-2"
      style={{ minHeight: "5rem" }}
      key={idx}
      id={`${idx}`}
    >
      <div className="card-header d-flex justify-content-between">
        {bleet.title}
        <Link href={"/bleeter/" + bleet.id}>
          <a className="btn btn-primary">{lang.bleeter.view_bleet}</a>
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
