const isNonEmptyString = (value, maxLength = 1000) =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;

const normalizeString = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const isValidUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');

const isValidDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

module.exports = {
  isNonEmptyString,
  normalizeString,
  isValidUrl,
  isValidEmail,
  isValidDate
};
