import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useGetDealReportsQuery } from './dealReportsApiSlice'
// import { memo } from 'react'

const DealReport = ({ dealReportId }) => {
    
    const { dealReport } = useGetDealReportsQuery("dealReportsList", {
        selectFromResult: ({ data }) => ({
            dealReport: data?.entities[dealReportId]
        }),
    })

    const navigate = useNavigate()
    
    if(dealReport){
        const created = new Date(dealReport.createdAt).toLocaleString('en-US', {day: 'numeric', month: 'long'})
        const updated = new Date(dealReport.updatedAt).toLocaleString('en-US', {day: 'numeric', month: 'long'})
        const serialNum =  dealReport?.serial_no

        const handleEdit = () => navigate(`/dash/deal-reports/${dealReportId}`) // needed for 'edit' button functionality

        return ( // returns a single table row for a single deal report
            <tr className="table__row">
                {/* <td className="table__cell note__status">
                    {dealReport.completed
                        ? <span className="note__status--completed">Completed</span>
                        : <span className="note__status--open">Open</span>
                    }
                </td> */}
                <td className="table__cell">{serialNum}</td>
                <td className="table__cell">{created}</td>
                <td className="table__cell">{updated}</td>                
                <td className="table__cell">{dealReport.username}</td>

                <td className="table__cell">
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    }
    else {
        console.log('Deal report not found!')
        return null
    }

}

// const memoizedDealReport = memo(DealReport) // Now the component on ly re-renders if there's changes in the data

// export default memoizedDealReport

export default DealReport