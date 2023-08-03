import ReactCardFlip from 'react-card-flip'
import './Tile.css'

const Tile = ({ x, y, isFlipped, setIsFlipped }) => {
  return (
    <div
      className={`Tile small-grid-cell`}
      style={{ transform: `translate3d(${17.1 * x}px, ${17.1 * y}px, 0)` }}
      onClick={() => setIsFlipped(x, y, isFlipped)}
    >
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div className="Tile_sprite small-grid-cell">🌞</div>
        <div className="Tile_sprite small-grid-cell">🦉</div>
      </ReactCardFlip>
    </div>
  )
}

export default Tile
