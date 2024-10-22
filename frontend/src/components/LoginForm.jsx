import { useDispatch } from "react-redux"
import {login} from '../reducers/userReducer'

const LoginForm = () => {
  const dispatch = useDispatch()

  const handleLogin = event => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    dispatch(login({username, password}))
  }
  return (
    <form onSubmit={handleLogin}>
      <div>
        <input type='text' name='username'></input>
      </div>
      <div>
        <input type='password' name='password'></input>
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm