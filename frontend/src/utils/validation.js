/**
 * Trims and normalises whitespace in a string.
 */
export const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

/**
 * Validates a name-like field (company name, person name, etc.)
 * Returns an error string, or null when valid.
 */
export const validateNameLike = (label, value, options = {}) => {
  const { minLength = 2, maxLength = 255 } = options;
  const trimmed = normalizeText(value);
  if (!trimmed) return `${label} is required.`;
  if (trimmed.length < minLength)
    return `${label} must be at least ${minLength} characters.`;
  if (trimmed.length > maxLength)
    return `${label} must be at most ${maxLength} characters.`;
  return null;
};

/**
 * Parses a positive integer from a string.
 * Returns { value, error }.
 */
export const parsePositiveInt = (raw) => {
  const str = String(raw ?? "").trim();
  if (!str) return { value: null, error: "This field is required." };
  const n = parseInt(str, 10);
  if (isNaN(n) || !Number.isInteger(n))
    return { value: null, error: "Must be a whole number." };
  if (n < 1) return { value: null, error: "Must be at least 1." };
  return { value: n, error: null };
};

/**
 * Parses a positive number (integer or decimal) from a string.
 * Returns { value, error }.
 */
export const parsePositiveNumber = (raw) => {
  const str = String(raw ?? "").trim();
  if (!str) return { value: null, error: "This field is required." };
  const n = parseFloat(str);
  if (isNaN(n)) return { value: null, error: "Must be a valid number." };
  if (n < 0) return { value: null, error: "Must be 0 or greater." };
  return { value: n, error: null };
};
