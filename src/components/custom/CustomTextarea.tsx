import * as React from "react";
import { Ref, RefObject } from "react";
import { Input } from "reactstrap";
import { InputType } from "reactstrap/types/lib/Input";
import { CustomTextAreaProps } from "../../types/CustomElementTypes";

const CustomTextArea = React.forwardRef(
  (
    { styles, type = "textarea", ...props }: CustomTextAreaProps,
    ref: Ref<HTMLTextAreaElement>
  ) => {
    return (
      <Input
        type={type as InputType}
        className="custom-textarea"
        innerRef={ref as RefObject<HTMLTextAreaElement>}
        {...props}
      />
    );
  }
);

export default CustomTextArea;
