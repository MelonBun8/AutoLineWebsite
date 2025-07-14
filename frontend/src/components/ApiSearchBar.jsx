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

  const choices = filterOptions.map(choice => (
    <option key={choice} value={choice}>{choice}</option>
  ))

  return (
    <div className="api-search-bar-container">
      <div className="api-search-bar">
        <input
          type="text"
          placeholder="Type and press Enter to search..."
          value={localInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />

        <select
          value={filterChoice}
          onChange={handleFilterChoiceChange}
        >
          {choices}
        </select>

        <button 
          type="button" 
          onClick={handleSearch}
          disabled={filterChoice === '-' || localInput.trim() === ''}
          title="Search"
        >
          Search
        </button>

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
