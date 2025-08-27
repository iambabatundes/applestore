import { parsePhoneNumberFromString } from "libphonenumber-js";

export const parsePhone = (value, defaultCountry = "NG") => {
  const parsed = parsePhoneNumberFromString(value, defaultCountry);
  return parsed
    ? { country: parsed.country, callingCode: parsed.countryCallingCode }
    : { country: "", callingCode: "" };
};
