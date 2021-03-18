export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email || email.length <= 0) return "Email não pode estar vazio."
  if (!re.test(email)) return 'Ooops! Precisamos de um e-mail válido.'
  return ''
}