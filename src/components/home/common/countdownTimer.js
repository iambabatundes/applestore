// import React, { useEffect, useState } from "react";

// const CountdownTimer = ({ initialSeconds, onExpire }) => {
//   const [seconds, setSeconds] = useState(initialSeconds);

//   useEffect(() => {
//     if (seconds > 0) {
//       const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
//       return () => clearTimeout(timerId);
//     } else {
//       onExpire();
//     }
//   }, [seconds, onExpire]);

//   return <div>{`Request a new code in ${seconds} seconds`}</div>;
// };

// export default CountdownTimer;

import React, { useEffect, useState } from "react";

const CountdownTimer = ({ minutes = 0, seconds = 0, onExpire }) => {
  const [[mins, secs], setTime] = useState([minutes, seconds]);

  const tick = () => {
    if (mins === 0 && secs === 0) {
      onExpire();
    } else if (secs === 0) {
      setTime([mins - 1, 59]);
    } else {
      setTime([mins, secs - 1]);
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return (
    <div>
      {`${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`}
    </div>
  );
};

export default CountdownTimer;
