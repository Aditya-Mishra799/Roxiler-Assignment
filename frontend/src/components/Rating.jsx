import React, { useState } from "react";
import { Star } from "lucide-react";
import "./css/Rating.css";

const Rating = ({
  value = 0,
  onChange = () => {},
  max_stars = 5,
  disabled = false,
}) => {
  const [hoverValue, setHoverValue] = useState(null);

  const handleClick = (index) => {
    if (!disabled) {
      onChange(index + 1);
    }
  };

  const handleMouseEnter = (index) => {
    if (!disabled) {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(null);
    }
  };

  return (
    <div className={`rating ${disabled ? "disabled" : ""}`}>
      {Array.from({ length: max_stars }).map((_, index) => {
        const filled = hoverValue ? index < hoverValue : index < value;

        return (
          <Star
            key={index}
            size={28}
            className={`star ${filled ? "filled" : ""}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
};

export default Rating;
