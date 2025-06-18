import { useParams } from 'react-router-dom'
import EditUserForm from './EditUserForm'
import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditUser = () => { // we won't need to query MongoDB as we're gonna get the user id from the state (of user to be edited)
    
    useTitle('Edit User | Autoline')
    const { id } = useParams() // returns key:value pairs of all dynamic parameters in the URL (in this case, dash/users/:id [PATCH])
    // id is extracted from URL in above line

    // selectors, they are functions in Redux that are used to extract and transform data from the Redux store
    // But if we go deeper, we will find that the selector will recalculate every time when you call it, even though that value is still the same!
    // memoized selectors solve this problem by recalculating only when redux state  value changes

    const { user } = useGetUsersQuery("usersList", {
      selectFromResult: ({ data }) => ({
        user: data?.entities[id]
      }),
    })

    if (!user) return <PulseLoader color={'$FFF'} />

    const content = <EditUserForm user = {user} />

    return content
}

export default EditUser