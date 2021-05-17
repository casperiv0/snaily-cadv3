import { ModalIds } from "types/ModalIds";
import { Nullable } from "types/State";
import { User } from "types/User";

export interface Item {
  query: string[];
  title: string;
  href?: string;
  show: (user: Nullable<User>) => boolean;
}

// this list will be updated along new releases
export const Items: Item[] = [
  {
    query: ["officer", "create officer", "create an officer", "emergency"],
    title: "Create a new officer",
    href: `/leo/my-officers?modal=${ModalIds.CreateOfficer}`,
    show: (user) => user?.leo === "1",
  },
  {
    query: ["officer", "officer logs", "show officer logs"],
    title: "Show my officer logs",
    href: "/leo/my-logs",
    show: (user) => user?.leo === "1",
  },
  {
    query: ["create ems fd", "fire department", "emergency"],
    title: "Create a new EMS/FD Deputy",
    href: `/ems-fd/deputies?modal=${ModalIds.CreateEmsFd}`,
    show: (user) => user?.ems_fd === "1",
  },
  {
    query: ["live map", "open live map", "view live map"],
    title: "Open the live map",
    href: "/dispatch/map",
    show: (user) => user?.dispatch === "1",
  },
  {
    query: ["citizen", "create citizen", "create a citizen"],
    title: "Create a new citizen",
    href: "/citizens/create",
    show: () => true,
  },
  {
    query: ["citizen", "truck logs", "view truck log"],
    title: "View all my truck logs",
    href: "/truck-logs",
    show: () => true,
  },
  {
    query: ["citizen", "truck logs", "create truck log"],
    title: "Create a new truck log",
    href: `/truck-logs/create?modal=${ModalIds.CreateTruckLog}`,
    show: () => true,
  },
  {
    query: ["citizen", "vehicle", "register vehicle"],
    title: "Register a new vehicle",
    href: `/citizen?modal=${ModalIds.RegisterVehicle}`,
    show: () => true,
  },
  {
    query: ["citizen", "weapon", "register weapon"],
    title: "Register a new weapon",
    href: `/citizen?modal=${ModalIds.RegisterWeapon}`,
    show: () => true,
  },
  {
    query: ["citizen", "company", "join company"],
    title: "Join a company",
    href: `/citizen/manage-companies?modal=${ModalIds.JoinCompany}`,
    show: () => true,
  },
  {
    query: ["citizen", "company", "create company"],
    title: "Create a new company",
    href: `/citizen/manage-companies?modal=${ModalIds.CreateCompany}`,
    show: () => true,
  },
  {
    query: ["bleeter", "create bleet"],
    title: "Create a new bleet",
    href: "/bleeter",
    show: () => true,
  },
  {
    query: ["account", "account settings", "show account"],
    title: "Show my account",
    href: "/account",
    show: () => true,
  },
  {
    query: ["account", "logout"],
    title: "Logout of my account",
    href: "/auth/logout",
    show: () => true,
  },
  {
    query: ["courthouse", "expungement request", "request"],
    title: "Create a new expungement request",
    href: "/courthouse",
    show: () => true,
  },
  {
    query: ["admin", "manage members", "members"],
    title: "Manage all members",
    href: "/admin/manage/members",
    show: (user) => ["admin", "moderator", "owner"].includes(`${user?.rank}`),
  },
  {
    query: ["admin", "manage citizens", "citizens"],
    title: "Manage all citizens",
    href: "/admin/manage/citizens",
    show: (user) => ["admin", "moderator", "owner"].includes(`${user?.rank}`),
  },
  {
    query: ["admin", "manage companies", "companies"],
    title: "Manage all companies",
    href: "/admin/manage/companies",
    show: (user) => ["admin", "moderator", "owner"].includes(`${user?.rank}`),
  },
  {
    query: ["admin", "manage units", "units"],
    title: "Manage all units",
    href: "/admin/manage/units",
    show: (user) =>
      ["admin", "moderator", "owner"].includes(`${user?.rank}`) || user?.supervisor === "1",
  },
  {
    query: ["bleeter", "create bleet", "bleets"],
    title: "Create a bleet",
    href: `/bleeter?modal=${ModalIds.CreateBleet}`,
    show: () => true,
  },
];
