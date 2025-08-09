import { useFormContext } from 'react-hook-form'

const DealershipDetailsForm = ({isEditMode = false, isAutoline = false}) => {
  const { register, formState: { _errors } } = useFormContext()
  
  const sellerLoadup = () => {
    if (!isAutoline){
      return (
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Seller Information</legend>
        <div className="form-grid">

          <div className="form-field">
            <label className="label label-required">Name</label>
            <input
              type="text"
              {...register("carDealership.seller.name", {
                  required: "Seller name is required",
              })}
              className="input"
              disabled={isEditMode}
            />
          </div>
          <div className="form-field">
            <label className="label">Address</label>
            <input
              type="text"
              {...register("carDealership.seller.address")}
              className="input"
              disabled={isEditMode}
            />
          </div>
          <div className="form-field">
            <label className="label label-required">Telephone</label>
            <input
              type="tel"
              {...register("carDealership.seller.tel", {
                  required: "Seller phone number is required",
              })}
              className={`input ${isEditMode ? 'disabled-input' : ''}`}
              disabled={isEditMode}
            />
          </div>
          <div className="form-field">
            <label className="label">NIC</label>
            <input
              type="text"
              {...register("carDealership.seller.nic")}
              className="input"
              disabled={isEditMode}
            />
          </div>
          <div className="form-field md-col-span-2">
            <label className="label">Remarks</label>
            <textarea
              {...register("carDealership.seller.remarks")}
              className="textarea"
              disabled={isEditMode}
            />
          </div>
        </div>
      </fieldset> 
      )
    }
  }

  return (
    <div className="form-space-y">
      <h3 className="form-title">Transaction Information</h3>

      {sellerLoadup()}
      

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Purchaser Information</legend>
        <div className="form-grid">
          <div className="form-field">
            <label className="label label-required">Name</label>
            <input
              type="text"
              {...register("carDealership.purchaser.name", {
                  required: "Purchaser name is required",
              })}
              className="input"
            />
          </div>
          <div className="form-field">
            <label className="label">Address</label>
            <input
              type="text"
              {...register("carDealership.purchaser.address")}
              className="input"
            />
          </div>
          <div className="form-field">
            <label className="label label-required">Telephone</label>
            <input
              type="tel"
              {...register("carDealership.purchaser.tel", {
                  required: "Purchaser phone number is required",
              })}
              className="input"
            />
          </div>
          <div className="form-field">
            <label className="label">NIC</label>
            <input
              type="text"
              {...register("carDealership.purchaser.nic")}
              className="input"
            />
          </div>
        </div>
      </fieldset>
    </div>
  )
}

export default DealershipDetailsForm