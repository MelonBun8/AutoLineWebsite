import { useState, useEffect } from 'react' 
import { useAddNewUserMutation } from './usersApiSlice' // to send request to create the new user in backend through RTK
import { useNavigate } from 'react-router-dom' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons' // the save button icon
import { ROLES } from '../../config/roles'

const USER_REGEX = /^[A-z]{3,20}$/ // ^ means beginning, [A-z] means any upper or lowercase letter from A to Z. length 3 to 20, $ is for end
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/ //for the password, alphanumeric characters, some special symbols, length 4 to 12

const NewUserForm = () => {

  const [addNewUser, { // we get an addNewUser 'trigger' function (mutation hook) to call within the component (not activated immediately) 
    // (Unlike the query in UsersList for example, which is only an object, not a tuple of trigger func and object, also it's called immediately in UsersList) 
    // Below statuses updated and returned AFTER we call addNewUser (Mutation hook return values)
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewUserMutation()

  const navigate = useNavigate() // navigate hook (react hooks are tools that allow using state and other features without writing class components)

  const [username, setUsername] = useState('') // initial useState value is passed as argument
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState(["Employee"])

  useEffect( () => { // for testing REGEX
      setValidUsername(USER_REGEX.test(username))
  }, [username]) // useEffect accepts a function, as well as a list of dependencies (in this case, username) where useEffect activates only if that dependency(ies) changes 

  useEffect( ()=> {
    setValidPassword(PWD_REGEX.test(password)) // setter functions of useState are 
  }, [password])

  useEffect( ()=> {
    if(isSuccess){ // if user successfully created, empty out the create-user form and return to users page
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value) // simple function that accepts single argument e
  const onPasswordChanged = e => setPassword(e.target.value) // e in this case refers to the HTML element that triggered this event (Input field where pass was typed)

  const onRolesChanged = e => { // event object e
    const values = Array.from( //array.from makes and returns a shallow copy array from it's argument
      e.target.selectedOptions, // the iterable to make the array from (An HTML collection)
      (option) => option.value // the map function to call on every element of the array
    ) // thus this returns an array of the values of the elements of selectedOptions
    setRoles(values)
  }

  const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading // checking if he newly-created user can be saved
  
  const onSaveUserClicked = async (e) => {
    e.preventDefault()
    if(canSave){ 
      await addNewUser( {username, password, roles} ) // remember await can only be used in async functions 
      // addNewUser is the mutation trigger function (mentioned above)
    }
  }

  const options = Object.values(ROLES).map( role => { // values is a static method, called directly on the 'Object' constructor rather than an actual instance of object
    // .values returns the values in key value pairs of object passed to it. .map we already know, runs a function on every argument in iterable
    return (
      <option
        key = {role}
        value = {role}
      > {role} </option>
    ) // an array of options JSX elements is created and saved to options (to use in drop down menu)
  })

  // OPTIONAL CSS CLASSES to be applied to form elements
  const errClass = isError ? "errmsg" : "offscreen"
  const validUserClass = !validUsername ? 'form__input--incomplete' : ''
  const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
  const validRolesClass = !roles.length ? 'form__input--incomplete' : ''

  //NOTES: In forms, must have labels for each input
  const content = (
    <>
      <p className = {errClass}> {error?.data?.message}</p> 
      {/* If error, display at top of form */}

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__title-row">
            <h2>New User</h2>
            <div className="form__action-buttons">
                <button
                    className="icon-button"
                    title="Save"
                    disabled={!canSave}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>
            </div>
        </div>


        <label className="form__label" htmlFor="username">
            Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
            className={`form__input ${validUserClass}`}
            id="username"
            name="username"
            type="text"
            autoComplete="off"
            value={username}
            onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
            Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
            className={`form__input ${validPwdClass}`}
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={onPasswordChanged}
        />

        <label className="form__label" htmlFor="roles">
            ASSIGNED ROLES:
        </label>
        {/* multiple = {true} llows selecting more than one value for roles */}
        <select
            id="roles"
            name="roles"
            className={`form__select ${validRolesClass}`}
            multiple={true} 
            size="3"
            value={roles}
            onChange={onRolesChanged}
        >
            {options}
        </select>

      </form>
    </>
  )

  return content

} 

export default NewUserForm