import {  SetStateAction, useState } from 'react';
import Select, { components } from 'react-select';
import CustomCheckbox from './CustomCheckbox';
import { CheckboxValueType } from '../../types/FacilityTypes';


const CheckboxOption = (props:any) => (
  <components.Option {...props}>
    
    <CustomCheckbox
      checked={props.isSelected}
      onChange={() => null}
      disabled={false}      
    />
    <div className='selection-text'>{props.children}</div>
  </components.Option>
);

const Control = (props:any) => {
  const { hasValue, placeholder } = props.selectProps;
  const inputValue = props.selectProps.inputValue || '';

  return (
    <components.Control {...props}>
      {props.children}
      {(!hasValue && !inputValue) && placeholder && (
        <div className="placeholder-text">
          <span className="material-symbols-outlined">search</span> {placeholder}
        </div>
      )}
    </components.Control>
  );
};

const MultiSelectComponent = (props:any) => {
  // const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(props.openMenu);

  const [, setOptionSelected] = useState<CheckboxValueType[]>([]);

  const handleChange = (selected: SetStateAction<CheckboxValueType[]>) => {
    
    setOptionSelected(selected);
    if (props.onChange) {
      props.onChange(selected);
    }
  };
  
  return (
    <Select
      isMulti
      name="colors"
      options={props.options}
      className="talent-multi-select"
      classNamePrefix="select"
      components={{ Option: CheckboxOption, Control }}
      placeholder={props.placeholder}
      menuIsOpen={menuIsOpen}
      onChange={handleChange}
      onMenuOpen={() => setMenuIsOpen(true)}
      onMenuClose={() => setMenuIsOpen(props.openMenu)}
      hideSelectedOptions={false}
      {...props}
    />
  );
};

export default MultiSelectComponent;
