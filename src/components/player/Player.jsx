import React from "react";
import "./Player.css";

const Player = ({ className, name, coins, color, direction, x, y }) => {
  return (
    <div
      className={className}
      data-color={color}
      data-direction={direction}
      style={{ transform: `translate3d(${16 * x}px, ${16 * y - 4}px, 0)` }}
    >
      <div className="Character_shadow grid-cell"></div>
      <div className="Character_sprite grid-cell"></div>
      <div className="Character_name-container">
        <span className="Character_name">{name}</span>
        <span className="Character_coins">{coins}</span>
      </div>
      <div className="Character_you-arrow"></div>
    </div>
  );
};

export default Player;
