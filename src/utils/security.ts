/**
 * Security utilities for input sanitization and validation
 */

// Sanitize user input to prevent XSS attacks
export const sanitizeInput = (input: string | null | undefined): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/["']/g, '') // Remove quotes to prevent attribute injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .replace(/script/gi, '') // Remove script tags
    .trim();
};

// Sanitize for logging to prevent log injection
export const sanitizeForLog = (input: string | null | undefined): string => {
  if (!input) return '';
  
  return input
    .replace(/[\r\n]/g, '') // Remove newlines that could break log format
    .replace(/[\t]/g, ' ') // Replace tabs with spaces
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/["']/g, '') // Remove quotes
    .substring(0, 200) // Limit length to prevent log flooding
    .trim();
};

// Sanitize HTML content for display
export const sanitizeHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  
  // Basic HTML sanitization - remove dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/on\w+\s*=\s*[^>\s]+/gi, '') // Remove unquoted event handlers
    .trim();
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Validate pincode (Indian format)
export const isValidPincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Escape special characters for safe display
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Clean object for logging (remove sensitive data)
export const sanitizeObjectForLog = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'credential'];
  const cleaned = { ...obj };
  
  Object.keys(cleaned).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      cleaned[key] = '[REDACTED]';
    } else if (typeof cleaned[key] === 'string') {
      cleaned[key] = sanitizeForLog(cleaned[key]);
    } else if (typeof cleaned[key] === 'object') {
      cleaned[key] = sanitizeObjectForLog(cleaned[key]);
    }
  });
  
  return cleaned;
};