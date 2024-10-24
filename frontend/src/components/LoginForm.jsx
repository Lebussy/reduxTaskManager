import { useDispatch } from "react-redux"
import {login} from '../reducers/userReducer'
import TaskUserRegistration from "./TaskUserRegistration"
import { useState } from 'react'

const LoginForm = () => {
  const dispatch = useDispatch()

  const [hasAccount, setHasAccount] = useState(true)

  const handleLogin = event => {
    console.log('#############handlelogin called####################')
    console.log()
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    dispatch(login({username, password}))
  }

  const renderLoginForm = () => {
    return (
      <form onSubmit={handleLogin}>
      <div>
        <input type='text' name='username' autoComplete="username"></input>
      </div>
      <div>
        <input type='password' name='password' autoComplete="current-password"></input>
      </div>
      <button type="submit">Login</button>
      <button onClick={() => setHasAccount(false)}>Create Account</button>
    </form>
    )
  }

  const renderUserRegistrationForm = () => {
    return (
      <TaskUserRegistration goLogin={() => setHasAccount(true)}/>
    )
  }

  return (
    <div>
      {hasAccount && renderLoginForm()}
      {!hasAccount && renderUserRegistrationForm()}
    </div>
  )
}

export default LoginForm