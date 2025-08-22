import React from "react";
import { useController } from "react-hook-form";

const Select = ({ name, control, label, options = [], rules = {}, ...props }) => {
  const { field, fieldState } = control
    ? useController({ name, control, rules })
    : { field: props, fieldState: { error: null } };

  return (
    <div className="select-group">
      {label && <label htmlFor={name}>{label}</label>}

      <select
        id={name}
        {...field}
        className={`select ${fieldState?.error ? "error" : ""}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {fieldState?.error && (
        <span className="error-message">{fieldState.error.message}</span>
      )}
    </div>
  );
};

export default Select;
