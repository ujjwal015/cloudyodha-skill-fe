import React from "react";
import { PulseLoader, SyncLoader } from "react-spinners";
import './Loader.css';


const SyncReactLoader = ({
  loading,
  color = "#000000",
  size = 5,
  margin =2,
}) => {
  return (
    <div className="loader-container">
      <PulseLoader
        color={color}
        loading={loading}
        size={size}
        margin={margin}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default SyncReactLoader;
