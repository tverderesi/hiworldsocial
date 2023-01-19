import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';
import SinglePost from './pages/SinglePost';
function App() {
  return (
    <AuthProvider>
      <Router>
        <MenuBar />
        <Routes>
          {/* prettier-ignore */}
          <Route path='/' element={<Home />} />
          {/* prettier-ignore */}
          <Route path='/login' element={<AuthRoute><Login /></AuthRoute>} />
          {/* prettier-ignore */}
          <Route path='/register' element={<AuthRoute><Register /></AuthRoute>} />
          {/* prettier-ignore */}
          <Route path='/posts/:id' element={<SinglePost />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
