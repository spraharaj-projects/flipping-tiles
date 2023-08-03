import { useEffect, useState } from 'react'
import { database } from '../../utils/firebase'
import { off, onChildAdded, onValue, ref, set, update } from 'firebase/database'
import './Admin.css'
import { generateTiles } from '../../utils/helpers'
import Timer from '../timer/Timer'

const Admin = () => {
  const [gameStatus, setGameStatus] = useState(false)
  const [gameRef, setGameRef] = useState(null)
  const [players, setPlayers] = useState({})

  const handleStartGame = () => {
    try {
      const tilesRef = ref(database, `tiles`)
      const tilesObj = generateTiles()
      set(tilesRef, tilesObj)
      set(gameRef, 10)
    } catch (error) {
      console.log(error)
    }
  }

  const updateGame = timeLeft => {
    set(gameRef, timeLeft)
  }

  const handleStopGame = () => {
    set(gameRef, 0)
  }

  const handleOnChangePosition = (id, isAllowed) => {
    const playerRef = ref(database, `players/${id}`)
    update(playerRef, {
      allowed: isAllowed,
    })
  }

  useEffect(() => {
    const game = ref(database, `game`)
    setGameRef(game)
    const onChildaddedCallback = snapshot => {
      setGameStatus(snapshot.val())
    }
    const onValueCallback = snapshot => {
      setGameStatus(snapshot.val())
    }

    onChildAdded(game, onChildaddedCallback)
    onValue(game, onValueCallback)

    return () => {
      off(game, 'child_added', onChildaddedCallback)
      off(game, 'value', onValueCallback)
    }
  }, [])

  useEffect(() => {
    const allPlayersRef = ref(database, `players`)
    const onChildaddedCallback = snapshot => {
      const addedPlayer = snapshot.val()
      setPlayers(prevPlayers => ({
        ...prevPlayers,
        [addedPlayer.id]: addedPlayer,
      }))
    }
    const onValueCallback = snapshot => {
      setPlayers({ ...snapshot.val() })
    }

    onChildAdded(allPlayersRef, onChildaddedCallback)
    onValue(allPlayersRef, onValueCallback)

    return () => {
      off(allPlayersRef, 'child_added', onChildaddedCallback)
      off(allPlayersRef, 'value', onValueCallback)
    }
  }, [])

  return (
    // <div>
    //
    // </div>
    <main>
      <Timer
        gameStatus={gameStatus}
        onFinish={handleStopGame}
        updateGame={updateGame}
      />
      <div id="leaderboard">
        <table>
          <tbody>
            {Object.keys(players).map((id, index) => (
              <tr key={id}>
                <td className="number">{index + 1}</td>
                <td className="name">{players[id].name.toUpperCase()}</td>
                <td className="name">
                  <select
                    value={players[id].isAllowed}
                    onChange={e => handleOnChangePosition(id, e.target.value)}
                  >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="buttons">
          <button className="continue" onClick={handleStartGame}>
            Reset
          </button>
        </div>
      </div>
    </main>
  )
}

export default Admin
