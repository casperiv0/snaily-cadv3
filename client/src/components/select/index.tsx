import ReactSelect, { Props as SelectProps } from "react-select";
import React from "react";
import SelectStyles from "./SelectStyles";

export interface Value {
  value: string;
  label: string;
}

interface Props {
  onChange: (v: Value) => void;
  options: SelectProps["options"];
  defaultValue?: SelectProps["defaultValue"];
  value?: SelectProps["value"];
  onFocus?: SelectProps["onFocus"];
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  theme?: "light" | "dark";
  isClearable?: boolean;
}

const Select: React.FC<Props> = ({
  onChange,
  onFocus,
  isMulti,
  closeMenuOnSelect,
  options,
  defaultValue,
  value,
  theme = "light",
  isClearable = true,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <ReactSelect
      isClearable={isClearable}
      onFocus={onFocus}
      value={value}
      isSearchable
      isMulti={isMulti !== undefined ? isMulti : true}
      styles={SelectStyles(theme)}
      onChange={onChange}
      options={options}
      defaultValue={defaultValue}
      closeMenuOnSelect={closeMenuOnSelect}
      menuIsOpen={menuOpen}
      onMenuClose={() => setMenuOpen(false)}
      onMenuOpen={() => setMenuOpen(true)}
      onBlur={() => setMenuOpen(false)}
      placeholder={window.lang.global.select}
      noOptionsMessage={window.lang.global.no_options}
    ></ReactSelect>
  );
};

export default Select;
