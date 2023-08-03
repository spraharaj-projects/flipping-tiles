import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import './LoginForm.css'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../utils/firebase'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gameCode, setGameCode] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('admin')
    } catch (error) {
      alert('Invalid credentials. Please try again.')
      console.error(error)
    }
  }

  const handleStartGame = () => {
    if (gameCode.toUpperCase() === import.meta.env.VITE_GAME_CODE) {
      navigate('game')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="form">
          <input
            className="userinput"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="userinput"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            className="userinput"
            type="text"
            placeholder="Game Code"
            value={gameCode}
            onChange={e => setGameCode(e.target.value)}
          />
          <div className="buttons">
            <button className="register-button" onClick={handleLogin}>
              Admin
            </button>
            <button className="login-button" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
