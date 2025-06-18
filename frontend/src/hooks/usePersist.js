// to persist the login after page refresh by using localStorage which is a part of the Window interface in web dev (built-in functions, objects, etc.)
// usually a whole localStorage component is made, but since we're using it in only one place in the app, we just make a single-use hook file
 
import { useState, useEffect } from "react"

const usePersist = () => {

    // initialize persist object (fetch from local storage if exists)
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false) // you can see localStorage.getItem returns a JSON object

    useEffect(() => { // update persist item if it changes
        localStorage.setItem("persist", JSON.stringify(persist)) // literally just turn an object/list/ etc. into a string
    }, [persist])

    return [persist, setPersist]
}

export default usePersist