import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAddNewDeliveryLetterMutation } from './deliveryLettersApiSlice'
import MultiStepFormNavigator from '../../components/MultiStepFormNavigator/MultiStepFormNavigator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import CarDetailsForm from "./FormSteps/CarDetailsForm"
import DelivereeDetailsForm from "./formSteps/DelivereeDetailsForm"
import DealershipDetailsForm from "./formSteps/DealershipDetailsForm"

const NewDeliveryLetterForm = () => {
  const [currFormPage, setCurrFormPage] = useState(0)
  const { username } = useAuth()
  const navigate = useNavigate()

  const methods = useForm({
    defaultValues: {
      membershipNo: "",
      carDetails: {
        registrationNo:"",
        registrationDate:null,
        chassisNo: "",
        engineNo:  "",
        make: "",
        model: "",
        color:  "",
        hp: "",
        registrationBookNumber: "",
        salesCertificateNo:  "",
        salesCertificateDate: null,
        invoiceNo:  "",
        invoiceDate: null,
        cplcVerificationNo: "",
        cplcDate: null,
      },
      delivereeDetails: {
        registeredName: "",
        address:  "",
        cnic: "",
        receiverName: "",
        documentDetails: "",
      },
      carDealership: {
        forDealer: {
          ownerName:  "",
          salesmanName:  "",
          salesmanCardNo: "",
        },
        seller: {
          name:  "",
          address:"",
          tel:  "",
          nic:  "",
          remarks: "",
        },
        purchaser: {
          name: "",
          address:"",
          tel:"",
          nic: "",
        }
      }
    },
    mode: "onChange", // when validation is triggered for fields (Can also be onBlur, onSubmit, onTouched)
  })

  const [addNewDeliveryLetter, { isLoading }] = useAddNewDeliveryLetterMutation()

  // Watch form state to determine if form is valid
  const { formState: { errors, _isValid }, watch } = methods // deconstruct errors and watch function from methods of RHF 
  const watchedValues = watch()

  // Check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = [
      'carDetails.registrationNo',
      'carDetails.registrationDate',
      'delivereeDetails.registeredName',
      'delivereeDetails.cnic',
      'delivereeDetails.receiverName'
    ]
    
    // the below code simply extracts the registraionNo, cnic, etc from above list, checks it's value in watchedValues, if any are null, returns false
    return requiredFields.every(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], watchedValues)
      return value && value.trim() !== ''
    }) && Object.keys(errors).length === 0
  }

  const onSubmit = async (data) => {
    try {
      await addNewDeliveryLetter({username:username, data:data}).unwrap()
      toast.success("Delivery Letter Created Successfully!")
      navigate("/dash/delivery-letters")
    } catch (err) {
      console.error('Create error:', err)
      toast.error(err?.data?.message || "Creation failed. Please try again.")
    }
  }

  const formSteps = [
    { component: <CarDetailsForm />, title: "Car Details" },
    { component: <DelivereeDetailsForm />, title: "Deliveree Details" },
    { component: <DealershipDetailsForm />, title: "Dealership Details" }
  ]

  const formPageLoader = () => {
    if (currFormPage >= 0 && currFormPage < formSteps.length) {
      return formSteps[currFormPage].component
    }
    return <div>Unknown form step</div>
  }

  const canSubmit = isFormValid() && !isLoading
  
  return (
    <div className="form-container">
      {/* Header with delete button */}
      <div className="form-header">
        <h2 className="form-title">Create New Delivery Letter</h2>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="form-space-y">
          {/* Step indicator */}
          <div className="step-indicator">
            <span>Step {currFormPage + 1} of {formSteps.length}: {formSteps[currFormPage].title}</span>
          </div>

          {/* Form content */}
          {formPageLoader()}

          {/* Navigation and Submit */}
          <div className="form-nav">
            <MultiStepFormNavigator
              currStepNum={currFormPage}
              totalSteps={formSteps.length}
              setCurrStepNum={setCurrFormPage}
              isLastStep={currFormPage === formSteps.length - 1}
            />
            
            {/* Submit Button - Always visible */}
            <button
              type="submit"
              className={`btn btn-primary ${!canSubmit ? 'btn-disabled' : ''}`}
              disabled={!canSubmit}
              title={!canSubmit ? 'Please fill all required fields correctly' : 'Save changes'}
            >
              <FontAwesomeIcon icon={faSave} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Form validation summary */}
          {Object.keys(errors).length > 0 && (
            <div className="validation-summary">
              <h4>Please fix the following errors:</h4>
              <ul>
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="error-message">
                    {error.message || `${field} is required`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

export default NewDeliveryLetterForm