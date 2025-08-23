import React from "react";
import "./css/Modal.css";

const Modal = ({ open, setOpen, label, body }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{label}</h2>
          <button className="modal-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <div className="modal-body">{body}</div>
      </div>
    </div>
  );
};

export default Modal;
