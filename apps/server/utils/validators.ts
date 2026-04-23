import type { ValidationResult } from "../types.js";

const emailPattern =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

const passwordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export function validateRegisterInput(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: Record<string, string> = {};

  switch (true) {
    case username.trim() === "":
      errors.username = "Username must not be empty!";
      break;
    case email.trim() === "":
      errors.email = "E-mail must not be empty!";
      break;
    case !email.match(emailPattern):
      errors.email = "Email must be a valid email address.";
      break;
    case password === "":
      errors.password = "Password must not be empty or contain spaces!";
      break;
    case !password.match(passwordPattern):
      errors.password =
        "Password must contain at least one uppercase case, one lowercase letter, one number and one symbol.";
      break;
    case password !== confirmPassword:
      errors.confirmPassword = "Passwords must match!";
      break;
  }

  return { errors, valid: Object.keys(errors).length < 1 };
}

export function validateLoginInput(
  username: string,
  password: string
): ValidationResult {
  const errors: Record<string, string> = {};

  if (username.trim() === "") {
    errors.username = "Username must not be empty!";
  }

  if (password.trim() === "") {
    errors.password = "Password must not be empty!";
  }

  return { errors, valid: Object.keys(errors).length < 1 };
}

export function validateUsername(username: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (username.trim() === "") {
    errors.username = "Username must not be empty!";
  }

  return { errors, valid: Object.keys(errors).length < 1 };
}

export function validateEmail(email: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (email.trim() === "") {
    errors.email = "E-mail must not be empty!";
  } else if (!email.match(emailPattern)) {
    errors.email = "Email must be a valid email address.";
  }

  return { errors, valid: Object.keys(errors).length < 1 };
}

export function validatePassword(password: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (password.trim() === "") {
    errors.password = "Password must not be empty!";
  }

  if (!password.match(passwordPattern)) {
    errors.password =
      "Password must contain at least one uppercase case, one lowercase letter, one number and one symbol.";
  }

  return { errors, valid: Object.keys(errors).length < 1 };
}
