import { useState, useMemo, useEffect } from "react";
import { useFormik } from "formik";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import {
  createUser,
  verifyUser,
  resendValidationCode,
} from "../../services/userServices";
import { loginWithJwt } from "../../services/authService";
import { registerValidationSchema } from "../validation/registerValidation";
import { getErrorMessage } from "../utils/errorUtils";

export function useRegister() {
  const [step, setStep] = useState(1);
  const [registrationToken, setRegistrationToken] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(20);
  const [phoneNumberInfo, setPhoneNumberInfo] = useState({
    country: "",
    callingCode: "",
  });

  const navigate = useNavigate();
  const { state } = useLocation();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      phoneNumber: "",
      username: "",
      password: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        const response = await createUser(values);
        setRegistrationToken(response.registrationToken);

        // derive channels
        const fromBackend = Array.isArray(response.channels)
          ? response.channels
          : [];
        const derived = [];
        if (!fromBackend.length) {
          if (values.email)
            derived.push({ channel: "email", destination: values.email });
          if (values.phoneNumber)
            derived.push({ channel: "phone", destination: values.phoneNumber });
        }

        const merged = fromBackend.length ? fromBackend : derived;
        setChannels(merged);

        setSelectedChannel(
          merged.find((c) => c.channel === "email")?.channel ||
            merged[0]?.channel ||
            null
        );

        setCanResend(false);
        setVerificationCode("");
        setResendCooldown((response.expiresInMinutes || 1) * 60);

        toast.success(response.message || "Verification code(s) sent.");
        setStep(2);
      } catch (err) {
        setError(
          getErrorMessage(err, "Registration failed. Please try again.")
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("phoneNumber", value);
    const parsed = parsePhoneNumberFromString(value, "NG");
    setPhoneNumberInfo(
      parsed
        ? { country: parsed.country, callingCode: parsed.countryCallingCode }
        : { country: "", callingCode: "" }
    );
  };

  useEffect(() => {
    setCanResend(false);
    setVerificationCode("");
  }, [selectedChannel]);

  // unified computed channel
  const { effectiveChannel, destination } = useMemo(() => {
    const found = channels.find((c) => c.channel === selectedChannel);
    if (found)
      return {
        effectiveChannel: found.channel,
        destination: found.destination,
      };

    if (selectedChannel === "email")
      return { effectiveChannel: "email", destination: formik.values.email };
    if (selectedChannel === "phone")
      return {
        effectiveChannel: "phone",
        destination: formik.values.phoneNumber,
      };

    if (formik.values.email)
      return { effectiveChannel: "email", destination: formik.values.email };
    if (formik.values.phoneNumber)
      return {
        effectiveChannel: "phone",
        destination: formik.values.phoneNumber,
      };

    return { effectiveChannel: null, destination: "" };
  }, [
    channels,
    selectedChannel,
    formik.values.email,
    formik.values.phoneNumber,
  ]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!effectiveChannel) {
      setError("No verification channel available.");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyUser({
        registrationToken,
        channel: effectiveChannel,
        code: verificationCode,
      });

      toast.success(response.message || "Registration complete.");
      if (response.token) loginWithJwt(response.token);

      navigate(state?.path || "/");
    } catch (ex) {
      setError(
        getErrorMessage(
          ex,
          "Verification failed. Please check your code and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !effectiveChannel) return;
    setLoading(true);
    setError("");

    try {
      const response = await resendValidationCode({
        registrationToken,
        channel: effectiveChannel,
      });

      toast.info(response.message || "Verification code resent successfully.");
      setCanResend(false);
      setResendCooldown((response.expiresInMinutes || 1) * 60);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to resend verification code. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    registrationToken,
    verificationCode,
    setVerificationCode,
    canResend,
    loading,
    error,
    channels,
    selectedChannel,
    setSelectedChannel,
    resendCooldown,
    phoneNumberInfo,
    formik,
    effectiveChannel,
    destination,
    handlePhoneChange,
    handleVerify,
    handleResendCode,
  };
}
