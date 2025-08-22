// pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader";
import "../css/Dashboard.css";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/dashboard-metrics`,
          { withCredentials: true }
        );
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <Loader label="Loading metrics..." />;

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="metrics-grid">
        <div className="metric-card">
          <h2>Total Users</h2>
          <p>{metrics.totalUsers}</p>
        </div>
        <div className="metric-card">
          <h2>Total Stores</h2>
          <p>{metrics.totalStores}</p>
        </div>
        <div className="metric-card">
          <h2>Total Ratings</h2>
          <p>{metrics.totalRatings}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
