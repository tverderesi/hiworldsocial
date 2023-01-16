import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container';
import { AuthContext, AuthProvider } from './context/auth';
import { useContext } from 'react';
import AuthRoute from './util/AuthRoute';
function App() {
  const { user } = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <MenuBar />
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />
          <Route
            path='/login'
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          ></Route>
          <Route
            path='/register'
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
