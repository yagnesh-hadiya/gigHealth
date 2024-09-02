import Select from "react-select";
import { CustomSelectProps } from "../../types/CustomElementTypes";

const CustomSelect = ({
  styles,
  id,
  name,
  options,
  noOptionsMessage,
  placeholder,
  isClearable,
  isSearchable,
  isDisabled,
  value,
  onChange,
  menuPlacement,
}: CustomSelectProps) => {
  const customStyles = {
    control: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      width: "100%",
      border: state.isFocused ? "1px solid #DDDDEA" : "1px solid #DDDDEA",
      boxShadow: "none",
    }),
    option: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      background: state.isFocused ? "#fff" : "#fff",
      color: state.isFocused ? "#474D6A" : "#262638",
      cursor: "pointer",
      maxHeight: "200px",
      "&:hover": {},
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#717B9E",
      fontSize: "14px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#262638",
      fontSize: "14px",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: "none",
    }),
    // menu: (provided: any) => ({
    //   ...provided,
    //   // maxHeight: "100px",
    //   zIndex: 10,
    // }),
  };

  const handleChange = (selectedOption: any): void => {
    onChange(selectedOption);
  };

  return (
    <Select
      id={id}
      name={name}
      options={options}
      noOptionsMessage={noOptionsMessage}
      placeholder={placeholder}
      className="custom-select-picker-all"
      classNamePrefix="select_input"
      value={value}
      styles={styles ? styles : customStyles}
      onChange={handleChange}
      isClearable={isClearable}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      menuPlacement={menuPlacement}
    />
  );
};
export default CustomSelect;
