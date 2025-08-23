import React from "react";
import { Star } from "lucide-react";
import "./css/Rating.css";

const Rating = ({
  value = 0,
  onChange = () => {},
  max_stars = 5,
  disabled = false,
}) => {
  const handleClick = (index) => {
    if (!disabled) {
      onChange(index + 1);
    }
  };

  return (
    <div className={`rating ${disabled ? "disabled" : ""}`}>
      {Array.from({ length: max_stars }).map((_, index) => (
        <Star
          key={index}
          size={24}
          className={`star ${index < value ? "filled" : ""}`}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default Rating;
