/* Please use the below params in the paths. */

import { match } from "react-router-dom";
import ValuePaths from "./ValuePaths";

interface Match extends match {
  params: {
    id: string;
    username: string;
    companySlug: string;
    path: ValuePaths;
    citizenId: string;
    companyId: string;
  };
}

export default Match;
