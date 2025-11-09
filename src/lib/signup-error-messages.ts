type SignupDictionary = {
  unexpectedError: { key: string }
  passwordTooShort?: { key: string }
  passwordTooWeak?: { key: string }
  emailAlreadyUsed?: { key: string }
  autoLoginFailed?: { key: string }
}

const rawMessageMap: Record<string, keyof SignupDictionary> = {
  'user already registered': 'emailAlreadyUsed',
  'user already exists': 'emailAlreadyUsed',
  'a user with this email address has already been registered': 'emailAlreadyUsed',
  'password should be at least 6 characters': 'passwordTooShort',
  'password should be at least 8 characters': 'passwordTooShort',
  'password must be at least 8 characters long': 'passwordTooShort',
  'password is too weak': 'passwordTooWeak',
}

export const mapSignupError = (message?: string, i?: SignupDictionary) => {
  if (!message) {
    return i?.unexpectedError?.key ?? 'An unexpected error occurred'
  }

  const normalized = message.toLowerCase()
  const matchedKey = Object.keys(rawMessageMap).find((pattern) =>
    normalized.includes(pattern)
  )

  if (matchedKey) {
    const translationKey = rawMessageMap[matchedKey]
    const translated = i?.[translationKey]?.key
    if (translated) return translated
  }

  return message
}
