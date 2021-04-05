import * as React from "react";
import { useSelector } from "react-redux";
import State from "../interfaces/State";

function useDocTitle(title: string) {
  const state = useSelector((state: State) => state.global.cadInfo);

  React.useEffect(() => {
    document.title = `${title} - ${state?.cad_name || "SnailyCAD"}`;

    return () => {
      document.title = "SnailyCAD";
    };
  }, [state?.cad_name, title]);

  return `${title} - ${state?.cad_name || "SnailyCAD"}`;
}

export default useDocTitle;
