import { Form, FormGroup, Input } from "reactstrap";

interface CheckboxProps {
  onChange?: (e: any) => void;
  checked?: boolean;
  disabled: boolean;
  className?: string;
}

const CustomCheckbox = ({ onChange, checked, disabled }: CheckboxProps) => {
  return (
    <Form>
      <FormGroup check inline className="checkbox-wrapper">
        <Input
          type="checkbox"
          onChange={onChange}
          checked={checked}
          disabled={disabled}
          style={{
            backgroundColor: disabled ? "#717B9E99" : "",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />
      </FormGroup>
    </Form>
  );
};

export default CustomCheckbox;
