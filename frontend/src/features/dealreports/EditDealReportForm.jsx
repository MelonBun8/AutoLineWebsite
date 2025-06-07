import { useState, useEffect } from "react"
import { useUpdateDealReportMutation, useDeleteDealReportMutation } from "./dealReportsApiSlice"
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

const ALPHA_REGEX = /^[A-Za-z\s]+$/
const NUM_REGEX = /^[0-9]+$/
const ALPHANUM_REGEX = /^[A-Za-z0-9\s-]+$/

const EditDealReportForm = ({ dealReport }) => {
  const navigate = useNavigate()

  const [updateDealReport, { isLoading, isSuccess, isError, error }] = useUpdateDealReportMutation()
  const [deleteDealReport, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] = useDeleteDealReportMutation()

  const [formData, setFormData] = useState({
    purchasedFrom: dealReport.purchasedFrom || '',
    make: dealReport.vehicleDetails.make || '',
    color: dealReport.vehicleDetails.color || '',
    chassisNumber: dealReport.vehicleDetails.chassisNumber || '',
    regionNumber: dealReport.vehicleDetails.regionNumber || '',
    purchasePrice: dealReport.purchasePrice || '',
    voucherNumber: dealReport.voucherNumber || '',
    soldTo: dealReport.soldTo || '',
    salePrice: dealReport.salePrice || '',
    commissionAmount: dealReport.commissionAmount || '',
    expenses: dealReport.expenses || '',
  })

  const [validity, setValidity] = useState({})

  const validateField = (name, value) => {
    switch (name) {
      case 'purchasedFrom':
      case 'soldTo':
      case 'make':
      case 'color':
        return ALPHA_REGEX.test(value)
      case 'purchasePrice':
      case 'salePrice':
      case 'commissionAmount':
      case 'expenses':
        return NUM_REGEX.test(value)
      case 'chassisNumber':
      case 'regionNumber':
      case 'voucherNumber':
        return ALPHANUM_REGEX.test(value)
      default:
        return true
    }
  }

  useEffect(() => {
    const newValidity = {}
    for (const field in formData) {
      newValidity[field] = validateField(field, formData[field])
    }
    setValidity(newValidity)
  }, [formData])

  useEffect(() => {
    console.log(isSuccess)
    if (isSuccess || isDelSuccess) {
      setFormData({})
      navigate('/dash/deal-reports')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onSaveDealReportClicked = async () => {
    const payload = {
      id: dealReport.id,
      date: dealReport.date,
      user: dealReport.user,
      purchasedFrom: formData.purchasedFrom,
      purchasePrice: Number(formData.purchasePrice),
      voucherNumber: formData.voucherNumber,
      soldTo: formData.soldTo,
      salePrice: Number(formData.salePrice),
      commissionAmount: Number(formData.commissionAmount),
      expenses: Number(formData.expenses),
      vehicleDetails: {
        make: formData.make,
        color: formData.color,
        chassisNumber: formData.chassisNumber,
        regionNumber: formData.regionNumber
      }
    }
    await updateDealReport(payload)
  }

  const onDeleteDealReportClicked = async () => {
    await deleteDealReport({ id: dealReport.id })
  }

  const canSave = Object.values(validity).every(Boolean) && !isLoading

  const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
  const errContent = error?.data?.message || delerror?.data?.message || ""

  const renderInput = (label, name, type = "text", note = "") => (
    <>
      <label className="form__label" htmlFor={name}>{label} {note && <span className="nowrap">[{note}]</span>}</label>
      <input
        className={`form__input ${validity[name] === false ? 'form__input--incomplete' : ''}`}
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        autoComplete="off"
      />
    </>
  )

  return (
    <>
      <p className={errClass}>{errContent}</p>
      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>View / Edit Deal Report</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" onClick={onSaveDealReportClicked} disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="icon-button" title="Delete" onClick={onDeleteDealReportClicked}>
              <FontAwesomeIcon icon={faTrashCan} />
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
}

export default EditDealReportForm
