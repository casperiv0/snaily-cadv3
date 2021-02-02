import ReactSelect, { Props as SelectProps } from "react-select";
import React from "react";
import SelectStyles from "./SelectStyles";

interface Props {
  onChange: any;
  options: SelectProps["options"];
  defaultValue?: SelectProps["defaultValue"];
}

const Select: React.FC<Props> = ({ onChange, options, defaultValue }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <ReactSelect
      isSearchable
      isMulti
      styles={SelectStyles}
      onChange={onChange}
      options={options}
      defaultValue={defaultValue}
      closeMenuOnSelect={false}
      menuIsOpen={menuOpen}
      onMenuClose={() => setMenuOpen(false)}
      onMenuOpen={() => setMenuOpen(true)}
      onBlur={() => setMenuOpen(false)}
      components={{
        Option: ({ children, innerProps }) => (
          <div
            className="bg-secondary border-secondary text-light px-2 py-2"
            style={{ cursor: "pointer" }}
            {...innerProps}
          >
            {children}
          </div>
        ),
      }}
    ></ReactSelect>
  );
};

export default Select;
