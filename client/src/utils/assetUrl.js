/**
 * Resolves static asset and upload URLs for both local development and production.
 *
 * In Production:
 * 1. If REACT_APP_API_URL is configured (e.g. in Vercel or Docker build), it prefixes with that URL.
 * 2. If REACT_APP_API_URL is not set, returns the relative URL (/uploads/...)
 *    so Vercel/Nginx reverse-proxy rewrites handle it cleanly over HTTPS.
 *    (Crucial: NEVER returns http://localhost in production, preventing browser Mixed Content blocks).
 *
 * In Local Development (localhost / 127.0.0.1):
 * 1. Falls back to http://localhost:5000 (or REACT_APP_API_URL if specified).
 */
export const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  if (process.env.REACT_APP_API_URL) {
    const base = process.env.REACT_APP_API_URL.replace(/\/+$/, '');
    return `${base}${cleanPath}`;
  }

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (!isLocalhost) {
    // In production, relative path is proxied by Vercel/Nginx over HTTPS
    return cleanPath;
  }

  return `http://localhost:5000${cleanPath}`;
};

/**
 * Image error handler that provides intelligent fallback for development failover
 * and guarantees a fallback image is displayed instead of a broken image icon.
 */
export const handleImageError = (e, fallbackImage) => {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // In local dev, if port 5000 is down, try port 5001 (Admin panel server)
  if (isLocalhost && e.target.src && e.target.src.includes(':5000')) {
    e.target.src = e.target.src.replace(':5000', ':5001');
    return;
  }

  if (fallbackImage) {
    e.target.src = fallbackImage;
  }
};
