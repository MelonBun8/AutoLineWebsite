import { useParams } from 'react-router-dom' 
import EditDeliveryLetterForm from './EditDeliveryLetterForm'
import { useGetDeliveryLetterQuery } from './deliveryLettersApiSlice'
import useAuth from   '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditDeliveryLetter = () => {

    useTitle('Edit Letter | Autoline')
    const { id } = useParams()
    
    const { username, isManager, isAdmin } = useAuth() 

    const {
      data: deliveryLetter,
      isLoading,
      isSuccess,
      isError,
      error
    } = useGetDeliveryLetterQuery(id)
    
    if(!deliveryLetter || isLoading) return <PulseLoader color={'#fff'} />
    
    if (isError) {
        return <p className='errmsg'>{error?.data?.message || 'Failed to load delivery letter'}</p>
    }

    if(isSuccess){
      if(!isManager && !isAdmin){
        if(deliveryLetter.username !== username){
          return <p className = 'errmsg'>You do not have access to this delivery letter!</p> // can only edit own created delivery letter
        }
      }
    }

    const content = deliveryLetter  ? <EditDeliveryLetterForm deliveryLetter = {deliveryLetter} /> : <PulseLoader color={'#FFF'} />

    return content
}

export default EditDeliveryLetter