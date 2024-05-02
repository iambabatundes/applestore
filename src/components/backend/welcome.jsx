import React, { useState } from "react";

function WelcomeMessage() {
  const [name, setName] = useState("");
  const [isNameEntered, setIsNameEntered] = useState(false);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleButtonClick = () => {
    setIsNameEntered(true);
  };

  return (
    <div>
      <input type="text" value={name} onChange={handleChange} />
      <button onClick={handleButtonClick}>Submit</button>
      {isNameEntered && <p>Welcome {name} to our website!</p>}
    </div>
  );
}

export default WelcomeMessage;
