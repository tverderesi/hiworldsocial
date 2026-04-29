import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import "dotenv/config";

import {
  generateToken,
  toPublicUser,
} from "../../lib/auth";
import { createUserInputError } from "../../lib/graphqlErrors";
import { sendEmail } from "../../lib/email";
import { checkRateLimit } from "../../lib/rateLimit";
import User from "../../models/User";
import type { GraphQLContext } from "../../types";
import {
  validateEmail,
  validateLoginInput,
  validatePassword,
  validateRegisterInput,
  validateUsername,
} from "../../utils/validators";
import checkAuth from "../../utils/checkAuth";

interface LoginArgs {
  username: string;
  password: string;
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: string;
}

interface RegisterArgs {
  registerInput: RegisterInput;
}

interface UpdateProfileInput {
  oldUsername: string;
  newUsername?: string;
  email?: string;
  oldPassword: string;
  newPassword?: string;
  confirmPassword?: string;
  profilePicture?: string;
  preferredLanguage?: string | null;
}

interface UpdateProfileArgs {
  updateProfileInput: UpdateProfileInput;
}

interface UserArgs {
  username: string;
}

interface PasswordResetRequestArgs {
  email: string;
}

interface ResetPasswordArgs {
  token: string;
  password: string;
  confirmPassword: string;
}

interface UpdatePreferredLanguageArgs {
  preferredLanguage: string;
}

const PASSWORD_RESET_TTL_MS = 1000 * 60 * 30;
const PASSWORD_RESET_ACCOUNT_WINDOW_MS = 1000 * 60 * 15;
const PASSWORD_RESET_ACCOUNT_MAX_REQUESTS = 3;
const PASSWORD_RESET_IP_WINDOW_MS = 1000 * 60 * 15;
const PASSWORD_RESET_IP_MAX_REQUESTS = 5;
const PASSWORD_RESET_SUCCESS_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";
const PASSWORD_RESET_COMPLETED_MESSAGE =
  "Your password has been reset. You can now log in with the new password.";
const SUPPORTED_LANGUAGES = new Set(["en", "pt"]);

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getPasswordResetBaseUrl(): string {
  return (
    process.env.PASSWORD_RESET_URL_BASE ??
    process.env.CLIENT_URL ??
    process.env.APP_URL ??
    "http://hiworld.social"
  );
}

function getClientAddress(context: GraphQLContext): string {
  const forwardedFor = context.req?.headers?.["x-forwarded-for"];
  const candidate = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor;

  return candidate?.split(",")[0]?.trim() || "unknown";
}

async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = new URL("/reset-password", getPasswordResetBaseUrl());
  resetUrl.searchParams.set("token", token);

  await sendEmail({
    to: email,
    subject: "Reset your Hey World password",
    html: `
      <p>You requested a password reset for your Hey World account.</p>
      <p><a href="${resetUrl.toString()}">Reset your password</a></p>
      <p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>
    `,
  });
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

