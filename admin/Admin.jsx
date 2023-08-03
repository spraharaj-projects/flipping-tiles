import { useEffect, useState } from 'react'
import { checkPoints } from '../../utils/helpers'
import { database } from '../../utils/firebase'
import { off, onChildAdded, onValue, ref, set, update } from 'firebase/database'
import './Admin.css'

const Admin = () => {
  const [gameStatus, setGameStatus] = useState(false)
  const [players, setPlayers] = useState({})

  const handleStartGame = () => {
    try {
      const stoneRef = ref(database, `stone`)
      const checkpointsRef = ref(database, `checkpoints`)
      set(stoneRef, {
        x: 6,
        y: 20,
      })
      set(checkpointsRef, checkPoints)
      setGameStatus(!gameStatus)
    } catch (error) {
      console.log(error)
    }
  }

  const handleOnChangePosition = (id, position) => {
    const playerRef = ref(database, `players/${id}`)
    update(playerRef, {
      position,
    })
  }

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
      <div id="leaderboard">
        <table>
          <tbody>
            {Object.keys(players).map((id, index) => (
              <tr key={id}>
                <td className="number">{index + 1}</td>
                <td className="name">{players[id].name.toUpperCase()}</td>
                <td className="name">
                  <select
                    value={players[id].position}
                    onChange={e => handleOnChangePosition(id, e.target.value)}
                  >
                    <option value="none">Out</option>
                    <option value="tr">Top Right</option>
                    <option value="tl">Top Left</option>
                    <option value="br">Bottom Right</option>
                    <option value="bl">Bottom Left</option>
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
