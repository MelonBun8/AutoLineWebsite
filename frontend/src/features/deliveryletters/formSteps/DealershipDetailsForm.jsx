import { useFormContext } from 'react-hook-form'

const DealershipDetailsForm = () => {
  const { register, formState: { _errors } } = useFormContext()

  return (
    <div className="form-space-y">
      <h3 className="form-title">Dealership Information</h3>
      
      <fieldset className="fieldset">
        <legend className="fieldset-legend">For Dealer</legend>
        <div className="form-grid-three">
          <div className="form-field">
            <label className="label">Owner Name</label>
            <input
              type="text"
              {...register("carDealership.forDealer.ownerName")}
              className="input"
            />
          </div>
          <div className="form-field">
            <label className="label">Salesman Name</label>
            <input
              type="text"
              {...register("carDealership.forDealer.salesmanName")}
              className="input"
            />
          </div>
          <div className="form-field">
            <label className="label">Salesman Card No</label>
            <input
              type="text"
              {...register("carDealership.forDealer.salesmanCardNo")}
              className="input"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Seller Information</legend>
        <div className="form-grid">
          <div className="form-field">
            <label className="label">Name</label>
            <input
              type="text"
              {...register("carDealership.seller.name")}
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
            <label className="label">Telephone</label>
            <input
              type="tel"
              {...register("carDealership.seller.tel")}
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
            <label className="label">Name</label>
            <input
              type="text"
              {...register("carDealership.purchaser.name")}
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
            <label className="label">Telephone</label>
            <input
              type="tel"
              {...register("carDealership.purchaser.tel")}
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