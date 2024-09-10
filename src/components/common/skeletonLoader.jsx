import React from "react";
import "./styles/skeletonLoader.css";

const SkeletonLoader = ({ width, height, borderRadius = "4px" }) => {
  return (
    <div
      className="skeleton-loader"
      style={{
        width: width || "100%",
        height: height || "100%",
        borderRadius: borderRadius,
      }}
    ></div>
  );
};

export default SkeletonLoader;
