import React, { useEffect, useState } from 'react'
import './Timer.css'

const Timer = ({ gameStatus, onFinish, updateGame }) => {
  const [intervalTimeout, setIntervalTimeout] = useState(null)

  useEffect(() => {
    if (gameStatus) {
      const interval = setInterval(() => {
        updateGame(gameStatus - 1)
      }, 1000)

      setIntervalTimeout(interval)

      return () => clearTimeout(interval)
    } else {
      if (intervalTimeout) {
        clearTimeout(intervalTimeout)
        onFinish(0)
      }
    }
  }, [gameStatus])

  useEffect(() => {
    if (!gameStatus && intervalTimeout) {
      clearTimeout(intervalTimeout)
      onFinish()
    }
  }, [gameStatus])

  return (
    <div className="timer-contianer">
      <span className="timer">{gameStatus}</span>
    </div>
  )
}

export default Timer
