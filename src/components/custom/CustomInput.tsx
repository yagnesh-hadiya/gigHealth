import React, { Ref, RefObject } from "react";
import { Input } from "reactstrap";
import { CustomInputProps } from "../../types/CustomElementTypes";

const CustomInput = React.forwardRef(
  (
    { onChange, onClick, disabled, ...props }: CustomInputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <Input
        className="custom-input"
        innerRef={ref as RefObject<HTMLInputElement>}
        onChange={onChange}
        onClick={onClick}
        autoComplete="new-password"
        disabled={disabled}
        {...props}
      />
    );
  }
);

export default CustomInput;
