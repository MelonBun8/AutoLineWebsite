import ApiSearchBar from '../../components/ApiSearchBar'
import DeliveryLetter from './DeliveryLetter'
import useAuth from '../../hooks/useAuth'
import { useGetDeliveryLettersQuery, useGetFilteredDeliveryLettersQuery } from './deliveryLettersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import { useState } from 'react'

const DeliveryLettersList = () => {
  useTitle("Delivery Letters | Autoline")

  const { username, isManager, isAdmin } = useAuth()

  const [filterChoice, setFilterChoice] = useState('-')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)

  const choices = ['-', 'Serial No.', 'Reg No.', 'Chassis No.', 'Seller', 'Purchaser']

  // Map display choices to API field names
  const filterKeyMap = {
    'Serial No.': 'srNo',
    'Reg No.': 'carDetails.registrationNo',
    'Chassis No.': 'carDetails.chassisNo',
    'Seller': 'carDealership.seller.name',
    'Purchaser': 'carDealership.purchaser.name',
  }

  // Default query for all delivery letters
  const {
    data: allDeliveryLetters,
    isLoading: isLoadingAll,
    isSuccess: isSuccessAll,
    isError: isErrorAll,
    error: errorAll
  } = useGetDeliveryLettersQuery('deliveryLettersList', {
    pollingInterval: 120000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
    skip: isSearchActive // Skip this query when search is active
  })

  // Filtered query - only runs when search is active
  const {
    data: filteredDeliveryLetters,
    isLoading: isLoadingFiltered,
    isSuccess: isSuccessFiltered,
    isError: isErrorFiltered,
    error: errorFiltered
  } = useGetFilteredDeliveryLettersQuery(
    {
      field: filterKeyMap[filterChoice],
      value: searchTerm
    },
    {
      skip: !isSearchActive || filterChoice === '-' || searchTerm.trim() === ''
    }
  )

  // Handle search submission (when user presses Enter or clicks Search)
  const handleSearchSubmit = (searchData) => {
    const { searchTerm: term, filterChoice: choice } = searchData
    
    if (choice === '-' || term.trim() === '') {
      // Reset to show all delivery letters
      setIsSearchActive(false)
      setSearchTerm('')
      setFilterChoice('-')
    } else {
      // Activate search mode
      setSearchTerm(term)
      setFilterChoice(choice)
      setIsSearchActive(true)
    }
  }

  // Handle filter reset
  const handleFilterReset = () => {
    setIsSearchActive(false)
    setSearchTerm('')
    setFilterChoice('-')
  }

  // Determine which data to use and loading states
  const isLoading = isSearchActive ? isLoadingFiltered : isLoadingAll
  const isSuccess = isSearchActive ? isSuccessFiltered : isSuccessAll
  const isError = isSearchActive ? isErrorFiltered : isErrorAll
  const error = isSearchActive ? errorFiltered : errorAll
  const deliveryLetters = isSearchActive ? filteredDeliveryLetters : allDeliveryLetters

  if (isLoading) {
    return (
      <div className="loader-container">
        <PulseLoader color="#3b82f6" />
      </div>
    )
  }

  if (isError) {
    return <p className="errmsg">{error?.data?.message}</p>
  }

  let filteredIds = []

  if (isSuccess) {
    const { ids, entities } = deliveryLetters
    
    // Apply role-based filtering
    filteredIds = isManager || isAdmin
      ? [...ids]
      : ids.filter(id => entities[id].username === username)
  }

  return (
    <>
      <ApiSearchBar
        filterOptions={choices}
        filterChoice={filterChoice}
        setFilterChoice={setFilterChoice}
        onSearchSubmit={handleSearchSubmit}
        onFilterReset={handleFilterReset}
        isSearchActive={isSearchActive}
      />

      {filteredIds.length > 0 ? (
        <table className="table table__deal-reports">
          <thead className="table__thead">
            <tr>
              <th className="table__th">Serial Number</th>
              <th className="table__th">Created</th>
              <th className="table__th">Updated</th>
              <th className="table__th">Creator</th>
              <th className="table__th">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredIds.map(id => (
              <DeliveryLetter key={id} deliveryLetterId={id} />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-results">
          {isSearchActive ? 'NO DELIVERY LETTERS FOUND FOR YOUR SEARCH!' : 'NO DELIVERY LETTERS FOUND!'}
        </div>
      )}
    </>
  )
}

export default DeliveryLettersList