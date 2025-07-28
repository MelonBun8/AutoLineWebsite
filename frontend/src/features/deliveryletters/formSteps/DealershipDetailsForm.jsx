import { useFormContext } from 'react-hook-form'

const DealershipDetailsForm = () => {
  const { register, formState: { _errors } } = useFormContext()

  return (
    <div className="form-space-y">
      <h3 className="form-title">Transaction Information</h3>

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
            />
          </div>
          <div className="form-field">
            <label className="label">Address</label>
            <input
              type="text"
              {...register("carDealership.seller.address")}
              className="input"
            />
          </div>
          <div className="form-field">
            <label className="label label-required">Telephone</label>
            <input
              type="tel"
              {...register("carDealership.seller.tel", {
                  required: "Seller phone number is required",
              })}
              className="input"
            />
          </div>
          <div className="form-field">
            <label className="label">NIC</label>
            <input
              type="text"
              {...register("carDealership.seller.nic")}
              className="input"
            />
          </div>
          <div className="form-field md-col-span-2">
            <label className="label">Remarks</label>
            <textarea
              {...register("carDealership.seller.remarks")}
              className="textarea"
            />
          </div>
        </div>
      </fieldset>

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