const usersResolvers = {
  Mutation: {
    async login(
      _: unknown,
      { username, password }: LoginArgs
    ) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });

      if (!valid) {
        throw createUserInputError("Wrong credentials.", { errors });
      }

      if (!user) {
        errors.general = "User not found!";
        throw createUserInputError("User not found.", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials.";
        throw createUserInputError("Wrong credentials.", { errors });
      }

      const token = generateToken(user);

      return { ...toPublicUser(user), token };
    },

    logout() {
      return true;
    },

    async requestPasswordReset(
      _: unknown,
      { email }: PasswordResetRequestArgs,
      context: GraphQLContext
    ) {
      const normalizedEmail = email.trim().toLowerCase();
      const { valid } = validateEmail(normalizedEmail);

      if (!checkRateLimit({
        key: `password-reset-ip:${getClientAddress(context)}`,
        windowMs: PASSWORD_RESET_IP_WINDOW_MS,
        maxRequests: PASSWORD_RESET_IP_MAX_REQUESTS,
      })) {
        return {
          success: true,
          message: PASSWORD_RESET_SUCCESS_MESSAGE,
        };
      }

      if (!valid) {
        return {
          success: true,
          message: PASSWORD_RESET_SUCCESS_MESSAGE,
        };
      }

      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return {
          success: true,
          message: PASSWORD_RESET_SUCCESS_MESSAGE,
        };
      }

      const requestedAt = user.passwordResetRequestedAt
        ? new Date(user.passwordResetRequestedAt).getTime()
        : 0;
      const withinWindow =
        requestedAt > 0 && Date.now() - requestedAt < PASSWORD_RESET_ACCOUNT_WINDOW_MS;
      const requestCount = withinWindow ? user.passwordResetRequestCount ?? 0 : 0;

      if (requestCount >= PASSWORD_RESET_ACCOUNT_MAX_REQUESTS) {
        return {
          success: true,
          message: PASSWORD_RESET_SUCCESS_MESSAGE,
        };
      }

      const previousResetTokenHash = user.passwordResetTokenHash ?? null;
      const previousResetExpiresAt = user.passwordResetExpiresAt ?? null;
      const previousResetRequestedAt = user.passwordResetRequestedAt ?? null;
      const previousResetRequestCount = user.passwordResetRequestCount ?? 0;
      const token = randomBytes(32).toString("hex");
      user.passwordResetTokenHash = hashResetToken(token);
      user.passwordResetExpiresAt = new Date(
        Date.now() + PASSWORD_RESET_TTL_MS
      ).toISOString();
      user.passwordResetRequestedAt = new Date().toISOString();
      user.passwordResetRequestCount = requestCount + 1;
      await user.save();

      try {
        await sendPasswordResetEmail(normalizedEmail, token);
      } catch (error) {
        user.passwordResetTokenHash = previousResetTokenHash;
        user.passwordResetExpiresAt = previousResetExpiresAt;
        user.passwordResetRequestedAt = previousResetRequestedAt;
        user.passwordResetRequestCount = previousResetRequestCount;
        await user.save();
        console.error("Password reset email delivery failed", toError(error));
      }

      return {
        success: true,
        message: PASSWORD_RESET_SUCCESS_MESSAGE,
      };
    },

    async resetPassword(
      _: unknown,
      { token, password, confirmPassword }: ResetPasswordArgs
    ) {
      if (password !== confirmPassword) {
        throw createUserInputError("Passwords do not match.", {
          errors: {
            confirmPassword: "Passwords must match!",
          },
        });
      }

      const { valid, errors } = validatePassword(password);

      if (!valid) {
        throw createUserInputError("Errors", { errors });
      }

      const user = await User.findOne({
        passwordResetTokenHash: hashResetToken(token),
      });

      if (
        !user ||
        !user.passwordResetExpiresAt ||
        new Date(user.passwordResetExpiresAt).getTime() < Date.now()
      ) {
        throw createUserInputError("Reset link is invalid or expired.", {
          errors: {
            token: "Reset link is invalid or expired.",
          },
        });
      }

      user.password = await bcrypt.hash(password, 12);
      user.passwordResetTokenHash = null;
      user.passwordResetExpiresAt = null;
      user.passwordResetRequestedAt = null;
      user.passwordResetRequestCount = 0;
      await user.save();

      return {
        success: true,
        message: PASSWORD_RESET_COMPLETED_MESSAGE,
      };
    },

    async register(
      _: unknown,
      {
        registerInput: {
          username,
          email,
          password,
          confirmPassword,
          profilePicture,
        },
      }: RegisterArgs
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw createUserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (user) {
        throw createUserInputError("Username is taken.", {
          errors: {
            username: "This username is taken!",
          },
        });
      }

      const uniqueEmail = await User.findOne({ email });

      if (uniqueEmail) {
        throw createUserInputError("Email is already registered.", {
          errors: {
            email: "This email is already registered.",
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        profilePicture,
      });

      const res = await newUser.save();
      const token = generateToken(res);

      return { ...toPublicUser(res), token };
    },

    async updateUser(
      _: unknown,
      {
        updateProfileInput: {
          oldUsername,
          newUsername,
          email,
          oldPassword,
          newPassword,
          confirmPassword,
          profilePicture,
          preferredLanguage,
        },
      }: UpdateProfileArgs
    ) {
      const user = await User.findOne({ username: oldUsername });

      if (!user) {
        throw createUserInputError("User not found.", {
          errors: {
            username: "User not found.",
          },
        });
      }

      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match) {
        throw createUserInputError("Wrong credentials.", {
          errors: {
            password: "Wrong credentials.",
          },
        });
      }

      if (newUsername && newUsername !== user.username) {
        const { valid: usernameValid, errors: usernameErrors } =
          validateUsername(newUsername);

        if (!usernameValid) {
          throw createUserInputError("Errors", { errors: usernameErrors });
        }

        const existingUser = await User.findOne({ username: newUsername });

        if (existingUser && existingUser.email !== email) {
          throw createUserInputError("Username is taken.", {
            errors: {
              username: "Username is taken.",
            },
          });
        }

        user.username = newUsername;
      }

      if (email && email !== user.email) {
        const { valid: emailValid, errors: emailErrors } = validateEmail(email);

        if (!emailValid) {
          throw createUserInputError("Errors", { errors: emailErrors });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail && existingEmail.username !== user.username) {
          throw createUserInputError("Email is already registered.", {
            errors: {
              email: "This email is already registered to another account.",
            },
          });
        }

        user.email = email;
      }

      if (oldPassword && newPassword) {
        const { valid: passwordValid, errors: passwordErrors } =
          validatePassword(oldPassword);

        if (!passwordValid) {
          throw createUserInputError("Errors", { errors: passwordErrors });
        }

        if (newPassword !== confirmPassword) {
          throw createUserInputError("Passwords do not match.", {
            errors: {
              confirmPassword: "Passwords do not match.",
            },
          });
        }

        const { valid: newPasswordValid, errors: newPasswordErrors } =
          validatePassword(newPassword);

        if (!newPasswordValid) {
          throw createUserInputError("Errors", { errors: newPasswordErrors });
        }

        user.password = await bcrypt.hash(newPassword, 12);
      }

      if (profilePicture && profilePicture !== user.profilePicture) {
        user.profilePicture = profilePicture;
      }

      if (preferredLanguage !== undefined && preferredLanguage !== null) {
        if (!SUPPORTED_LANGUAGES.has(preferredLanguage)) {
          throw createUserInputError("Unsupported language.", {
            errors: {
              preferredLanguage: "Unsupported language.",
            },
          });
        }

        user.preferredLanguage = preferredLanguage;
      }

      const res = await user.save();
      const token = generateToken(res);

      return { ...toPublicUser(res), token };
    },

    async updatePreferredLanguage(
      _: unknown,
      { preferredLanguage }: UpdatePreferredLanguageArgs,
      context: GraphQLContext
    ) {
      if (!SUPPORTED_LANGUAGES.has(preferredLanguage)) {
        throw createUserInputError("Unsupported language.", {
          errors: {
            preferredLanguage: "Unsupported language.",
          },
        });
      }

      const { username } = checkAuth(context);
      const user = await User.findOne({ username });

      if (!user) {
        throw createUserInputError("User not found.", {
          errors: {
            username: "User not found.",
          },
        });
      }

      user.preferredLanguage = preferredLanguage;
      const res = await user.save();

      return toPublicUser(res);
    },
  },

  Query: {
    async getUser(_: unknown, { username }: UserArgs) {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        throw toError(error);
      }
    },

    async getUsers() {
      try {
        return await User.find();
      } catch (error) {
        throw toError(error);
      }
    },

    async me(_: unknown, __: unknown, context: GraphQLContext) {
      try {
        const { username } = checkAuth(context);
        const user = await User.findOne({ username });

        if (!user) {
          return null;
        }

        return toPublicUser(user);
      } catch {
        return null;
      }
    },
  },
};

export default usersResolvers;
