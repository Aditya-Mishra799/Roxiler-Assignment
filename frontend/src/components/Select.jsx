import React from "react";

const Select = () => {
  return (
    <div className="select-group">
      <label htmlFor="role">Role</label>
      <select id="role">
        <option value="user">User</option>
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
};

export default Select;
