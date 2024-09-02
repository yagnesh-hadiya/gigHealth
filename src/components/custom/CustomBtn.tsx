import { Button } from "reactstrap";
import { CustomButtonProps } from "../../types/CustomElementTypes";

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  style,
  className,
  ...props
}) => {
  if (typeof props.allow === 'boolean' && !props.allow == true) {
    return null;
  } else {
    return (
      <Button className={className} {...props}>
        {children}
      </Button>
    );
  }

};

export default CustomButton;
