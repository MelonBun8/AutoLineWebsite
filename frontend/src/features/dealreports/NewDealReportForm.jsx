import { useState, useEffect } from "react"
import { useAddNewDealReportMutation } from "./dealReportsApiSlice"
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

const ALPHA_REGEX = /^[A-Za-z\s]+$/
const NUM_REGEX = /^[0-9]+$/
const ALPHANUM_REGEX = /^[A-Za-z0-9\s-]+$/


const NewDealReportForm = ({users}) => {
    const [newDealReport, {  // trigger function
      isLoading, 
      isSuccess, 
      isError, 
      error }
    ] = useAddNewDealReportMutation()

    const navigate = useNavigate()

    // creating state of the form
    const [formData, setFormData] = useState({
      user: '',
      purchasedFrom: '',
      make:  '',
      color:  '',
      chassisNumber: '',
      regionNumber: '',
      purchasePrice: '',
      voucherNumber: '',
      soldTo: '',
      salePrice: '',
      commissionAmount:  '',
      expenses: '',
    })

    let content = (
      <p> Some bullshit to be added after current user/ current state has been setup</p>
    )

    return content
}

export default NewDealReportForm