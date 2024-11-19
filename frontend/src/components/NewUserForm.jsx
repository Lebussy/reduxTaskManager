const NewUserForm = ({handleSubmit}) => {
  return (
    <div>
      <h3>User Registration</h3>
      <form onSubmit={event => {
        event.preventDefault()
        const name = event.target.name.value
        const username = event.target.username.value
        const password = event.target.password.value

        handleSubmit({name, username, password})

      }}>
        <div>
          <legend>
            Name:
          </legend>
          <input required={true} type='text' name='name'/>
        </div>
        <div>
          <legend>
            Username:
          </legend>
          <input required={true} type='text' name='username'/>
        </div>
        <div>
          <legend>
            Password:
          </legend>
          <input required={true} type='password' name='password'/>
        </div>
        <br></br>
        <button type='submit'>Create User</button>
      </form>
    </div>
  )
}

export default NewUserForm