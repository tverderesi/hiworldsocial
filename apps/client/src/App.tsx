import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import MenuBar from "./components/MenuBar";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";
import SinglePost from "./pages/SinglePost";
import ResetPassword from "./pages/ResetPassword";

import { EditProfile } from "./pages/EditProfile";
function App() {
  return (
    <AuthProvider>
      <Router>
        <MenuBar />
        <Routes>
          {/* prettier-ignore */}
          <Route path='/' element={<Home />}>
       
          </Route>
          <Route path="/profile/editprofile" element={<EditProfile />} />
          {/* prettier-ignore */}
          <Route path='/login' element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
          {/* prettier-ignore */}
          <Route path='/register' element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/reset-password" element={<AuthRoute><ResetPassword /></AuthRoute>} />
          {/* prettier-ignore */}
          <Route path='/posts/:id' element={<SinglePost />} >
           
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
