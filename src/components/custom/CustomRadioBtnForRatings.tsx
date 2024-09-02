import { forwardRef, Ref, RefObject } from "react";
import { FormGroup, Label, Input } from "reactstrap";

export interface CustomRadioBtnProps {
  options: { value: string }[];
  onChange: (value: string) => void;
  selected: boolean;
  disabled?: boolean;
  className?: string;
}

const CustomRadioBtn = forwardRef(
  (
    { options, onChange, selected, disabled, className }: CustomRadioBtnProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <FormGroup
        tag="fieldset"
        className={`radio-btn-wrapper${disabled ? " disabled" : ""}${
          className || ""
        }`}
      >
        {options &&
          options.map((option: { value: string }, index: number) => {
            return (
              <FormGroup key={index} check>
                <Label check className="Label">
                  <Input
                    innerRef={ref as RefObject<HTMLInputElement>}
                    type="radio"
                    className="Input"
                    checked={selected}
                    onChange={() => {
                      onChange(option.value);
                    }}
                    value={option.value}
                    disabled={disabled}
                  />
                  <div className="CustomRadio"></div>
                </Label>
              </FormGroup>
            );
          })}
      </FormGroup>
    );
  }
);

export default CustomRadioBtn;
