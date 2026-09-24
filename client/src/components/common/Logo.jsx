import React from 'react';

/**
 * LOGO CONFIGURATION
 * To switch back to the legacy PNG logo at any time, simply change USE_LEGACY_LOGO to true.
 */
export const USE_LEGACY_LOGO = false;

export const LOGO_PATHS = {
  legacy: '/images/Church_logo.png',
  dark: '/images/church-logo-new.svg',    // Full-colour for light backgrounds
  light: '/images/church-logo-light.svg'  // High-contrast white/cyan/gold for dark backgrounds
};

/**
 * Reusable church Logo component
 * @param {'light'|'dark'} variant - 'light' for dark navy backgrounds, 'dark' for light backgrounds
 * @param {number|string} size - Height in pixels (width scales proportionally 1:1)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Custom inline styles
 * @param {string} alt - Alt text for accessibility
 */
const Logo = ({
  variant = 'light',
  size = 48,
  className = '',
  style = {},
  alt = 'Friends Garden AG Church'
}) => {
  const src = USE_LEGACY_LOGO
    ? LOGO_PATHS.legacy
    : variant === 'dark'
    ? LOGO_PATHS.dark
    : LOGO_PATHS.light;

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`church-logo-img ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        objectFit: 'contain',
        display: 'inline-block',
        ...style
      }}
      loading="eager"
    />
  );
};

export default Logo;
