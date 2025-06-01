import { Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';
import AuthMenu from './login-register';
import RegisterForm from './registerform';
import LoginForm from './login-';
import AdminPanel from './admin-panel';
import UserDashboard from './User_Dash';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<AuthMenu />} />
      <Route path="/registerform" element={<RegisterForm/>}/>
      <Route path ="/LoginForm" element={<LoginForm/>}/>
      <Route path="/AdminPanel" element={<AdminPanel />} />
      <Route path="/UserDashboard" element={<UserDashboard/>} />
    </Routes>
  );
}

export default App;