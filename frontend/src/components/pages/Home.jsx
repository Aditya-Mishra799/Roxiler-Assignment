import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../css/Home.css";

const Home = () => {
  const { authState, reload } = useAuth();
  const { user } = authState;
  useEffect(() => {
    reload();
  }, []);
  if (!user) return null;

  return (
    <div className="home-container">
      <h1>Welcome, {user.name}</h1>
      <div className="user-details-card">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Joined At:</strong>{" "}
          {new Date(user.created_at).toLocaleDateString("en-IN")}
        </p>
      </div>
    </div>
  );
};

export default Home;
