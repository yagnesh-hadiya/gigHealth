import PropTypes from "prop-types";
import { Input } from "reactstrap";

const CustomDisabledYesNoRadio = ({ value }: { value: "Yes" | "No" }) => {
  return (
    <div className="radio-buttons">
      {value === "Yes" ? (
        <>
          <label className="custom-radio-button">
            <Input type="radio" value="Yes" checked={true} />
            <span className="radio-text">Yes</span>
          </label>
          <label className="custom-radio-button">
            <Input type="radio" value="No" checked={false} />
            <span className="radio-text">No</span>
          </label>
        </>
      ) : (
        <>
          <label className="custom-radio-button">
            <Input type="radio" value="Yes" checked={false} />
            <span className="radio-text">Yes</span>
          </label>
          <label className="custom-radio-button">
            <Input type="radio" value="No" checked={true} />
            <span className="radio-text">No</span>
          </label>
        </>
      )}
    </div>
  );
};

CustomDisabledYesNoRadio.propTypes = {
  value: PropTypes.oneOf(["Yes", "No"]).isRequired,
};

export default CustomDisabledYesNoRadio;
