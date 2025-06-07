// This is the dashboard display ONCE USER HAS LOGGED IN
import {Outlet} from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

const DashLayout = () => {
  return (
    <>
        <DashHeader /> 
        <div className='dash-container'>
            <Outlet />
        </div>
        <DashFooter />

    </>
  )
}
// dash header is above dash layout and all its children 
export default DashLayout