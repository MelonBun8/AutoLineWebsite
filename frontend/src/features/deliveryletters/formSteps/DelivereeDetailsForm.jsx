import { useFormContext } from "react-hook-form"

const DelivereeDetailsForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="form-space-y">
      <div className="form-field">
        <label className="label label-required">Registered Name</label>
        <input
          type="text"
          {...register("delivereeDetails.registeredName", { 
            required: "Registered Name is required" 
          })}
          className="input"
        />
        {errors?.delivereeDetails?.registeredName && (
          <p className="error-message">{errors.delivereeDetails.registeredName.message}</p>
        )}
      </div>

      <div className="form-field">
        <label className="label label-required">CNIC</label>
        <input
          type="text"
          {...register("delivereeDetails.cnic", {
            required: "CNIC is required",
            pattern: {
              value: /^[0-9]{13}$/,
              message: "CNIC must be 13 digits",
            },
          })}
          className="input"
          placeholder="Enter 13-digit CNIC"
        />
        {errors?.delivereeDetails?.cnic && (
          <p className="error-message">{errors.delivereeDetails.cnic.message}</p>
        )}
      </div>

      <div className="form-field">
        <label className="label label-required">Receiver Name</label>
        <input
          type="text"
          {...register("delivereeDetails.receiverName", { 
            required: "Receiver Name is required" 
          })}
          className="input"
        />
        {errors?.delivereeDetails?.receiverName && (
          <p className="error-message">{errors.delivereeDetails.receiverName.message}</p>
        )}
      </div>

      <div className="form-field">
        <label className="label">Address</label>
        <input
          type="text"
          {...register("delivereeDetails.address")}
          className="input"
        />
      </div>

      <div className="form-field">
        <label className="label">Document Details</label>
        <textarea
          {...register("delivereeDetails.documentDetails")}
          className="textarea"
        />
      </div>
    </div>
  )
}

export default DelivereeDetailsForm