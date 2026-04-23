import { UserInputError } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../../models/User.js";
import {
  validateEmail,
  validateLoginInput,
  validatePassword,
  validateRegisterInput,
  validateUsername,
} from "../../utils/validators.js";
import type { TokenUser, UserDocument } from "../../types.js";

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
}

interface UpdateProfileArgs {
  updateProfileInput: UpdateProfileInput;
}

interface UserArgs {
  username: string;
}

function generateToken(user: UserDocument): string {
  const payload: TokenUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture,
  };

  return jwt.sign(payload, process.env.SECRET_KEY as string, {
    expiresIn: "1h",
  });
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

const usersResolvers = {
  Mutation: {
    async login(_: unknown, { username, password }: LoginArgs) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });

      if (!valid) {
        throw new UserInputError("Wrong credentials.", { errors });
      }

      if (!user) {
        errors.general = "User not found!";
        throw new UserInputError("User not found.", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials.";
        throw new UserInputError("Wrong credentials.", { errors });
      }

      const token = generateToken(user);

      return {
        ...user.toObject(),
        id: user.id,
        token,
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
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("Username is taken.", {
          errors: {
            username: "This username is taken!",
          },
        });
      }

      const uniqueEmail = await User.findOne({ email });

      if (uniqueEmail) {
        throw new UserInputError("Email is already registered.", {
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

      return {
        ...res.toObject(),
        id: res.id,
        token,
      };
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
        },
      }: UpdateProfileArgs
    ) {
      const user = await User.findOne({ username: oldUsername });

      if (!user) {
        throw new UserInputError("User not found.", {
          errors: {
            username: "User not found.",
          },
        });
      }

      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match) {
        throw new UserInputError("Wrong credentials.", {
          errors: {
            password: "Wrong credentials.",
          },
        });
      }

      if (newUsername && newUsername !== user.username) {
        const { valid: usernameValid, errors: usernameErrors } =
          validateUsername(newUsername);

        if (!usernameValid) {
          throw new UserInputError("Errors", { errors: usernameErrors });
        }

        const existingUser = await User.findOne({ username: newUsername });

        if (existingUser && existingUser.email !== email) {
          throw new UserInputError("Username is taken.", {
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
          throw new UserInputError("Errors", { errors: emailErrors });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail && existingEmail.username !== user.username) {
          throw new UserInputError("Email is already registered.", {
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
          throw new UserInputError("Errors", { errors: passwordErrors });
        }

        if (newPassword !== confirmPassword) {
          throw new UserInputError("Passwords do not match.", {
            errors: {
              confirmPassword: "Passwords do not match.",
            },
          });
        }

        const { valid: newPasswordValid, errors: newPasswordErrors } =
          validatePassword(newPassword);

        if (!newPasswordValid) {
          throw new UserInputError("Errors", { errors: newPasswordErrors });
        }

        user.password = await bcrypt.hash(newPassword, 12);
      }

      if (profilePicture && profilePicture !== user.profilePicture) {
        user.profilePicture = profilePicture;
      }

      const res = await user.save();
      const token = generateToken(res);

      return {
        ...res.toObject(),
        id: res.id,
        token,
      };
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
  },
};

export default usersResolvers;
