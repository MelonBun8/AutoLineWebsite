import styles from './MultiStepFormNavigator.module.css'

const MultiStepFormNavigation = ({currStepNum, totalSteps, setCurrStepNum}) => {  // this is a functional component, and a re-render means a re-execution of this function and re-building of this component's DOM tree.

  // Functional components re-render on: state changes (useState), props changes, context changes (useContext), parent component re-renders AND any custom hooks trigger state updates. Although remember, re-renders are optimized to only change those DOM nodes that have changed/ different from the previous one.
  // REMEMBER: useEffect runs AFTER a dependent variable/state in its dependencies array changes. It runs AS AN EFFECT, hence the name.

  // React.memo does this, it is higher order component that tells a component to not-re-render if it's parent passes the EXACT same props as before that would lead to the EXACT same re-render. Essentially it caches results of calculations between re-renders. React.memo is for props, while useMemo is for  expensive value calculations, and memoizes a value, not whole component
  
  // currStepNum and setCurrStepNum is a state, totalSteps is just a const

  const handleNext = () => { // using prevStep or prevCount etc. in setters of useState ensures you always get the latest updated state variable's value (eg, if state modified twice in one handle function using just the setState(value), the two updates might be batched to one re-render, before the setState applies to the value, and only one such update would be applied, the other wouldn't use the updated one, just the same one thus two increments for example would only give +1 result)
    setCurrStepNum( prevStep => { 
      if(prevStep < totalSteps-1) return prevStep + 1 // === means no type coercion, while == means type coercion
      return prevStep
    })
  }
  
  const handlePrev = () => {
    setCurrStepNum( prevStep => {
      if(prevStep > 0) return prevStep - 1
      return prevStep
    })
  }

  return (
    <div className = {styles["form-nav__button--container"]}>
        <button 
          type = "button"  
          // cannot stress enough how important it is to mention the above button type, since default behaviour for form buttons is "submit" and only when you specify it as reset or button, does it not work as submit.
          className = {styles["form-nav__button"]} 
          onClick = {handlePrev}
          disabled = {currStepNum === 0}
        >
          Prev
        </button>
        <p>Page {currStepNum + 1}</p>
        <button 
          type = "button"
          className = {styles["form-nav__button"]} 
          onClick = {handleNext}
          disabled = {currStepNum === totalSteps - 1}
        >
          Next
        </button>
    </div>
  )
}

export default MultiStepFormNavigation