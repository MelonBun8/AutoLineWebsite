import {Outlet} from 'react-router-dom'

import React from 'react'

const layout = () => {
  return <Outlet />
//   Layout will be our parent component, and outlet renders children of outlet component
// this layout component is useful to later add footer and other additions that we want reflected EVERYWHERE on the website, we can do it here
}

export default layout