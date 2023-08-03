import { useState } from 'react'
import './PlayerInfo.css'
import GameTimer from '../timer/GameTimer'

const PlayerInfo = ({ name, setName, changeColor, er, no, gameStatus }) => {
  console.log(gameStatus)
  const [playerName, setPlayerName] = useState(name)
  return (
    <div className="player-info">
      <div>
        <label htmlFor="player-name">Your Name</label>
        <input
          id="player-name"
          maxLength={10}
          type="text"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          onBlur={e => setName(playerName)}
        />
      </div>
      <div>
        <button id="player-color" onClick={changeColor}>
          Change Color
        </button>
      </div>
      <div className="score">Early Risers: {er}</div>
      <div className="score">Night Owls: {no}</div>
      <GameTimer timeLeft={gameStatus} />
    </div>
  )
}

export default PlayerInfo
