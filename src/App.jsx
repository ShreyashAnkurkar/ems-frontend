import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard';
import Employees from './pages/employees/Employees';
import Departments from './pages/departments/Departments';
import Leaves from './pages/leaves/Leaves';
import Payroll from './pages/payroll/Payroll';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
      <Route path="/departments" element={<PrivateRoute><Departments /></PrivateRoute>} />
      <Route path="/leaves" element={<PrivateRoute><Leaves /></PrivateRoute>} />
      <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;