import React from "react";
import PropTypes from "prop-types";
import "./Spinner.css";


const Spinner = ({ size = "3rem", color = "#0d6efd", text = "Loading...", showText = true }) => {
  return (
    <div
      className="d-flex justify-content-center spinner fade-in"
      aria-busy="true"
      aria-live="polite"
      style={{ minHeight: size }}
    >
      <div
        className="spinner-border"
        role="status"
        style={{ width: size, height: size, borderColor: color, borderRightColor: "transparent" }}
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {showText && (
        <span style={{ marginLeft: "1rem", color }}>{text}</span>
      )}
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  showText: PropTypes.bool,
};

export default Spinner;
