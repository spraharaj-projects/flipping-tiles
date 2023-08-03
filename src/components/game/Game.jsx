import { useEffect, useState } from 'react'
import {
  ref,
  onValue,
  onChildAdded,
  set,
  onDisconnect,
  update,
  off,
  remove,
} from '@firebase/database'
import { auth, database } from '../../utils/firebase'
import { onAuthStateChanged, signInAnonymously } from '@firebase/auth'
import {
  createName,
  createRandomColor,
  getKeyString,
  getNextColor,
  getPlayerColorIndex,
  getRandomSafeSpot,
  isSolid,
} from '../../utils/helpers'
// import { KeyPressListener } from '../../utils/helpers/KeyPressListener'
import GameBoard from '../gameBoard/GameBoard'
import PlayerInfo from '../playerInfo/PlayerInfo'
import Player from '../player/Player'
import useKeyPressListener from '../keyPressListener/useKeyPressListener'
import Tile from '../tile/Tile'
// import KeyPressListener from '../keyPressListener/useKeyPressListener'

const Game = () => {
  const [playerId, setPlayerId] = useState(null)
  const [playerRef, setPlayerRef] = useState(null)
  const [players, setPlayers] = useState({})
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [tiles, setTiles] = useState({})
  const [gameStatus, setGameStatus] = useState(false)

  useKeyPressListener('ArrowUp', () => handleArrowPress(0, -1))
  useKeyPressListener('ArrowDown', () => handleArrowPress(0, 1))
  useKeyPressListener('ArrowRight', () => handleArrowPress(1, 0))
  useKeyPressListener('ArrowLeft', () => handleArrowPress(-1, 0))

  const handleTileClicked = (x, y, isFlipped) => {
    if (players[playerId].allowed && gameStatus) {
      const key = getKeyString(x, y)
      const tileRef = ref(database, `tiles/${key}`)
      update(tileRef, {
        isFlipped: isFlipped ? false : true,
      })
    }
  }

  const handleArrowPress = (xChange = 0, yChange = 0) => {
    const newX = players[playerId].x + xChange
    const newY = players[playerId].y + yChange
    if (true) {
      const playerObj = players[playerId]
      playerObj.x = newX
      playerObj.y = newY
      if (xChange === 1) {
        playerObj.direction = 'right'
      }
      if (xChange === -1) {
        playerObj.direction = 'left'
      }
      setPlayers(prevPlayers => ({
        ...prevPlayers,
        [playerId]: playerObj,
      }))
      set(playerRef, players[playerId])
    }
  }

  const handleNameChange = newName => {
    const name = newName || createName()
    setPlayerName(name)
    update(playerRef, {
      name,
    })
  }

  const handleColorChange = () => {
    const skinIndex = getPlayerColorIndex(players[playerId].color)
    const nextColor = getNextColor(skinIndex)
    update(playerRef, {
      color: nextColor,
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
  }, [playerId])

  useEffect(() => {
    const tilesRef = ref(database, `tiles`)

    const onChildaddedCallback = snapshot => {
      const tilesObj = snapshot.val()
      const key = getKeyString(tilesObj.x, tilesObj.y)
      setTiles(prevTiles => ({
        ...prevTiles,
        [key]: tilesObj,
      }))
    }
    const onValueCallback = snapshot => {
      setTiles({ ...snapshot.val() })
    }

    onChildAdded(tilesRef, onChildaddedCallback)
    onValue(tilesRef, onValueCallback)

    return () => {
      off(tilesRef, 'child_added', onChildaddedCallback)
      off(tilesRef, 'value', onValueCallback)
    }
  }, [playerId])

  useEffect(() => {
    const gameRef = ref(database, `game`)
    const onChildaddedCallback = snapshot => {
      setGameStatus(snapshot.val())
    }
    const onValueCallback = snapshot => {
      setGameStatus(snapshot.val())
    }

    onChildAdded(gameRef, onChildaddedCallback)
    onValue(gameRef, onValueCallback)

    return () => {
      off(gameRef, 'child_added', onChildaddedCallback)
      off(gameRef, 'value', onValueCallback)
    }
  }, [playerId])

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user && user.isAnonymous) {
        setPlayerId(user.uid)
        const player = ref(database, `players/${user.uid}`)
        const name = createName()
        const color = createRandomColor()
        const { x, y } = getRandomSafeSpot()
        const playerObj = {
          id: user.uid,
          name,
          color,
          direction: 'right',
          x,
          y,
          allowed: false,
        }
        setPlayerRef(player)
        setPlayerName(name)
        set(player, playerObj)
        onDisconnect(player).remove()
      } else {
      }
    })

    signInAnonymously(auth)
      .then(() => setLoading(false))
      .catch(error => {
        setError(`${error.code}: ${error.message}`)
      })
  }, [])

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : playerRef ? (
        <>
          <GameBoard>
            {tiles &&
              Object.entries(tiles).map(([key, tile]) => (
                <Tile
                  key={key}
                  x={tile.x}
                  y={tile.y}
                  isFlipped={tile.isFlipped}
                  setIsFlipped={handleTileClicked}
                />
              ))}
          </GameBoard>
          <PlayerInfo
            name={playerName}
            setName={handleNameChange}
            changeColor={handleColorChange}
            er={Object.values(tiles).filter(tile => !tile.isFlipped).length}
            no={Object.values(tiles).filter(tile => tile.isFlipped).length}
            gameStatus={gameStatus}
          />
        </>
      ) : null}
      {error && <p>Error: {error}</p>}
    </>
  )
}

export default Game
