// LOGIN PAGE

import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

import usePersist from '../../hooks/usePersist'

import { toast } from 'react-toastify'

const Login = () => {

  useTitle('Login | Autoline')

  const userRef = useRef() // useRef is to either hold mutable values that persist across re-renders without re-rendering themselves OR to refer to specific DOM element rendered by a component
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation() // remember these hooks can provide other data like isError, isSuccess, etc., but we are not using them here

  useEffect(() => {
    userRef.current.focus() // remember, empty dependency array means it only runs when component first mounts
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [username, password]) // clears out the error message state upon a changing username or password

  const handleSubmit = async (e) => {
    e.preventDefault() // prevent default browser behaviour of refreshing the page upon form submission
    try { 
        const { accessToken } = await login({ username, password }).unwrap() // call the login mutation function and get back access token
        // unwrap is from RTK query for when await actions/ mutation/ query functions are called. While they usually return isSuccess, isError, etc. type of object we have to parse ourselves, unwrap takes care of that for us, returning the returned successful data if successful, and throw an error statement if failed (will be caught bu catch block).
        // Thus if above statement returns an error it will immediately move to the catch block
        dispatch(setCredentials({ accessToken }))
        setUsername('')
        setPassword('')
        toast.success(`Welcome ${username}!`)
        navigate('/dash')
    } catch (err) {
        if (!err.status) {
            setErrMsg('No Server Response');
        } else if (err.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg(err.data?.message); // optional chaining
        }
        errRef.current.focus();
    }
  } 

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)

  const errClass = errMsg ? 'errmsg' : 'offscreen'

  if (isLoading) return <PulseLoader color={'#FFF'} />


  const content = ( // remember the classnames below align with the CSS. Also notice that this is a public page, so we need a separately defined header and footer for this page 
    <section className = "public">
        <header>
          <h1>Employee Login</h1> 
        </header>
        
        
        <main className="login">
                {/* The aria-live = assertive means when it gets focused on, it will read out the error message */}
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <form className="form login__form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                        // Remember, value is for updating display on re-render to display current state, while onChange is for actually changing the value in state 
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePwdInput}
                        value={password}
                        required
                    />
                    {/*  If you only provide one button on a form, it is the submit button by default. Notice we have an entry for 'value', because that allows controlled inputs, allowing us to know exactly what user is typing at anytime and apply real time conditional logic like a red border for invalid password */}
                    <button className="form__submit-button">Sign In</button> 

                    <label htmlFor="persist" className="form__persist">
                        <input
                            type = "checkbox"
                            className = "form__checkbox"
                            id="persist"
                            onChange = {handleToggle}
                            checked = {persist}  
                        />
                        Trust This Device (Stay Logged In)
                      </label>
                </form>
            </main>
        
        
        <footer>
          <Link to='/'>Back To Home</Link>
        </footer>
    </section>
  )

  return content

}

export default Login