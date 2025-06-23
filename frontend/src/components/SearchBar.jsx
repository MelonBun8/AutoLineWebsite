// search bar component. Will recieve data, filter based on the entered query along with the filterChoice
import { useState, useEffect } from 'react'
 
const SearchBar = ({ setSearchTerm, filterOptions, filterChoice, setFilterChoice }) => {

  const handleInputChange = (e) => setLocalInput(e.target.value) // note I'm setting this to localInput to allow
  const handleFilterChoiceChange = (e) => setFilterChoice(e.target.value)
  const [localInput, setLocalInput] = useState('')
  
  // Adding debouncing (delay after user types) [everytime localInput changes, a timeout runs, only after which setSearchTerm is applied]:
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(localInput)
    }, 800)
    
    return () => clearTimeout(timeout)
  }, [localInput, setSearchTerm])

  const choices = filterOptions.map(choice => {
      return <option key = {choice} value = {choice} >{choice}</option>
    })

  return (
    <div className = "search-bar-container">
      <div className = "search-bar">
          <label htmlFor="searchTerm"/>
          <input
            id="searchTerm"
            type="text"
            placeholder="Type Here..."
            value={localInput}
            onChange={handleInputChange}
          />
          
          <label htmlFor='searchFilter'/>
          <select
            id = 'searchFilter'
            name='searchFilter'
            value={filterChoice}
            // Note that we don't directly use setFilterChoice cuz it can lead to an infinite render loop as onChange is called on initial component render too, leading to infinite render=loops
            onChange={handleFilterChoiceChange}
          >
            {choices}
          </select>
      </div>
    </div>
  )
}

export default SearchBar
