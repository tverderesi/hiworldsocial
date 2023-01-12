import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container';
import { AuthProvider } from './context/auth';

function App() {
  return (
    <AuthProvider>
      <Container>
        <Router>
          <MenuBar />
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/register'
              element={<Register />}
            />
          </Routes>
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default App;
