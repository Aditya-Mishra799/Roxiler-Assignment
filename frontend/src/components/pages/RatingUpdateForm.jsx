import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Button from "../Button";
import Rating from "../Rating";

const RatingUpdateForm = ({ store_id, user_rating, closeModal }) => {
  const [ratingValue, setRatingValue] = useState(user_rating);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitRating = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/stores/ratings/upsert`,
        { rating: ratingValue, store_id: store_id },
        { withCredentials: true }
      );
      closeModal(true);
      toast.success("Rating Updated Sucessfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update rating");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <Rating
        value={ratingValue}
        onChange={setRatingValue}
        disabled={submitting}
      />
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <Button
          onClick={handleSubmitRating}
          disabled={submitting || !ratingValue}
        >
          {submitting ? "Saving..." : "Submit"}
        </Button>
        <Button variant="secondary" onClick={() => closeModal(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default RatingUpdateForm;
