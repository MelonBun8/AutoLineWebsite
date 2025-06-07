// import { useGetDealReportsQuery } from './dealReportsApiSlice'
// import  DealReport  from './DealReport'
// const DealReportsList = () => {

//   const { 
//     data: dealReports, // This is data. Stuff below will help us conditionally render content
//     isLoading,
//     isSuccess,
//     isError,
//     error
//   } = useGetDealReportsQuery(undefined, {
//     pollingInterval: 60000, // after how long to re-fetch data (in ms)
//     refetchOnFocus: true, // if focus changes to another window, then back to browser window, refetch
//     refetchOnMountOrArgChange: true // re-fetch data if re-mounting component
//   })

//   let content

//   if (isLoading) content = <p>Loading...</p> // we can replace this part with some spinner component too.

//   if (isError) {
//     content = <p className = "errmsg" >{error?.data?.message}</p> // uses optional chaining here to safely check for child properties
//   }

  

//   if (isSuccess){
//     const { ids } = dealReports // destructuring ids from users data
//     console.log(`ID's are: ${ids}`)
//     const tableContent = ids?.length
//     ? ids.map(dealReportId => <DealReport key = {dealReportId} dealReportId = {dealReportId} />)
//     : null

//     content = (
      
//       <table className="table table__deal-reports">
//         <thead className="table__thead">
//             <tr>
//                 {/* since deal reports don't have statuses like notes do,we omit it */}
//                 {/* <th scope="col" className="table__th deal-report__status">Serial Num</th> */} 
//                 <th scope="col" className="table__th">Serial Number</th>
//                 <th scope="col" className="table__th deal-report__created">Created</th>
//                 <th scope="col" className="table__th deal-report__updated">Updated</th>
//                 {/* <th scope="col" className="table__th deal-report__title">Title</th> */}
//                 {/* Later add functionality to dynamically fetch the user that created this deal report */}
//                 <th scope="col" className="table__th deal-report__username">Creator</th>
//                 <th scope="col" className="table__th note__edit">Edit</th>
//                 {/*Above are just headings for our table with formatting in CSS*/}

//             </tr>
//         </thead>
//         <tbody>
//             {tableContent}
//         </tbody>
//       </table> 
//     )
//   } // note, this table is being provided to a grid, which needs flat data. Tables are not usually flat, but some CSS trickery has been applied to make it work for now, just a heads up for later projects etc.

  
//   return content
// }

// export default DealReportsList
import { useState } from 'react'
import { useGetDealReportsQuery } from './dealReportsApiSlice'
import DealReport from './DealReport'

const DealReportsList = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const { 
    data: dealReports,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDealReportsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids, entities } = dealReports
    
    // Filter ids based on search term if provided
    const filteredIds = searchTerm
      ? ids.filter(id => {
          const dealReport = entities[id]
          // Adjust these properties based on what fields you want to search in
          // This example assumes dealReport objects have username and serialNumber properties
          return (
            dealReport.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dealReport.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dealReport.title?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        })
      : ids
    
    console.log(`Filtered ID's are: ${filteredIds}`)
    
    const tableContent = filteredIds?.length
      ? filteredIds.map(dealReportId => <DealReport key={dealReportId} dealReportId={dealReportId} />)
      : null

    content = (
      <>
        {/* Search bar component */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search deal reports..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
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
        
        {filteredIds?.length === 0 && searchTerm && (
          <p className="no-results">No matching deal reports found.</p>
        )}
      </>
    )
  }
  
  return content
}

export default DealReportsList