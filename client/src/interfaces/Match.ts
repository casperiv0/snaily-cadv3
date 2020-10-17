import { match } from "react-router-dom";

interface Match extends match {
  params: {
    id: string;
  };
}

export default Match;
