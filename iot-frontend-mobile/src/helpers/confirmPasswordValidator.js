export function confirmPasswordValidator(password, confirmPassword) {
  if (!password) {
    return "Password can't be empty."
  }
  if (password.length < 3) {
    return 'Password must be at least 3 characters long.'
  }

  if (!confirmPassword) {
    return "Confirm password can't be empty."
  }
  if (confirmPassword.length < 3) {
    return 'Confirm password must be at least 3 characters long.'
  }

  if (confirmPassword !== password) {
    return 'Two passwords that you enter is inconsistent!'
  }

  return ''
}
