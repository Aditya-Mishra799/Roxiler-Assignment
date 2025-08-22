import React from "react";

const Button = ({ children, variant = "solid", className, tiny, ...props }) => {
  return (
    <button
      className={`btn ${variant} ${tiny ? "tiny" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
