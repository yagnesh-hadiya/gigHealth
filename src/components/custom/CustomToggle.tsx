import { useState } from "react";
import { ToggleSwitchProps } from "../../types/CustomElementTypes";


const ToggleSwitch = ({ onStateChange, checked, allow }: ToggleSwitchProps) => {
  const [state, setState] = useState(checked);

  const handleToggle = () => {
    setState(prevState => {
      onStateChange(!prevState);
      return !prevState;
    });
  }

  if (!allow) {
    return null;
  }

  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={state} onChange={handleToggle} />
      <span className="slider round"></span>
    </label>
  );
};

export default ToggleSwitch;

