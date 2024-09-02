
import { Form, FormGroup, Input } from "reactstrap";

interface CheckboxProps {
  onChange?: (e: any) => void;
  checked?: boolean;
  disabled: boolean;
}

const Checkbox = ({ onChange, checked, disabled }: CheckboxProps) => {
  return (
    <Form>
      <FormGroup check inline>
        <Input type="checkbox" onChange={onChange} checked={checked} disabled={disabled} style={{
          backgroundColor: disabled ? "#717B9E" : "",
          cursor: disabled ? "not-allowed" : "pointer",
        }} />
      </FormGroup>
    </Form>
  );
};

export default Checkbox;
