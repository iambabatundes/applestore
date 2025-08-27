export const getErrorMessage = (err, fallback = "Something went wrong.") => {
  if (!err) return fallback;
  const respData = err?.response?.data ?? err?.response ?? err;
  let candidate =
    respData?.error ?? respData?.message ?? err?.message ?? fallback;

  if (typeof candidate === "string") return candidate;
  if (Array.isArray(candidate))
    return candidate.map((c) => c?.message || String(c)).join(", ");
  if (typeof candidate === "object") {
    if (candidate.message) return candidate.message;
    if (Array.isArray(candidate.details))
      return candidate.details.map((d) => d.message).join(", ");
    try {
      return JSON.stringify(candidate);
    } catch {
      return fallback;
    }
  }
  return String(candidate);
};

export const getErrorText = (err) => {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (Array.isArray(err))
    return err
      .map((e) => (typeof e === "string" ? e : e?.message ?? JSON.stringify(e)))
      .filter(Boolean)
      .join(", ");
  if (typeof err === "object" && err !== null)
    return err?.message ?? JSON.stringify(err);
  return String(err);
};
