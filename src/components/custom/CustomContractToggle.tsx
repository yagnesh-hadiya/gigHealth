import { ToggleSwitchProps } from "../../types/CustomElementTypes";

const ToggleSwitch = ({ onStateChange, checked, allow }: ToggleSwitchProps) => {
  const handleToggle = () => {
    onStateChange(!checked);
  };

  if (!allow) {
    return null;
  }

  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={handleToggle} />
      <span className="slider round"></span>
    </label>
  );
};

export default ToggleSwitch;