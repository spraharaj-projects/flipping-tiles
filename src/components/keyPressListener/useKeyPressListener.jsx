import { useEffect, useState } from 'react'

const useKeyPressListener = (keyCode, callback) => {
  const [keySafe, setKeySafe] = useState(true)

  const handleKeyDown = event => {
    if (event.code === keyCode && keySafe) {
      setKeySafe(false)
      callback()
    }
  }

  const handleKeyUp = event => {
    if (event.code === keyCode) {
      setKeySafe(true)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [keyCode, keySafe, callback])

  return null
}

export default useKeyPressListener
