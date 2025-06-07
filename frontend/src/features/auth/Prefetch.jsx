import { store } from '../../app/store' // importing redux store
import { dealReportsApiSlice } from '../dealreports/dealReportsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// this is a prefetch component to ensure a lasting subscription of the deal reports and users' form pages. 


const Prefetch = () => {
  useEffect(() => { 

    console.log('subscribing') // this is to show us how react strict mode mounts, unmounts and re-mounts components for error checking
    // this mounting cycle is only in development mode in strict mode
    const deal_reports = store.dispatch(dealReportsApiSlice.endpoints.getDealReports.initiate())
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate()) 
    // above we are setting up manual subscriptions that will remain active
    // This is a manual dispatch of RTK Query's .initiate() method.
    // RTK Query usually sets up subscriptions automatically when you use hooks like useGetUsersQuery(), but here you're doing it manually in a shared parent component.
    // Doing this keeps the data "warm" (cached and synced) and prevents it from refetching unnecessarily when you navigate between child routes.

    return () => { // unsubscribe if we leave the protected pages. (Cleanup function of useEffect, only runs when component dismounts)
        console.log('unsubscribing')
        deal_reports.unsubscribe()
        users.unsubscribe()
    }

  }, []); // No dependencies means the useEffect will only run when the component mounts

  return <Outlet /> // since we know outlet is wrapped around all child components / pages, we'll wrap this prefetch component around all protected pages
  // help us when we want to retain state and pre-filled forms when we refresh or return from children
}

export default Prefetch