import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewDealReportForm from './NewDealReportForm'

// Note, we create a New Deal Report file, not a NewUser file because we need to bring in some extra existing info into the new deal-report form
const NewDealReport = () => {
  const users = useSelector(selectAllUsers)

  if(!users.length) return <p>Not Currently Available</p>
  const content = users ? <NewDealReportForm users = {users} /> : <p>Loading...</p>

  return content
}

export default NewDealReport