// import { useState } from 'react'
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
import NewDealReport from './features/dealreports/NewDealReport'
import Prefetch from './features/auth/Prefetch' 

import './App.css'

function App() {

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
        <Route element = {<Prefetch />}> 
          <Route path = "dash" element = {<DashLayout />} > 

            <Route index element = {<Welcome />} />
                      
            <Route path = "users" >
              <Route index element = {<UsersList />} />
              <Route path = ":id" element = {<EditUser />} /> {/* Placeholder id parameter replaced with actual user's id at runtime to create path */}
              <Route path = "new" element = {<NewUserForm />} />
            </Route>

            <Route path = "deal-reports" > {/*This will be the path for "XYZ.com/dash/deal-reports" */}
              <Route index element = {<DealReportsList />} />
              <Route path = ':id' element = {<EditDealReport />} />
              <Route path = 'new' element = {<NewDealReport />} />
            </Route>
          
          </Route> {/*End of "dash" route */}
        </Route>
        
      </Route>
    </Routes>
  )
}

export default App
