import { useState } from 'react'

const ApiSearchBar = ({ 
  filterOptions, 
  filterChoice, 
  setFilterChoice,
  onSearchSubmit,
  onFilterReset,
  isSearchActive
}) => {

  const [localInput, setLocalInput] = useState('')
  
  const handleInputChange = (e) => setLocalInput(e.target.value)
  
  const handleFilterChoiceChange = (e) => {
    const newChoice = e.target.value
    setFilterChoice(newChoice)
    
    // If user selects '-', reset the search
    if (newChoice === '-' && onFilterReset) {
      onFilterReset()
      setLocalInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (onSearchSubmit) {
      onSearchSubmit({
        searchTerm: localInput,
        filterChoice: filterChoice
      })
    }
  }

  const handleResetClick = () => {
    if (onFilterReset) {
      onFilterReset()
      setLocalInput('')
    }
  }

  const choices = filterOptions.map(choice => {
    return <option key={choice} value={choice}>{choice}</option>
  })

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <label htmlFor="searchTerm"/>
        <input
          id="searchTerm"
          type="text"
          placeholder="Type and press Enter to search..."
          value={localInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        
        <label htmlFor='searchFilter'/>
        <select
          id='searchFilter'
          name='searchFilter'
          value={filterChoice}
          onChange={handleFilterChoiceChange}
        >
          {choices}
        </select>

        {/* Search button */}
        <button 
          type="button" 
          onClick={handleSearch}
          className="search-submit-btn"
          disabled={filterChoice === '-' || localInput.trim() === ''}
          title="Search"
        >
          Search
        </button>

        {/* Reset button - only show when search is active */}
        {isSearchActive && (
          <button 
            type="button" 
            onClick={handleResetClick}
            className="search-reset-btn"
            title="Reset search"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Search instructions */}
      <div className="search-instructions">
        <small>
          {filterChoice === '-' 
            ? "Select a filter and type your search term, then press Enter or click Search" 
            : isSearchActive 
              ? `Searching by ${filterChoice}. Click Clear to see all delivery letters.`
              : "Type your search term and press Enter or click Search"
          }
        </small>
      </div>
    </div>
  )
}

export default ApiSearchBar