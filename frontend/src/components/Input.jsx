import { useState } from "react";
import { useController } from "react-hook-form";

const Input = ({ name, control, label, type = "text", rules = {}, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { field, fieldState } = control
    ? useController({ name, control, rules })
    : { field: props, fieldState: { error: null } };

  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}

      <div className="input-wrapper">
        <input
          id={name}
          {...field}
          type={type === "password" && showPassword ? "text" : type}
          className={`input ${fieldState?.error ? "error" : ""}`}
        />
        {type === "password" && (
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {fieldState?.error && (
        <span className="error-message">{fieldState.error.message}</span>
      )}
    </div>
  );
};

export default Input;
