"use client";
import React, { useEffect, useState } from "react";

export const BackgroundRippleEffect = ({ rows = 8, cols = 27, cellSize = 60 }) => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRipple = {
        row: Math.floor(Math.random() * rows),
        col: Math.floor(Math.random() * cols),
        id: Math.random().toString(36).substr(2, 9),
      };
      setRipples((prev) => [...prev, newRipple]);
      // Remove after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1000);
    }, 300);
    return () => clearInterval(interval);
  }, [rows, cols]);

  return (
    <div className="absolute inset-0 grid" style={{
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      pointerEvents: "none",
    }}>
      {Array.from({ length: rows * cols }).map((_, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const ripple = ripples.find((r) => r.row === row && r.col === col);
        return (
          <div
            key={idx}
            className={`bg-green-500 rounded-full transition-transform duration-700 ease-out`}
            style={{
              width: cellSize * (ripple ? 1.5 : 0.8),
              height: cellSize * (ripple ? 1.5 : 0.8),
              opacity: ripple ? 0.3 : 0.1,
              transform: ripple ? "scale(1.5)" : "scale(1)",
              margin: "2px",
            }}
          />
        );
      })}
    </div>
  );
};
