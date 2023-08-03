const mapData = {
  minX: 6,
  maxX: 52,
  minY: 8,
  maxY: 47,
}

const safeSpots = [{ x: 0, y: 0 }]

const namePrefix = [
  'COOL',
  'SUPER',
  'HIP',
  'SMUG',
  'COOL',
  'SILKY',
  'GOOD',
  'SAFE',
  'DEAR',
  'DAMP',
  'WARM',
  'RICH',
  'LONG',
  'DARK',
  'SOFT',
  'BUFF',
  'DOPE',
]

const animals = [
  'BEAR',
  'DOG',
  'CAT',
  'FOX',
  'LAMB',
  'LION',
  'BOAR',
  'GOAT',
  'VOLE',
  'SEAL',
  'PUMA',
  'MULE',
  'BULL',
  'BIRD',
  'BUG',
]

const playerColors = ['blue', 'red', 'orange', 'yellow', 'green', 'purple']

export const isSolid = (x, y) => {
  return (
    x <= mapData.maxX ||
    x > mapData.minX ||
    y <= mapData.maxY ||
    y > mapData.minY
  )
}

export const generateTiles = () => {
  const tiles = {}
  for (let x = 0; x < 14; x++) {
    for (let y = 0; y < 12; y++) {
      const key = getKeyString(x, y)
      const isFlipped = (x + y) % 2 == 0 ? false : true
      tiles[key] = {
        x,
        y,
        isFlipped,
      }
    }
  }

  return tiles
}

export const getRandomSafeSpot = () => {
  return randomFromArray(safeSpots)
}

export const randomFromArray = array => {
  return array[Math.floor(Math.random() * array.length)]
}

export const getKeyString = (x, y) => {
  return `${x}x${y}`
}

export const createName = () => {
  const prefix = randomFromArray(namePrefix)
  const animal = randomFromArray(animals)
  return `${prefix} ${animal}`
}

export const createRandomColor = () => {
  return randomFromArray(playerColors)
}

export const getPlayerColorIndex = color => {
  return playerColors.indexOf(color)
}

export const getNextColor = index => {
  return playerColors[index + 1] || playerColors[0]
}
