import { describe, expect, it } from "vitest";

import {
  MAX_POST_BODY_LENGTH,
  validateEmail,
  validateLoginInput,
  validatePassword,
  validatePostBody,
  validateRegisterInput,
  validateUsername,
} from "./validators.js";

describe("validators", () => {
  it("validates a correct registration payload", () => {
    const result = validateRegisterInput(
      "alice",
      "alice@example.com",
      "Password1!",
      "Password1!"
    );

    expect(result).toEqual({ errors: {}, valid: true });
  });

  it("rejects mismatched registration passwords", () => {
    const result = validateRegisterInput(
      "alice",
      "alice@example.com",
      "Password1!",
      "Password2!"
    );

    expect(result.valid).toBe(false);
    expect(result.errors.confirmPassword).toBe("Passwords must match!");
  });

  it("rejects invalid login input", () => {
    const result = validateLoginInput("", "");

    expect(result.valid).toBe(false);
    expect(result.errors).toMatchObject({
      username: "Username must not be empty!",
      password: "Password must not be empty!",
    });
  });

  it("validates standalone username, email, and password helpers", () => {
    expect(validateUsername("alice").valid).toBe(true);
    expect(validateEmail("alice@example.com").valid).toBe(true);
    expect(validatePassword("Password1!").valid).toBe(true);
  });

  it("rejects empty and oversized post bodies", () => {
    expect(validatePostBody("   ")).toEqual({
      errors: { body: "Post body must not be empty" },
      valid: false,
    });

    expect(validatePostBody("a".repeat(MAX_POST_BODY_LENGTH + 1))).toEqual({
      errors: {
        body: `Post body must not be longer than ${MAX_POST_BODY_LENGTH} characters`,
      },
      valid: false,
    });
  });
});
