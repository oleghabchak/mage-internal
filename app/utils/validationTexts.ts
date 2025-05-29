export const errorsText = {
  email: ["Email is required", "Invalid email"],
  firstName: ["First name is required"],
  lastName: ["Last name is required"],
  oldPassword: ["Old password is required", "Old password is incorrect"],
  newPassword: [
    "New password is required",
    "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number",
  ],
  confirmPassword: ["The password doesn't match"],
  changePassword: ["Change password error"],
  password: [
    "Password is required",
    "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number",
  ],
  login: ["Incorrect password or username"],
  username: ["Username is required"],
  experience: ["Experience is required"],
  diet: ["Diet is required"],
  sleep: ["Sleep is required"],
  activity: ["Activity is required"],
  problem: ["Problem is required"],
  moreDetail: ["More detail is required"],
  usernameForRecovery: ["Username is required", "Unknown Username"],
  firstGoal: ["First goal is required"],
  secondGoal: ["Second goal is required"],
  thirdGoal: ["Third goal is reuqired"],
}

type ErrorKey = keyof typeof errorsText

export const findError = (key: ErrorKey, validationError: string) => {
  if (errorsText[key].includes(validationError)) {
    return validationError
  }

  return ""
}
