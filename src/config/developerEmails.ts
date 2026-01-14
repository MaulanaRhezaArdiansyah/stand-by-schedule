// Developer Email Mapping
// Email dapat di-override via environment variables

export const developerEmails: Record<string, string> = {
  // Front Office
  'Dirga': process.env.EMAIL_DIRGA || 'dirga@example.com',
  'Hilmi': process.env.EMAIL_HILMI || 'hilmi@example.com',
  'Ardan': process.env.EMAIL_ARDAN || 'ardan@example.com',

  // Middle Office
  'Alawi': process.env.EMAIL_ALAWI || 'alawi@example.com',
  'Farhan': process.env.EMAIL_FARHAN || 'farhan@example.com',
  'Rheza': process.env.EMAIL_RHEZA || 'rheza@example.com',
  'Vigo': process.env.EMAIL_VIGO || 'vigo@example.com',

  // Back Office
  'Rine': process.env.EMAIL_RINE || 'rine@example.com',
  'Ira': process.env.EMAIL_IRA || 'ira@example.com',
  'Miftah': process.env.EMAIL_MIFTAH || 'miftah@example.com',
  'Maulana': process.env.EMAIL_MAULANA || 'maulana@example.com',

  // Cadangan
  'Chabib': process.env.EMAIL_CHABIB || 'chabib@example.com',
  'Neza': process.env.EMAIL_NEZA || 'neza@example.com',
}

// Helper function to get email by name
export function getEmailByName(name: string): string | undefined {
  return developerEmails[name]
}

// Helper function to get all emails
export function getAllEmails(): string[] {
  return Object.values(developerEmails)
}
