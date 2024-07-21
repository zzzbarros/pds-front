function password(password: string) {
  const minLength = /.{8,}/ // Pelo menos 8 caracteres
  const hasLetter = /[A-Za-z]/ // Pelo menos uma letra
  const hasDigit = /\d/ // Pelo menos um número
  const hasSpecialChar = /[@$!%*?&;,#.]/ // Pelo menos um caractere especial, incluindo ponto e vírgula

  if (!minLength.test(password)) return false
  if (!hasLetter.test(password)) return false
  if (!hasDigit.test(password)) return false
  if (!hasSpecialChar.test(password)) return false

  return password
}

function name(name: string) {
  if (!/\s+/.test(name)) return false
  if (name.split(' ').length < 2) false
  return name
}

export const validator = { password, name }
