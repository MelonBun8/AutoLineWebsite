import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useUpdateDeliveryLetterMutation, useDeleteDeliveryLetterMutation } from './deliveryLettersApiSlice'
import MultiStepFormNavigator from '../../components/MultiStepFormNavigator/MultiStepFormNavigator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan, faFilePdf } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import useExportDeliveryLetter from '../../hooks/useExportDeliveryLetter'
import { useNavigate } from "react-router-dom"
import CarDetailsForm from "./formSteps/CarDetailsForm"
import DealershipDetailsForm from "./formSteps/DealershipDetailsForm"

const EditDeliveryLetterForm = ({ deliveryLetter }) => {
  const [currFormPage, setCurrFormPage] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { isManager, isAdmin } = useAuth()
  const navigate = useNavigate()
  const exportDeliveryLetter = useExportDeliveryLetter()

  const methods = useForm({
    defaultValues: {
      deliveryLetterDate: deliveryLetter?.deliveryLetterDate?.slice(0, 10) || null,
      deliveryLetterDate_date: deliveryLetter?.deliveryLetterDate?.slice(0, 10) || null,
      deliveryLetterDate_time: deliveryLetter?.deliveryLetterDate?.slice(11, 16) || null,
      received: deliveryLetter?.received || false,
      carDetails: {
        registrationNo: deliveryLetter?.carDetails?.registrationNo || "",
        registrationDate: deliveryLetter?.carDetails?.registrationDate?.slice(0, 10) || null,
        chassisNo: deliveryLetter?.carDetails?.chassisNo || "",
        engineNo: deliveryLetter?.carDetails?.engineNo || "",
        make: deliveryLetter?.carDetails?.make || "",
        model: deliveryLetter?.carDetails?.model || "",
        color: deliveryLetter?.carDetails?.color || "",
        hp: deliveryLetter?.carDetails?.hp || 0,
        registrationBookNumber: deliveryLetter?.carDetails?.registrationBookNumber || "",
      },
      carDealership: {
        seller: {
          name: deliveryLetter?.carDealership?.sellerId?.name || "",
          address: deliveryLetter?.carDealership?.sellerId?.address || "",
          tel: deliveryLetter?.carDealership?.sellerId?.tel || "",
          nic: deliveryLetter?.carDealership?.sellerId?.nic || "",
          remarks: deliveryLetter?.carDealership?.sellerId?.remarks || "",
        },
        purchaser: {
          name: deliveryLetter?.carDealership?.purchaser?.name || "",
          address: deliveryLetter?.carDealership?.purchaser?.address || "",
          tel: deliveryLetter?.carDealership?.purchaser?.tel || "",
          nic: deliveryLetter?.carDealership?.purchaser?.nic || "",
        }
      }
    },
    mode: "onChange", // when validation is triggered for fields (Can also be onBlur, onSubmit, onTouched)
  })

  const [updateDeliveryLetter, { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading }] = useUpdateDeliveryLetterMutation()
  const [deleteDeliveryLetter, { isSuccess: isDelSuccess, isLoading: isDeleteLoading }] = useDeleteDeliveryLetterMutation()

  // Watch form state to determine if form is valid
  const { formState: { errors, _isValid }, watch } = methods
  const watchedValues = watch()

  // Check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = [
      'carDetails.registrationNo',
      'carDealership.seller.name',
      'carDealership.seller.tel',
      'carDealership.purchaser.tel',
      'carDealership.purchaser.name',
      'carDetails.chassisNo',
    ]
    
    return requiredFields.every(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], watchedValues)
      return value && value.trim() !== ''
    }) && Object.keys(errors).length === 0
  }

  const onSubmit = async (data) => {
    try {
      console.log({...data})
      await updateDeliveryLetter({ id: deliveryLetter._id, ...data }).unwrap()
      toast.success("Delivery Letter Updated Successfully!")
    } catch (err) {
      console.error('Update error:', err)
      toast.error(err?.data?.message || "Update failed. Please try again.")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteDeliveryLetter( deliveryLetter._id ).unwrap()
      toast.success("Delivery Letter Deleted Successfully!")
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err?.data?.message || "Delete failed. Please try again.")
    }
  }
  
  useEffect(() => {
    if (isUpdateSuccess || isDelSuccess) {
      navigate('/dash/delivery-letters')
    }
  }, [isUpdateSuccess, isDelSuccess, navigate])

  const confirmDelete = () => {
    setShowDeleteConfirm(true)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const formSteps = [
    { component: <CarDetailsForm />, title: "Car Details" },
    { component: <DealershipDetailsForm isEditMode={true} />, title: "Dealership Details" }
  ]

  const formPageLoader = () => {
    if (currFormPage >= 0 && currFormPage < formSteps.length) {
      return formSteps[currFormPage].component
    }
    return <div>Unknown form step</div>
  }

  const canDelete = (isManager || isAdmin) && !isDeleteLoading
  const canSubmit = isFormValid() && !isUpdateLoading
  
  return (
    <div className="form-container">
      {/* Header with delete button */}
      <div className="form-header">
        <h2 className="form-title">Edit Delivery Letter</h2>
         <div className="form-header-buttons">
          <button
            className="icon-button"
            title="Export as PDF"
            onClick={() => exportDeliveryLetter(deliveryLetter)}
          >
            <FontAwesomeIcon icon={faFilePdf} />
          </button>

          {canDelete && (
            <button
              className="icon-button"
              title="Delete Delivery Letter"
              onClick={confirmDelete}
              disabled={isDeleteLoading}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              {isDeleteLoading && <span className="loading-text">Deleting...</span>}
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this delivery letter? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={cancelDelete}
                disabled={isDeleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
              {isUpdateLoading ? 'Saving...' : 'Save Changes'}
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

export default EditDeliveryLetterForm