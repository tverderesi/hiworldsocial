import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import AuthRoute from "./AuthRoute";
import { renderWithProviders } from "../test/test-utils";

describe("AuthRoute", () => {
  it("renders children when there is no authenticated user", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/register"
          element={
            <AuthRoute>
              <div>register page</div>
            </AuthRoute>
          }
        />
      </Routes>,
      { route: "/register" }
    );

    expect(screen.getByText("register page")).toBeInTheDocument();
  });

  it("redirects authenticated users to the home route", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/register"
          element={
            <AuthRoute>
              <div>register page</div>
            </AuthRoute>
          }
        />
        <Route path="/" element={<div>home page</div>} />
      </Routes>,
      {
        route: "/register",
        user: { username: "alice" },
      }
    );

    expect(screen.getByText("home page")).toBeInTheDocument();
  });
});
