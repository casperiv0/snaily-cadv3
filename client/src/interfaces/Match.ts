/* Please use the below params in the paths. */

import { match } from "react-router-dom";

interface Match extends match {
  params: {
    id: string;
    username: string;
    companySlug: string;
  };
}

export default Match;
