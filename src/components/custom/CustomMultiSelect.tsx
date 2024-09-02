import { SetStateAction, useState } from "react";
import Select, { components, OptionProps } from "react-select";
import { CheckboxValueType } from "../../types/FacilityTypes";
import CustomCheckbox from "./CustomCheckbox";

interface CheckboxProps {
  checked: boolean;
}

const Option: React.FC<
  OptionProps<CheckboxValueType, false> & CheckboxProps
> = (props: any) => (
  <components.Option {...props}>
    <div className="d-flex">
      <CustomCheckbox
        checked={props.isSelected}
        onChange={() => null}
        disabled={false}
      />
      <label className="multiselect-text">{props.label}</label>
    </div>
  </components.Option>
);

const CustomMultiSelect = (props: any) => {
  const [, setOptionSelected] = useState<CheckboxValueType[]>([]);

  const handleChange = (selected: SetStateAction<CheckboxValueType[]>) => {
    setOptionSelected(selected);
    if (props.onChange) {
      props.onChange(selected);
    }
  };

  return (
    <Select
      className="custom-multiselect-picker"
      options={props.options}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{
        Option,
      }}
      onChange={handleChange}
      // value={optionSelected}
      {...props}
    />
  );
};

export default CustomMultiSelect;
