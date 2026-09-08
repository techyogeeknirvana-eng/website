/**
 * Utility for extracting and formatting clean, human-readable display names
 * from Google account profiles or email addresses.
 */
export function formatNameFromEmail(email?: string, candidateName?: string): string {
  if (
    candidateName &&
    candidateName.trim() &&
    candidateName !== 'Google Member' &&
    candidateName !== 'User' &&
    !candidateName.startsWith('user_')
  ) {
    return candidateName.trim();
  }

  if (!email || !email.includes('@')) {
    return candidateName?.trim() || 'Community Member';
  }

  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail === 'techyogeeknirvana@gmail.com') {
    return candidateName?.trim() || 'TechYOGeek Nirvana';
  }

  const prefix = cleanEmail.split('@')[0];
  const formatted = prefix
    .replace(/[._-]+/g, ' ')
    .replace(/([a-zA-Z]+)(\d+)/g, '$1 $2')
    .replace(/(\d+)([a-zA-Z]+)/g, '$1 $2')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return formatted || 'Community Member';
}
