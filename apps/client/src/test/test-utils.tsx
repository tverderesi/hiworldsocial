import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import {
  MockedProvider,
  type MockedResponse,
} from "@apollo/client/testing/react";

import { AuthContext } from "../context/auth";

interface RenderOptions {
  mocks?: MockedResponse[];
  route?: string;
  user?: Record<string, unknown> | null;
  authLoading?: boolean;
  login?: (userData: unknown) => void;
  logout?: () => void;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    mocks = [],
    route = "/",
    user = null,
    authLoading = false,
    login = () => undefined,
    logout = () => undefined,
  }: RenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider value={{ authLoading, user, login, logout }}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </AuthContext.Provider>
      </MockedProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
