import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Normalizes phone numbers into E.164 format (e.g., +2348012345678).
 * Falls back to raw input if invalid.
 *
 * @param {string} value - The user-entered phone number
 * @param {string} defaultCountry - Default country code (e.g., "NG")
 * @returns {string} - Normalized E.164 phone number or original value
 */
export function normalizePhoneClient(value, defaultCountry = "NG") {
  if (!value) return value;

  try {
    const parsed = parsePhoneNumberFromString(value, defaultCountry);
    if (parsed && parsed.isValid()) {
      return parsed.number; // ✅ Always E.164
    }
    return value.trim(); // return raw input if invalid
  } catch (err) {
    return value.trim();
  }
}
