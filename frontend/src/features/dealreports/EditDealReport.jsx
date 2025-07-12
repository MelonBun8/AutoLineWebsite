import { useParams } from 'react-router-dom' // to get deal report ID from URL
import EditDealReportForm from './EditDealReportForm'
// Below imports added during refactor for extra security
import { useGetDealReportsQuery } from './dealReportsApiSlice'
import useAuth from   '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

// This component basically handles bringing in the data, passing it into the actual form, then rendering /returning the pre-populated form
// to edit the information 

const EditDealReport = () => {

    useTitle('Edit Deal | Autoline')
    const { id } = useParams()
    
    const { username, isManager, isAdmin } = useAuth() 

    // const dealReport = useSelector(state => selectDealReportById(state, id))
    // REPLACED BY BELOW DURING REFACTORING
    const { dealReport } = useGetDealReportsQuery("dealReportsList", {
      selectFromResult: ({ data }) => ({
        dealReport:data?.entities[id]
      })
    })
    // const users = useSelector(selectAllUsers) // commenting this cuz I'm not going to make the owner user editable... for now.

    if(!dealReport) return <PulseLoader color={'#FFF'} />

    if(!isManager && !isAdmin){
      if(dealReport.username !== username){
        return <p className = 'errmsg'>You do not have access to this deal report!</p>
      }
    }

    const content = dealReport  ? <EditDealReportForm dealReport = {dealReport} /> : <PulseLoader color={'#FFF'} />
    // && users check, and  <...  users = {users} /> removed from above line as argument to Edit Deal Report form

    return content
}

export default EditDealReport