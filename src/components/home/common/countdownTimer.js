import React, { useEffect, useState } from "react";

const CountdownTimer = ({ initialSeconds, onExpire }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onExpire();
    }
  }, [seconds, onExpire]);

  return <div>{`Request a new code in ${seconds} seconds`}</div>;
};

export default CountdownTimer;
