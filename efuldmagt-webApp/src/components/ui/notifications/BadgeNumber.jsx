import React from "react";

const BadgeNumber = ({ number, className }) => {
  return (
    <div
      className={`flex justify-center items-center bg-blue-500 text-white rounded-full ${className}`}
    >
      {number}
    </div>
  );
};

export default BadgeNumber;
