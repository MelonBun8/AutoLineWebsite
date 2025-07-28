
// CarDetailsForm.jsx
import { useFormContext } from "react-hook-form"

const CarDetailsForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="form-grid">
      
      <div className="form__checkbox-container">
          <input
            type="checkbox"
            {...register("received")}
            className="checkbox-input"
          />
          <label htmlFor="received" className="label">Received</label> 
          {errors?.received && (
            <p className="error-message">{errors.received.message}</p>
          )}
        </div>

        {/* New: Delivery Letter Date (Date Part) */}
        <div className="form-field">
          <label className="label label-required">Delivery Letter Date</label>
          <input
            type="date"
            {...register("deliveryLetterDate", {
              required: "Delivery Letter Date is required",
            })}
            className="input"
          />
          {errors?.deliveryLetterDate && (
            <p className="error-message">{errors.deliveryLetterDate.message}</p>
          )}
        </div>

        <div className="form-field">
          <label className="label label-required">Registration No</label>
          <input
            {...register("carDetails.registrationNo", {
              required: "Registration No is required",
            })}
            className="input"
          />
          {errors?.carDetails?.registrationNo && (
            <p className="error-message">{errors.carDetails.registrationNo.message}</p>
          )}
        </div>

        <div className="form-field">
          <label className="label label-required">Registration Date</label>
          <input
            type="date"
            {...register("carDetails.registrationDate")}
            className="input"
          />
        </div>

        <div className="form-field">
          <label className="label">Chassis No</label>
          <input {...register("carDetails.chassisNo", {
                  required: "Chassis Number is required",
              })} className="input" 
          />
          {errors?.carDetails?.chassisNo && (
            <p className="error-message">{errors.carDetails.chassisNo.message}</p>
          )}

        </div>

        <div className="form-field">
          <label className="label">Engine No</label>
          <input {...register("carDetails.engineNo")} className="input" />
        </div>

        <div className="form-field">
          <label className="label">Make</label>
          <input {...register("carDetails.make")} className="input" />
        </div>

        <div className="form-field">
          <label className="label">Model</label>
          <input {...register("carDetails.model")} className="input" />
        </div>

        <div className="form-field">
          <label className="label">Color</label>
          <input {...register("carDetails.color")} className="input" />
        </div>

        <div className="form-field">
          <label className="label">Horsepower</label>
          <input 
            type="number"
            {...register("carDetails.hp")} 
            className="input" 
          />
        </div>

        <div className="form-field">
          <label className="label">Registration Book Number</label>
          <input {...register("carDetails.registrationBookNumber")} className="input" />
        </div>

        <div className="form-field">
          <label className="label">Invoice No</label>
          <input {...register("carDetails.invoiceNo")} className="input" />
        </div>

        <div className="form-field">
          <label className="label">Invoice Date</label>
          <input type="date" {...register("carDetails.invoiceDate")} className="input" />
        </div>


      </div>
  )
}

export default CarDetailsForm