
import { Form, FormGroup, Input } from "reactstrap";
import { CheckboxProps } from "../../types";


const Checkbox = ({ onChange, checked, disabled , id }: CheckboxProps) => {
  return (
    <Form>
      <FormGroup check inline>
        <Input id={id} type="checkbox" onChange={onChange} checked={checked} disabled={disabled} style={{
          backgroundColor: disabled ? "#717B9E" : "",
          cursor: disabled ? "not-allowed" : "pointer",
        }} />
      </FormGroup>
    </Form>
  );
};

export default Checkbox;
