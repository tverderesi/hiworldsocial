import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ForgotPassword from "./ForgotPassword";
import { REQUEST_PASSWORD_RESET } from "../util/GraphQL";
import { renderWithProviders } from "../test/test-utils";

describe("ForgotPassword page", () => {
  it("shows the generic confirmation message after requesting a reset", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ForgotPassword />, {
      route: "/forgot-password",
      mocks: [
        {
          request: {
            query: REQUEST_PASSWORD_RESET,
            variables: {
              email: "alice@example.com",
            },
          },
          result: {
            data: {
              requestPasswordReset: {
                success: true,
                message:
                  "If an account exists for that email, a password reset link has been sent.",
                __typename: "PasswordResetResponse",
              },
            },
          },
        },
      ],
    });

    await user.type(screen.getByPlaceholderText("E-mail"), "alice@example.com");
    await user.click(screen.getByRole("button", { name: "Send Reset Link" }));

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "If an account exists for that email, a password reset link has been sent."
      )
    ).toBeInTheDocument();
  });
});
