import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faShield,
  faExclamationTriangle,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

import "./styles/lockoutModal.css";

export const LockoutModal = ({
  lockoutData,
  onRetry,
  onClose,
  isVisible = true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!lockoutData?.remainingMinutes || !isVisible) return;

    // Convert minutes to seconds
    let remainingSeconds = lockoutData.remainingMinutes * 60;
    setTimeRemaining(remainingSeconds);
    setIsExpired(false);

    const timer = setInterval(() => {
      remainingSeconds -= 1;
      setTimeRemaining(remainingSeconds);

      if (remainingSeconds <= 0) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutData?.remainingMinutes, isVisible]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (!lockoutData?.remainingMinutes) return 0;
    const totalSeconds = lockoutData.remainingMinutes * 60;
    return Math.max(0, ((totalSeconds - timeRemaining) / totalSeconds) * 100);
  };

  if (!isVisible || !lockoutData) return null;

  return (
    <div className="adminLogin__lockout-overlay">
      <div className="adminLogin__lockout-modal">
        {/* Header */}
        <div className="adminLogin__lockout-header">
          <div className="adminLogin__lockout-icon">
            <FontAwesomeIcon icon={faShield} />
          </div>
          <div>
            <h3>Account Security Lock</h3>
            <p>Too many failed login attempts</p>
          </div>
        </div>

        {/* Content */}
        <div className="adminLogin__lockout-content">
          {!isExpired ? (
            <>
              {/* Countdown Display */}
              <div className="adminLogin__lockout-countdown">
                <div className="adminLogin__countdown-icon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="adminLogin__countdown-time">
                  {formatTime(timeRemaining)}
                </div>
                <p>Time remaining until you can try again</p>
              </div>

              {/* Progress Bar */}
              <div className="adminLogin__progress-container">
                <div className="adminLogin__progress-bar">
                  <div
                    className="adminLogin__progress-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Explanation */}
              <div className="adminLogin__lockout-explanation">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <div>
                  <p className="adminLogin__explanation-title">
                    Why is my account locked?
                  </p>
                  <p>
                    Your account has been temporarily locked due to multiple
                    failed login attempts. This is a security measure to protect
                    your account from unauthorized access.
                  </p>
                </div>
              </div>

              {/* Security Tips */}
              <div className="adminLogin__security-tips">
                <h4>Security Tips:</h4>
                <ul>
                  <li>• Double-check your email and password</li>
                  <li>• Ensure Caps Lock is turned off</li>
                  <li>
                    • Try using a backup authentication code if you have 2FA
                    enabled
                  </li>
                  <li>• Contact support if you continue having issues</li>
                </ul>
              </div>
            </>
          ) : (
            /* Expired State */
            <div className="adminLogin__lockout-expired">
              <div className="adminLogin__expired-icon">
                <FontAwesomeIcon icon={faRefresh} />
              </div>
              <h4>Lockout Period Expired</h4>
              <p>
                You can now try logging in again. Please ensure you're using the
                correct credentials.
              </p>
              <button onClick={onRetry} className="adminLogin__retry-btn">
                Try Login Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isExpired && (
          <div className="adminLogin__lockout-footer">
            <button onClick={onClose} className="adminLogin__close-btn">
              Close
            </button>
            <div className="adminLogin__lockout-time">
              Lockout expires at{" "}
              {new Date(Date.now() + timeRemaining * 1000).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
