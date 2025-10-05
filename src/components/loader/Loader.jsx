import React from "react";

const Loader = () => {
  const drops = Array.from({ length: 100 });
  return (
    <div className="loader-overlay">
      <div className="spinner mb-2" />
      <p>Please Wait a Moment</p>
      <div className="rain">
        {drops.map((_, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
