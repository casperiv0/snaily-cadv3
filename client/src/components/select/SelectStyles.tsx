import { Styles, GroupTypeBase } from "react-select";

const DARK = "#212529";
const LIGHT = "#6C757D";

function color(theme: string) {
  return theme.toLowerCase() === "light" ? LIGHT : DARK;
}

const SelectStyles = (
  theme = LIGHT,
): Partial<Styles<any, true, GroupTypeBase<any>>> | undefined => ({
  valueContainer: (base) => ({
    ...base,
    background: color(theme),
    color: "#fff",
    ":hover": {
      borderColor: `${color(theme)}`,
    },
  }),
  option: (base) => ({
    ...base,
    padding: "0.5rem",
    width: "100%",
    backgroundColor: color(theme),
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 200ms",
    borderRadius: "0.2rem",
    marginTop: "0.2rem",
    ":hover": {
      backgroundColor: "#565D64",
    },
  }),
  menu: (prov) => ({
    ...prov,
    width: "100%",
    color: "#fff",
    padding: "0.5rem",
    backgroundColor: color(theme),
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
  }),
  multiValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "#fff",
  }),
  multiValueLabel: (base) => ({
    ...base,
    backgroundColor: "#2f2f2F",
    color: "#fff",
    padding: "0.2rem 0.8rem",
    borderRadius: "2px 0 0 2px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    backgroundColor: "#2f2f2f",
    borderRadius: "0 2px 2px 0",
    cursor: "pointer",
    ":hover": {
      opacity: "0.8",
    },
  }),
  indicatorsContainer: (base) => ({
    ...base,
    backgroundColor: color(theme),
    color: "#fff",
  }),
  clearIndicator: (base, state) => ({
    ...base,
    cursor: "pointer",
    color: state.isFocused ? "#fff" : "#fff",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    cursor: "pointer",
    color: state.isFocused ? "#fff" : "#fff",
  }),
  control: (base) => ({
    ...base,
    background: color(theme),
    border: `1px solid ${color(theme)}`,
    ":hover": {
      borderColor: `${color(theme)}`,
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#fff",
    opacity: "0.4",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  input: (base) => ({
    ...base,
    color: "#fff",
  }),
  container: (base) => ({
    ...base,
    borderColor: "none",
    ":hover": {
      borderColor: "none",
    },
  }),
});

export default SelectStyles;
