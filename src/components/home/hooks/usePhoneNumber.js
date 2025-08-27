import { useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export function usePhoneNumber() {
  const [phoneInfo, setPhoneInfo] = useState({ country: "", callingCode: "" });

  const updatePhone = (value, setFieldValue) => {
    setFieldValue("phoneNumber", value);
    const phoneNumber = parsePhoneNumberFromString(value, "NG");
    if (phoneNumber) {
      setPhoneInfo({
        country: phoneNumber.country,
        callingCode: phoneNumber.countryCallingCode,
      });
    } else {
      setPhoneInfo({ country: "", callingCode: "" });
    }
  };

  return { phoneInfo, updatePhone };
}
