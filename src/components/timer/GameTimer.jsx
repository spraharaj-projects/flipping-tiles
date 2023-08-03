import React, { useEffect, useState } from 'react'
import './Timer.css'

const GameTimer = ({ timeLeft }) => {
  return (
    <div className="timer-container">
      <span className="timer">{timeLeft}</span>
    </div>
  )
}

export default GameTimer
