import jwtDecode from 'jwt-decode';
import { createContext, useReducer } from 'react';

const initialState = {
  user: null,
};

const jwtToken = localStorage.getItem('jwtToken');
if (jwtToken) {
  const decodedToken: any = jwtDecode(jwtToken);

  if ((decodedToken.exp as number) * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: initialState,
  login: (userData: any) => {},
  logout: () => {},
});

function authReducer(state: any, action: { type: any; payload?: any }) {
  switch (action.type) {
    default:
      return state;
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
  }
}

function AuthProvider(props: any): JSX.Element {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData: any) => {
    console.log(userData);
    localStorage.setItem('jwtToken', userData.token);
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
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
