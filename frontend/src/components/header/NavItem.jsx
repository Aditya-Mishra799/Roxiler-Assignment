import React from "react";
import { Link } from "react-router-dom";
const NavItem = ({ label, href, visible, Icon }) => {
  if (!visible) return;
  return (
      <Link to={href} className="nav-item">{label} <Icon className = "nav-icon"/></Link>
  );
};

export default NavItem;
