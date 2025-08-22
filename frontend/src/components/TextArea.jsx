import { useController } from "react-hook-form";

const TextArea = ({ name, control, label, rules = {}, rows = 4, ...props }) => {
  const { field, fieldState } = control
    ? useController({ name, control, rules })
    : { field: props, fieldState: { error: null } };

  return (
    <div className="textarea-group">
      {label && <label htmlFor={name}>{label}</label>}

      <textarea
        id={name}
        {...field}
        rows={rows}
        className={`textarea ${fieldState?.error ? "error" : ""}`}
      />

      {fieldState?.error && (
        <span className="error-message">{fieldState.error.message}</span>
      )}
    </div>
  );
};

export default TextArea;
