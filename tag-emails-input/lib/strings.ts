/*
 * String manipulation tools
 */
// Capture anything that is not a space or comma.
export const extractWords = (text: string): Array<string> =>
  text.match(/([^,\s]+)/gi) || [];

// Extract any emails from the text and return these as an array.
export const extractEmails = (text: string): Array<string> =>
  text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) || [];
