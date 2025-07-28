import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
const UsersList = () => {

  useTitle('Users | Autoline')
  const { 
    data: users, // This is data. Stuff below will help us conditionally render content
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery('usersList', { // query labels (visible in react and redux devtools)
    pollingInterval: 120000, // after how long to re-fetch data (in ms)
    refetchOnFocus: false, // if focus changes to another window, then back to browser window, refetch
    refetchOnMountOrArgChange: false // re-fetch data if re-mounting component
  })

  let content

  if (isLoading) content = <PulseLoader color={'#FFF'} /> // we can replace this part with some spinner component too.

  if (isError) {
    content = <p className = "errmsg" >{error?.data?.message}</p> // uses optional chaining here to safely check for child properties
  }

  if (isSuccess){

    const { ids } = users // destructuring ids from users data
    
    const tableContent = ids?.length && ids.map(userId => <User key = {userId} userId = {userId} />)
    // short-circuiting
  

    content = (
      <table className="table table--users">
        <thead className="table__thead">
            <tr>
                <th scope="col" className="table__th user__username">Username</th>
                <th scope="col" className="table__th user__roles">Roles</th>
                <th scope="col" className="table__th user__edit">Edit</th>
            </tr>
        </thead>
        <tbody>
            {tableContent}
        </tbody>
      </table> 
    )
  } // note, this table is being provided to a grid, which needs flat data. Tables are not usually flat, but some CSS trickery has been applied to make it work for now, just a heads up for later projects etc.

  return content
}

export default UsersList