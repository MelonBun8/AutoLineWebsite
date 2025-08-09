
// CarDetailsForm.jsx
import { useFormContext } from "react-hook-form"
import { useEffect } from 'react'

const CarDetailsForm = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  const date = watch("deliveryLetterDate_date");
  const time = watch("deliveryLetterDate_time");

  
  useEffect(() => {// Combines date and time whenever on change
    if (date && time) {
      setValue("deliveryLetterDate", `${date}T${time}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [date, time, setValue]);


  return (
    <div className="form-grid">
      
      <div className="form__checkbox-container">
          <input
            type="checkbox"
            {...register("received")}
            className="form__checkbox"
          />
          <label htmlFor="received" className="label">Received</label> 
          {errors?.received && (
            <p className="error-message">{errors.received.message}</p>
          )}
        </div>

        {/* Delivery Letter Date - Date Part */}
      <div className="form-field">
        <label className="label label-required">Delivery Date</label>
        <input
          type="date"
          {...register("deliveryLetterDate_date", {
            required: "Delivery date is required",
          })}
          className="input"
        />
        {errors?.deliveryLetterDate_date && (
          <p className="error-message">{errors.deliveryLetterDate_date.message}</p>
        )}
      </div>

        {/* Delivery Letter Date - Time Part */}
        <div className="form-field">
          <label className="label label-required">Delivery Time</label>
          <input
            type="time"
            {...register("deliveryLetterDate_time", {
              required: "Delivery time is required",
            })}
            className="input"
          />
          {errors?.deliveryLetterDate_time && (
            <p className="error-message">{errors.deliveryLetterDate_time.message}</p>
          )}
        </div>

        {/* Hidden combined field for final submission */}
        <input type="hidden" {...register("deliveryLetterDate", {
          required: "Combined delivery date is required",
        })} />
        {errors?.deliveryLetterDate && (
          <p className="error-message">{errors.deliveryLetterDate.message}</p>
        )}

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
            {...register("carDetails.registrationDate", {
              required: "Registration Date is required",
            })}
            className="input"
          />
        </div>

        <div className="form-field">
          <label className="label label-required">Chassis No</label>
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

      </div>
  )
}

export default CarDetailsForm