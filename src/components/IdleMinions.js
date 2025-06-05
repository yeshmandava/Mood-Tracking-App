import React from 'react';
import './IdleMinions.css';

const IdleMinions = () => {
  const minions = Array.from({ length: 5 });
  return (
    <div className="idle-minions">
      {minions.map((_, index) => (
        <div
          key={index}
          className="idle-minion"
          style={{ animationDelay: `${index * 1.2}s`, left: `${10 + index * 15}%` }}
        >
          😃
        </div>
      ))}
    </div>
  );
};

export default IdleMinions;
