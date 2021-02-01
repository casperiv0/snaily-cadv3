import { Styles, GroupTypeBase } from "react-select";

const SelectStyles: Partial<Styles<any, true, GroupTypeBase<any>>> | undefined = {
  valueContainer: (base) => ({
    ...base,
    background: "#6C757D",
    color: "#fff",
  }),
  option: (base) => ({
    ...base,
    padding: "1rem",
    width: "100%",
    backgroundColor: "#6C757D",
    color: "#fff",
    cursor: "pointer",
  }),
  menu: (prov) => ({
    ...prov,
    width: "100%",
    color: "#fff",
    padding: "0.2rem",
    backgroundColor: "#6C757D",
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
    backgroundColor: "#6C757D",
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
    background: "#6C757D",
    border: "1px solid #6C757D",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#fff",
    opacity: "0.4",
  }),
};

export default SelectStyles;
