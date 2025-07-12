import SearchBar from '../../components/SearchBar'
import { useState } from 'react'
import { useGetDealReportsQuery } from './dealReportsApiSlice'
import DealReport from './DealReport'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const DealReportsList = () => {
  useTitle("Deal Reports | Autoline")

  const { username, isManager, isAdmin } = useAuth()
  
  const [filterChoice, setFilterChoice] = useState('-')
  const [searchTerm, setSearchTerm] = useState('')

  const choices = ['-','Buyer', 'Seller', 'Voucher', 'Make', 'Chassis', 'Color', 'Region']

  const { 
    data: dealReports,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDealReportsQuery('dealReportsList', {
    pollingInterval: 60000, 
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) content = <PulseLoader color={'#FFF'} />

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids, entities } = dealReports
    // dealReports is an object (orginally named data renamed during destructuring above returned by the useGetDealReportsQuery endpoint with an ids array and entities object. The entities object has keys of ids (same ids in ids array)
    // and values of objects with all properties within thus dealReports.entities[ids[0]].expenses has createdAt value
  
    let filteredIds
    if(isManager || isAdmin){
      filteredIds = [...ids] // no change, filtered IDs are just IDs themselves
    } else { // otherwise, you can only view the notes YOU created
      filteredIds = ids.filter(dealReportId => entities[dealReportId].username === username)
    }
    
    if (filterChoice !== '-' && searchTerm.trim() !== '') {
      const filterKeyMap = {
        'Buyer': 'soldTo',
        'Seller': 'purchasedFrom',
        'Voucher': 'voucherNumber',
        'Make': 'vehicleDetails.make',
        'Chassis': 'vehicleDetails.chassisNumber',
        'Color': 'vehicleDetails.color',
        'Region': 'vehicleDetails.regionNumber'
      }

      const fieldPath = filterKeyMap[filterChoice]
      if (fieldPath) {
        filteredIds = filteredIds.filter(id => {
          const fieldValue = fieldPath.split('.').reduce((acc, key) => acc?.[key], entities[id]) // extract the field value from this particular id's entities[id] object by testing 
          // reduce can traverse nested objects. For example, when trying to access vehicleDetails.make, acc starts with the entire entities[id] object, first key is fieldPath's first element, in this case vehicleDetails, so in first iteration it checks entities?.vehicleDetails, this returns the vehicle object which is then in turn the next acc object, and the second iteration starts with key as the second element of fieldPath (make), and acc the vehicleDetails object. This 'DRILLING' happens until acc?.[key] has nothing futher
          return fieldValue?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
      }
    }
    
    const tableContent = ids?.length && filteredIds.map(dealReportId => <DealReport key={dealReportId} dealReportId={dealReportId} />)

    content = (
      <>
        <SearchBar
          setSearchTerm={setSearchTerm}
          filterOptions = {choices}
          filterChoice = {filterChoice}
          setFilterChoice = {setFilterChoice}
        />

        <table className="table table__deal-reports">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th">Serial Number</th>
              <th scope="col" className="table__th deal-report__created">Created</th>
              <th scope="col" className="table__th deal-report__updated">Updated</th>
              <th scope="col" className="table__th deal-report__username">Creator</th>
              <th scope="col" className="table__th note__edit">Edit</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
          </tbody>
        </table>
        
      </>
    )
  } 
  
  return content
}

export default DealReportsList