import { useParams } from 'react-router-dom' // to get note ID from URL
import { useSelector } from 'react-redux'
import { selectDealReportById } from './dealReportsApiSlice' // memoized selector in dealreportsApiSlice
// import { selectAllUsers } from '../users/usersApiSlice'
import EditDealReportForm from './EditDealReportForm'

// This component basically handles bringing in the data, passing it into the actual form, then rendering /returning the pre-populated form
// to edit the information 

const EditDealReport = () => {
  const { id } = useParams()
  
  const dealReport = useSelector(state => selectDealReportById(state, id))
  // const users = useSelector(selectAllUsers) // commenting this cuz I'm not going to make the owner user editable... for now.

  const content = dealReport  ? <EditDealReportForm dealReport = {dealReport} /> : <p>Loading...</p>
  // && users check, and  <...  users = {users} /> removed from above line as argument to Edit Deal Report form

  return content
}

export default EditDealReport