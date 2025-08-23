import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Page.css";
import Loader from "../Loader";
import Button from "../Button";
import Rating from "../Rating";
import { toast } from "react-hot-toast";

const OwnerDashboard = ({ storeId }) => {
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({ count: 0, pages: 1 });
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/stores/ratings`,
          {
            params: pagination,
            withCredentials: true,
          }
        );
        setRatings(res.data?.data.ratings || []);
        setAverageRating(res.data?.data.average_rating || 0);
        setTotal({
          count: parseInt(res.data?.total) || 0,
          pages: parseInt(res.data?.totalPages) || 1,
        });
      } catch (error) {
        console.error(error.message);
        toast.error("Unable to load ratings: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [pagination.page, pagination.limit, storeId]);

  return (
    <div className="basic-page">
      {loading ? (
        <Loader label="Loading ratings ..." />
      ) : (
        <div>
          <div className="metrics-card">
            <h2>Average Rating</h2>
            <div className="metrics-value">
              {averageRating}
              <span className="out-of"> / 5</span>
            </div>
            <Rating value={Math.round(averageRating)} disabled={true} />
          </div>

          <h3>
            Showing {(pagination.page - 1) * pagination.limit + ratings.length}{" "}
            out of {total.count} ratings
          </h3>
          <table className="basic-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map(({ name, email, rating, created_at }) => (
                <tr key={email + created_at}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>
                    <Rating value={rating} disabled={true} />
                  </td>
                  <td>{new Date(created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="controls">
        <Button
          disabled={pagination.page === 1}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
        >
          Prev
        </Button>
        <span>
          Page {pagination.page} of {total.pages}
        </span>
        <Button
          disabled={pagination.page === total.pages || total.pages === 0}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.min(prev.page + 1, total.pages),
            }))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
