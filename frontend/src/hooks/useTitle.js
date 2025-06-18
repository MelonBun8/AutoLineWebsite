import {useEffect} from 'react'

const useTitle = (title) => {
  
    useEffect(() => {
        const prevTitle = document.title // receive the current/old title of the previous page (Still old title at new page 
        // at this point) from the DOM
        document.title = title // change the DOM's title property to new title received as a prop

        return () => document.title = prevTitle // set title back to previous title when component unmounts / finishes
    }, [title])

}

export default useTitle