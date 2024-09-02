import { useEffect, useState } from "react";
import { ToggleSwitchProps } from "../../types/CustomElementTypes";


const ProfessionalToggleSwitch = ({ onStateChange, checked, allow }: ToggleSwitchProps) => {
    const [state, setState] = useState(checked);

    useEffect(() => {
        setState(checked);
    }, [checked]);

    const handleToggle = () => {
        const newState = !state;
        setState(newState);
        onStateChange(newState);
    };

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

export default ProfessionalToggleSwitch;

