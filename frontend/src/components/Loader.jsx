import React from 'react';
import { Loader2 } from 'lucide-react';
import './Loader.css';

const Loader = ({ label = '' }) => {
  return (
    <div className="loader-container">
      <Loader2 className="loader-icon" />
      {label && <div className="loader-label">{label}</div>}
    </div>
  );
};

export default Loader;