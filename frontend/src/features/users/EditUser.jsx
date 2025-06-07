import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'
import EditUserForm from './EditUserForm'

const EditUser = () => { // we won't need to query MongoDB as we're gonna get the user id from the state (of user to be edited)
  const { id } = useParams() // returns key:value pairs of all dynamic parameters in the URL (in this case, dash/users/:id [PATCH])
  // id is extracted from URL in above line

  // selectors, they are functions in Redux that are used to extract and transform data from the Redux store
  // But if we go deeper, we will find that the selector will recalculate every time when you call it, even though that value is still the same!
  // memoized selectors solve this problem by recalculating only when redux state  value changes

  const user = useSelector(state => selectUserById(state, id)) // selectUserById is a memoized selector created in usersApiSlice

  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

  return content
}

export default EditUser