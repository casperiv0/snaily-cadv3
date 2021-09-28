import ReactSelect, { Props as SelectProps } from "react-select";
import React from "react";
import { SelectStyles } from "./selectStyles";
import lang from "../../language.json";

export interface SelectValue {
  value: string;
  label: string;
}

interface Props {
  onChange: (v: SelectValue) => void;
  options: SelectProps["options"];
  defaultValue?: SelectProps["defaultValue"];
  value?: SelectProps["value"];
  onFocus?: SelectProps["onFocus"];
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  theme?: "light" | "dark";
  isClearable?: boolean;
  disabled?: boolean;
  id?: string;
}

export const Select: React.FC<Props> = ({
  onChange,
  onFocus,
  isMulti,
  closeMenuOnSelect,
  options,
  defaultValue,
  value,
  theme = "light",
  isClearable = true,
  disabled,
  id,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <ReactSelect
      id={id}
      isClearable={isClearable}
      onFocus={onFocus}
      value={value}
      isSearchable
      isMulti={isMulti !== undefined ? isMulti : true}
      styles={SelectStyles(theme)}
      onChange={(newValue: any) => onChange(newValue)}
      options={options}
      defaultValue={defaultValue}
      closeMenuOnSelect={closeMenuOnSelect}
      menuIsOpen={menuOpen}
      onMenuClose={() => setMenuOpen(false)}
      onMenuOpen={() => setMenuOpen(true)}
      onBlur={() => setMenuOpen(false)}
      placeholder={lang.global.select}
      noOptionsMessage={() => lang.global.no_options}
      isDisabled={disabled}
    />
  );
};
