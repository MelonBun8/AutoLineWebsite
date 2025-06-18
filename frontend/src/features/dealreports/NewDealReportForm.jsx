import { useState, useEffect, useMemo } from "react"
import { useAddNewDealReportMutation } from "./dealReportsApiSlice"
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
// import PulseLoader from "react-spinners/PulseLoader"

const ALPHA_REGEX = /^[A-Za-z\s]+$/
const NUM_REGEX = /^[0-9]+$/
const ALPHANUM_REGEX = /^[A-Za-z0-9\s-]+$/

const NewDealReportForm = () => {
    useTitle('New Deal | Autoline')
    const { username } = useAuth()

    const navigate = useNavigate()

    const [addNewDealReport, {  // trigger function
      isLoading, 
      isSuccess, 
      isError, 
      error }
    ] = useAddNewDealReportMutation()

    const initialFormData = useMemo(() => {
        return {
            user: username,
            date: new Date(), // This will create a new Date object only when `username` changes
            purchasedFrom: '',
            make: '',
            color: '',
            chassisNumber: '',
            regionNumber: '0',
            purchasePrice: '',
            voucherNumber: '0',
            soldTo: '',
            salePrice: '',
            commissionAmount: '',
            expenses: '',
        };
    }, [username]);

    const [ formData, setFormData ] = useState(initialFormData)
    const [ errors, setErrors ] = useState( {} )
    const [ submitted, setSubmitted ] = useState(false)

    useEffect( () => { // if deal report successfully created
      if(isSuccess){ // if new deal report successfully created, empty form and navigate back to the deal reports page
        setFormData(initialFormData)
        setErrors({})
        setSubmitted(false)
        navigate('/dash/deal-reports')
      }      
    
    }, [isSuccess, initialFormData, navigate])

    useEffect(() => { // mutation function error handling
      if(isError && error) {
        setErrors(prev => ({...prev, general:'Failed to submit the deal report, please try again.'})) // useState setters can accept objects/values or functions. If we choose to pass in functions, they receive prevState or prev as arguments
      }
    }, [isError, error])

    const validateField = (name, value) => { // field validation
      let errorMessage = ""
      switch (name){
        case 'purchasedFrom':
        case 'soldTo':
        case 'make':
        case 'color':
          if (!value.trim()) {
              errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
          } else if (!ALPHA_REGEX.test(value)) {
              errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} can only contain letters and spaces.`;
          }
          break;
        case 'purchasePrice':
        case 'salePrice':
        case 'commissionAmount':
        case 'expenses':
          if (!value.trim()) {
              errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
          } else if (!NUM_REGEX.test(value)) {
              errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} must be a valid number.`;
          } else if (parseFloat(value) < 0) {
              errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} cannot be negative.`;
          }
                break;
        case 'chassisNumber':
        case 'regionNumber':
        case 'voucherNumber':
          if (!value.trim()) {
              errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
          } else if (!ALPHANUM_REGEX.test(value)) {
              errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} can only contain letters, numbers, and hyphens.`;
          }
          break;
        default:
          break;
      }
      return errorMessage
    }

    const handleChange = (e) =>{
      const { name, value } = e.target
      setFormData(prev => ({...prev, [name]: value})) // NOTE, name is in square brackets to extract the VALUE of name from the name variable, and use that string literal as the key

      if (submitted) { // Only show errors on change if form has already been submitted at least once
          const errorMessage = validateField(name, value);
          setErrors(prev => ({ ...prev, [name]: errorMessage }));
        }
    } 
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitted(true); 
      
      let newErrors = {};
      let isValid = true;
    
      for ( const field in formData ) { // validate each field one-by-one and add to errors list for all erroneous fields 
        const errorMessage = validateField(field, formData[field])
        if (errorMessage) {
          newErrors[field] = errorMessage
          isValid = false
        }
      }

      setErrors(newErrors)

      if (isValid) {
        try{
          const {make, chassisNumber, color, regionNumber, ...otherData} = formData
          const payload = {
            ...otherData,
            vehicleDetails:{
              make, chassisNumber, color, regionNumber
            },
          }
          await addNewDealReport(payload)
        } catch(error) {
          console.error('Failed to save the deal report: ', error)
          setErrors( prev => ({...prev, general: 'Failed to submit report, please try again.'}))
        }
      } else {
        console.log('Form has validation errors')
      }
    }

    const renderInput = (label, name, type = "text", note = "") => (
      <>
        <label className = "form__label" htmlFor = {name}>
          {label} {note && <span className = "nowrap">[{note}]</span>}
        </label>
        <input 
          className={`form__input ${errors[name] ? 'form__input--incomplete' : ''}`}
          id = {name}
          name = {name}
          type={type}
          value={formData[name]}
          onChange = {handleChange}
          autoComplete="off"
          />
          {errors[name] && <p className="form__error">{errors[name]}</p>}
      </>
    )

    const canSave = !isLoading && Object.values(errors).every(err => !err)
    const errClass = (isError) ? "errmsg" : "offscreen"
    const errContent = error?.data?.message || ""

    let content = (
      <>
      <p className={errClass}>{errContent}</p>
      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Create New Deal Report</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" onClick={handleSubmit} disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <div className="form__row">
          <div className="form__divider">
            {renderInput("Purchased From", "purchasedFrom", "text", "Alphabetical")}
            {renderInput("Purchase Price", "purchasePrice", "number", "Numeric")}
            {renderInput("Voucher Number", "voucherNumber", "text", "Alphanumeric")}
            {renderInput("Commission Amount", "commissionAmount", "number", "Numeric")}
          </div>

          <div className="form__divider">
            {renderInput("Sold To", "soldTo", "text", "Alphabetical")}
            {renderInput("Sale Price", "salePrice", "number", "Numeric")}
            {renderInput("Expenses", "expenses", "number", "Numeric")}
          </div>
        </div>

        <details style={{ marginTop: '1rem' }}>
          <summary><strong>Vehicle Details</strong></summary>
          <div className="form__row">
            <div className="form__divider">
              {renderInput("Make", "make", "text", "Alphabetical")}
              {renderInput("Color", "color", "text", "Alphabetical")}
            </div>
            <div className="form__divider">
              {renderInput("Chassis Number", "chassisNumber", "text", "Alphanumeric")}
              {renderInput("Region Number", "regionNumber", "text", "Alphanumeric")}
            </div>
          </div>
        </details>
      </form>
    </>
    )

    return content
}

export default NewDealReportForm