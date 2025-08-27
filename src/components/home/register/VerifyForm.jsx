import React from "react";
import CountdownTimer from "./common/countdownTimer";

export default function VerifyForm({
  channels,
  selectedChannel,
  setSelectedChannel,
  effectiveChannel,
  destination,
  verificationCode,
  setVerificationCode,
  loading,
  error,
  handleVerify,
  handleResendCode,
  canResend,
  resendCooldown,
}) {
  return (
    <form onSubmit={handleVerify} className="register__form">
      {channels.length > 1 && (
        <div className="channel-chooser">
          <h3>Choose how to verify:</h3>
          <div className="channel-options">
            {channels.map((c) => (
              <label key={c.channel} className="channel-option">
                <input
                  type="radio"
                  name="verificationChannel"
                  value={c.channel}
                  checked={selectedChannel === c.channel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                />
                <span>
                  {c.channel === "email" ? "Email" : "Phone"} — {c.destination}
                </span>
              </label>
            ))}
          </div>
          <hr />
        </div>
      )}

      <h1>
        Verify your{" "}
        {effectiveChannel === "email" ? "email address" : "phone number"}
      </h1>
      <h2>We have sent a verification code to:</h2>
      <span>{destination}</span>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="6-digit Verification Code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
        className="register__input"
      />

      <button
        type="submit"
        className="register__btn-verify"
        disabled={loading || verificationCode.length < 6}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        className="register__btn-resend"
        onClick={handleResendCode}
        disabled={loading || !canResend}
      >
        {loading ? "Resending..." : "Resend Code"}
      </button>

      {!canResend && (
        <CountdownTimer
          key={effectiveChannel || "timer"}
          initialSeconds={resendCooldown}
          onExpire={() => setCanResend(true)}
        />
      )}

      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
