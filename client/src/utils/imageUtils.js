/**
 * Utility to append a cache-busting query parameter to an image URL.
 * Uses the entity's updatedAt timestamp so the URL changes only when the image actually updates.
 * Ignores data: URIs and blob: URIs to prevent invalid query strings.
 *
 * @param {string|null|undefined} url - The original image URL
 * @param {string|Date|number|null|undefined} updatedAt - The last update timestamp
 * @returns {string|null} - Cache-busted URL or null
 */
export const getCacheBustedImageUrl = (url, updatedAt) => {
  if (!url) return null;
  // Base64 data URIs and blob URIs shouldn't have query parameters appended
  if (typeof url === 'string' && (url.startsWith('data:') || url.startsWith('blob:'))) {
    return url;
  }

  const timestamp = updatedAt ? new Date(updatedAt).getTime() : '';
  if (!timestamp || isNaN(timestamp)) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${timestamp}`;
};

export const getMinistryImageUrl = getCacheBustedImageUrl;
