import ApiSearchBar from '../../components/ApiSearchBar'
import DeliveryLetter from './DeliveryLetter'
import useAuth from '../../hooks/useAuth'
import { useGetDeliveryLettersQuery } from './deliveryLettersApiSlice'
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

  const {
    data: deliveryLetters,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDeliveryLettersQuery(
    isSearchActive
      ? { filters: { field: filterKeyMap[filterChoice], value: searchTerm } }
      : undefined,
    {
      pollingInterval: 120000,
      refetchOnFocus: false,
      refetchOnMountOrArgChange: false
    }
  )
  // if(isSearchActive && deliveryLetters){
  //   console.log(`Number of FILTERED deliveryLetters fetched: ${Object.keys(deliveryLetters).length}`)
  // } else {
  //   console.log(`Number of BASE deliveryLetters fetched: ${Object.keys(deliveryLetters).length}`)
  // }
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
              <DeliveryLetter 
                deliveryLetterId={id}
                queryArg={
                  isSearchActive
                    ? { filters: { field: filterKeyMap[filterChoice], value: searchTerm } }
                    : undefined
                }   
              />
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