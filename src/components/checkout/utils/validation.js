import * as Yup from "yup";

export const AddressSchema = Yup.object().shape({
  country: Yup.string()
    .required(
      <span className="checkout-address__alert">
        <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
        Please enter a country
      </span>
    )
    .min(3)
    .max(255),
  fullName: Yup.string().required(
    <span className="checkout-address__alert">
      <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
      Please enter a name
    </span>
  ),
  phoneNumber: Yup.string().required(
    <span className="checkout-address__alert">
      <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
      Please enter a phone number so we can call if there are any issues with
      delivery.
    </span>
  ),
  address: Yup.string().required(
    <span className="checkout-address__alert">
      <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
      Please enter an address
    </span>
  ),
  city: Yup.string().required(
    <span className="checkout-address__alert">
      <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
      Please enter a city
    </span>
  ),
  state: Yup.string().required(
    <span className="checkout-address__alert">
      <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
      Please enter a state
    </span>
  ),
  zipCode: Yup.string().required(
    <span className="checkout-address__alert">
      <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
      Please enter a zip code
    </span>
  ),
});
