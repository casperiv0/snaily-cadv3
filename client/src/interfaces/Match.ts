/* Please use the below params in the paths. */

import { match } from "react-router-dom";

interface Match extends match {
  params: {
    id: string;
    username: string;
    companySlug: string;
    path: "genders" | "ethnicities" | "departments" | "legal-statuses" | "vehicles" | "weapons";
  };
}

export default Match;
