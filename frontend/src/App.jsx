import {Routes, Route} from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import DealReportsList from './features/dealreports/DealReportsList'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditDealReport from './features/dealreports/EditDealReport'
import NewDealReportForm from './features/dealreports/NewDealReportForm'
import Prefetch from './features/auth/Prefetch' 
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle'
import './App.css'

function App() {
  useTitle('Autoline Showroom')

  return (
    // Routes looks through all child containers and displays first one that matches current path/URL.
    // Each route component defines a specific path and react component to load at that path
    <Routes> 
      <Route path = "/" element = {<Layout/>}> 
        {/* Everthing on our pages so far  goes within here, within parent layout (parent route above) */}
        {/* Below, public is the default route that shows for the parent / route */}
        <Route index element = {<Public/>} />
        <Route path = "login" element = {<Login/>} /> 
        {/* Above two paths are the only public routes/paths, below, dash is a protected route, ony available after login */}

        {/* Prefetch wrapping to handle pre-fetching of components and retained subscription */}
        <Route element = {<PersistLogin />}> 
        {/* Before prefretch cuz if no authorization, no need to prefetch.
        After PersistLogin cuz login data needed by the useAuth hook */}
        {/* Remember, Require Auth component takes allowedRoles as an argument to decide whether to render Outlet or 
        send user to login page  */}
          <Route element = {<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}> 
            <Route element = {<Prefetch />}>  
              <Route path = "dash" element = {<DashLayout />} > 

                <Route index element = {<Welcome />} />
                
                {/* Require Auth ensures that if a user jumps / teleports to a page using links, the data DOES NOT LOAD if the user is not authenticated / user is redirected */}
                <Route element = {<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />}>
                  <Route path = "users" >
                    <Route index element = {<UsersList />} />
                    <Route path = ":id" element = {<EditUser />} /> {/* Placeholder id parameter replaced with actual user's id at runtime to create path */}
                    <Route path = "new" element = {<NewUserForm />} />
                  </Route>
                </Route>

                <Route path = "deal-reports" > {/*This will be the path for "XYZ.com/dash/deal-reports" */}
                  <Route index element = {<DealReportsList />} />
                  <Route path = ':id' element = {<EditDealReport />} />
                  <Route path = 'new' element = {<NewDealReportForm />} />
                </Route>
              
              </Route> {/*End of "dash" route */}
            </Route> {/* End of Prefetch tag*/}
          </Route> {/* End of RequireAuth */}
        </Route> {/* End of Protected Routes (Closure of Persist*/}
        
      </Route>
    </Routes>
  )
}

export default App
