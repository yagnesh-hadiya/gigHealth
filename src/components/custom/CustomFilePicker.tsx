import * as React from "react";
import { Ref, RefObject } from "react";
import { Input } from "reactstrap";
import { CustomInputProps } from "../../types/CustomElementTypes";

const CustomFileInput = React.forwardRef(
  ({ styles, ...props }: CustomInputProps, ref: Ref<HTMLInputElement>) => {
    return (
      <Input
        className="custom-input"
        innerRef={ref as RefObject<HTMLInputElement>}
        {...props}
      />
    );
  }
);

export default CustomFileInput;
