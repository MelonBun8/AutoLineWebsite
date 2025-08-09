// A single row of the deliveryLetter table

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetDeliveryLettersQuery } from './deliveryLettersApiSlice'

const DeliveryLetter = ({ deliveryLetterId, queryArg }) => {
    
    const navigate = useNavigate()
    console.log(`CURRENTLY HERE AT DELIVERY LETTER COMPONENT WITH THE ID: ${deliveryLetterId}`)
    
    const { deliveryLetter } = useGetDeliveryLettersQuery(queryArg, { // deliveryLettersList is a new query tag used by this and other components. It is a tag/key for THIS INSTANCE of deliveryLettersList !!! {type: 'DeliveryLetter', id: 'LIST'} is the abstract tag used by the invalidation system to trigger refetches when your mutations change data related to that list. !!!

        selectFromResult: ({ data }) => ({ // remember how your deliveryLettersAdapter sets up initialState with data object holding ids array and entities object within
            deliveryLetter: data?.entities[deliveryLetterId] // the optional chaining ?. is for if entities undefined (still loading)
        }),
    })

    // const { deliveryLetter } = useGetDeliveryLettersQuery(undefined, {
    //     selectFromResult: ({ data }) => ({
    //         deliveryLetter: data?.entities[deliveryLetterId]
    //     }),
    // })

    console.log(`Found a deliveryLetter! ${deliveryLetter}`)

    if(deliveryLetter){
        const created = new Date(deliveryLetter.createdAt).toLocaleString('en-US', {day:'numeric', month:'long'}) // why not toLocale Date string
        const updated = new Date(deliveryLetter.updatedAt).toLocaleString('en-US', {day:'numeric', month:'long'})
        const serialNum = deliveryLetter?.srNo

        const handleEdit = () => navigate(`/dash/delivery-letters/${deliveryLetterId}`)

        return (
            <tr className = "table__row">

                <td className="table__cell">{serialNum}</td>
                <td className="table__cell">{created}</td>
                <td className="table__cell">{updated}</td>                
                <td className="table__cell">{deliveryLetter.username}</td>

                <td className="table__cell">
                    <button
                        className = "icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon = {faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    
    } else {
        console.log("Delivery Letter not found!")
        return null
    }
        
}

export default DeliveryLetter

