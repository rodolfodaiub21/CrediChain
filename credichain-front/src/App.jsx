import { Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';
import AuthMenu from './login-register';
import RegisterForm from './registerform';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<AuthMenu />} />
      <Route path="/registerform" element={<RegisterForm/>}/>
    </Routes>
  );
}

export default App;