import { createContext, useReducer } from 'react';

const AuthContext = createContext({
  user: null,
  login: userData => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    default:
      return state;
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  const login = userData => {
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
