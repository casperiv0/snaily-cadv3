import * as React from "react";
import format from "date-fns/format";

export function useDashTime() {
  const [time, setTime] = React.useState("");

  const getNow = () => {
    return format(Date.now(), "yyyy-MM-dd, HH:mm:ss");
  };

  React.useEffect(() => {
    setTime(getNow());

    const interval = setInterval(() => {
      setTime(getNow());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return time;
}
