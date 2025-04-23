import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard/Dashboard';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import './App.css'

function App() {

  const defaultUsers = [
    { email: 'test@test.com', password: '12345678', name: 'Usuario Test' },
    { email: 'usuario2@test.com', password: 'usuario255', name: 'Usuario Test 2' }
  ];

  const existingUsers = JSON.parse(localStorage.getItem('users'));
  
  if (!existingUsers || existingUsers.length === 0) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
