import { z } from "zod";

import type { ValidationResult } from "../types";

const emailPattern =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

const passwordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const MAX_POST_BODY_LENGTH = 512;

const usernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username must not be empty!"),
});

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "E-mail must not be empty!")
    .refine((value) => emailPattern.test(value), {
      message: "Email must be a valid email address.",
    }),
});

const passwordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(1, "Password must not be empty!")
    .refine((value) => passwordPattern.test(value), {
      message:
        "Password must contain at least one uppercase case, one lowercase letter, one number and one symbol.",
    }),
});

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username must not be empty!"),
  password: z
    .string()
    .trim()
    .min(1, "Password must not be empty!"),
});

const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, "Username must not be empty!"),
    email: z
      .string()
      .trim()
      .min(1, "E-mail must not be empty!")
      .refine((value) => emailPattern.test(value), {
        message: "Email must be a valid email address.",
      }),
    password: z
      .string()
      .trim()
      .min(1, "Password must not be empty or contain spaces!")
      .refine((value) => passwordPattern.test(value), {
        message:
          "Password must contain at least one uppercase case, one lowercase letter, one number and one symbol.",
      }),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  });

const postBodySchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Post body must not be empty")
    .max(
      MAX_POST_BODY_LENGTH,
      `Post body must not be longer than ${MAX_POST_BODY_LENGTH} characters`
    ),
});

function toValidationResult(
  result: z.ZodSafeParseResult<Record<string, unknown>>
): ValidationResult {
  if (result.success) {
    return { errors: {}, valid: true };
  }

  const errors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "general");

    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return {
    errors,
    valid: false,
  };
}

export function validateRegisterInput(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  return toValidationResult(
    registerSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    })
  );
}

export function validateLoginInput(
  username: string,
  password: string
): ValidationResult {
  return toValidationResult(loginSchema.safeParse({ username, password }));
}

export function validateUsername(username: string): ValidationResult {
  return toValidationResult(usernameSchema.safeParse({ username }));
}

export function validateEmail(email: string): ValidationResult {
  return toValidationResult(emailSchema.safeParse({ email }));
}

export function validatePassword(password: string): ValidationResult {
  return toValidationResult(passwordSchema.safeParse({ password }));
}

export function validatePostBody(body: string): ValidationResult {
  return toValidationResult(postBodySchema.safeParse({ body }));
}
