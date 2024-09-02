import { useState } from "react";
import { RadioProps } from "../../types/CustomElementTypes";
import { Input } from "reactstrap";

const CustomRadioButton = ({ name, options, onChange }: RadioProps) => {
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  const handleRadioChange = (value: any) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="radio-buttons">
      {options.map((option) => (
        <label key={option.value} className="custom-radio-button">
          <Input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => handleRadioChange(option.value)}
          />
          <span className="radio-text ">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default CustomRadioButton;
