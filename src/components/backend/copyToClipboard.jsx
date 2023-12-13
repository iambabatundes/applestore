import React from "react";

export default function CopyToClipboard({
  inputText,
  copyResult,
  handleClickCopy,
  fileLink,
}) {
  return (
    <div>
      <button onClick={() => handleClickCopy(fileLink)}>
        Copy to clipboard
      </button>
      <div>
        {copyResult?.state === "success" && "Copied!"}
        {copyResult?.state === "error" && `Error: ${copyResult.message}`}
      </div>
    </div>
  );
}
