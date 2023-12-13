import React, { useState } from "react";
export default function useCopyToClipboard() {
  const [result, setResult] = useState(null);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setResult({ state: "success" });
    } catch (e) {
      setResult({ state: "error", message: e.message });
      throw e;
    } finally {
      setTimeout(() => {
        setResult(null);
      }, 2000);
    }
  };

  // We want the result as a tuple
  return [copy, result];
}
