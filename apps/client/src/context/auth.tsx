import type { PropsWithChildren } from "react";
import { createContext, useEffect, useReducer } from "react";
import { useQuery } from "@apollo/client/react";

import { ME_QUERY } from "../util/GraphQL";
import { setPreferredLanguage, type SupportedLanguage } from "../i18n";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  profilePicture: string;
  preferredLanguage?: SupportedLanguage | null;
  token?: string | null;
}

interface AuthContextValue {
  authLoading: boolean;
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
}

interface AuthState {
  user: AuthUser | null;
}

type AuthAction =
  | { type: "LOGIN"; payload: AuthUser }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  user: null,
};

const AuthContext = createContext<AuthContextValue>({
  authLoading: true,
  user: null,
  login: () => undefined,
  logout: () => undefined,
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { data, loading } = useQuery<{ me: AuthUser | null }>(ME_QUERY, {
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  });

  useEffect(() => {
    if (data?.me) {
      dispatch({ type: "LOGIN", payload: data.me });
      if (data.me.preferredLanguage) {
        setPreferredLanguage(data.me.preferredLanguage);
      }
      return;
    }

    if (!loading) {
      window.localStorage.removeItem("authToken");
      dispatch({ type: "LOGOUT" });
    }
  }, [data, loading]);

  const value: AuthContextValue = {
    authLoading: loading,
    user: state.user,
    login: (userData: AuthUser) => {
      if (userData.token) {
        window.localStorage.setItem("authToken", userData.token);
      }

      if (userData.preferredLanguage) {
        setPreferredLanguage(userData.preferredLanguage);
      }

      dispatch({ type: "LOGIN", payload: userData });
    },
    logout: () => {
      window.localStorage.removeItem("authToken");
      dispatch({ type: "LOGOUT" });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
