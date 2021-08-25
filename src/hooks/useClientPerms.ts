import * as React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RanksArr } from "lib/consts";
import { State } from "types/State";

type Permissions = "moderator" | "leo" | "ems_fd" | "dispatch" | "tow" | "supervisor" | "admin";

export function useClientPerms(permission: Permissions) {
  const user = useSelector((state: State) => state.auth.user);
  const router = useRouter();

  React.useEffect(() => {
    switch (permission) {
      case "leo":
        if (user?.leo === "0") {
          router.push("/403");
        }
        break;
      case "dispatch":
        if (user?.dispatch === "0") {
          router.push("/403");
        }
        break;
      case "tow":
        if (user?.tow === "0") {
          router.push("/403");
        }
        break;
      case "ems_fd":
        if (user?.ems_fd === "0") {
          router.push("/403");
        }
        break;
      case "supervisor":
        if (user?.supervisor === "1") break;

        if (!RanksArr.includes(`${user?.rank}`)) {
          router.push("/403");
        }
        break;

      case "admin":
        if (!RanksArr.includes(`${user?.rank}`)) {
          router.push("/403");
        }
        break;
      default:
        break;
    }
  }, [router, user, permission]);
}
