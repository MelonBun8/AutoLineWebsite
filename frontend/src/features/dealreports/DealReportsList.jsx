// this is a "protected route" and cannot be accessed by any random visitor, only those that have logged in, hence the name
// usually protected routes are: Only accessible post-login, use the "user" global state in redux, use tokens in local storage, and checks like if(!user) navigate('/login') 


// import { useState } from 'react'
import { useGetDealReportsQuery } from './dealReportsApiSlice'
import DealReport from './DealReport'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const DealReportsList = () => {
  useTitle("Deal Reports | Autoline")
  // const [searchTerm, setSearchTerm] = useState('')

  const { username, isManager, isAdmin } = useAuth()

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

  // // Handle search input change
  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value)
  // }

  let content

  if (isLoading) content = <PulseLoader color={'#FFF'} />

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids, entities } = dealReports

    let filteredIds
    if(isManager || isAdmin){
      filteredIds = [...ids] // no change, filtered IDs are just IDs themselves
    } else { // otherwise, you can only view the notes YOU created
      filteredIds = ids.filter(dealReportId => entities[dealReportId].username === username)
    }

    const tableContent = ids?.length && filteredIds.map(dealReportId => <DealReport key={dealReportId} dealReportId={dealReportId} />)
  
    // remember the && short-circuit, returns the last truthy or the first falsy 

    // // Filter ids based on search term if provided
    // const filteredIds = searchTerm
    //   ? ids.filter(id => {
    //       const dealReport = entities[id]
    //       // Adjust these properties based on what fields you want to search in
    //       // This example assumes dealReport objects have username and serialNumber properties
    //       return (
    //         dealReport.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         dealReport.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         dealReport.title?.toLowerCase().includes(searchTerm.toLowerCase())
    //       )
    //     })
    //   : ids
    
    // console.log(`Filtered ID's are: ${filteredIds}`)
    
    // const tableContent = filteredIds?.length
    //   ? filteredIds.map(dealReportId => <DealReport key={dealReportId} dealReportId={dealReportId} />)
    //   : null 


    content = (
      <>
        {/* Search bar component
        <div className="search-container">
          <input
            type="text"
            placeholder="Search deal reports..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div> */}
        
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
  } // if isSuccess has it's own, different content returned, else below (for isLoading or isError)
  
  return content
}

export default DealReportsList