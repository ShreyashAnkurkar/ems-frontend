import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/employees/Employees';
import Departments from './pages/departments/Departments';
import Leaves from './pages/leaves/Leaves';
import Payroll from './pages/payroll/Payroll';
import MyProfile from './pages/employee/MyProfile';
import MyLeaves from './pages/employee/MyLeaves';
import MyPayslips from './pages/employee/MyPayslips';
import { getUser } from './services/api';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = getUser();
  if (!token) return <Navigate to="/login" />;
  if (user.role !== 'ROLE_ADMIN' && user.role !== 'ROLE_HR') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Admin only routes */}
      <Route path="/employees" element={<AdminRoute><Employees /></AdminRoute>} />
      <Route path="/departments" element={<AdminRoute><Departments /></AdminRoute>} />
      <Route path="/payroll" element={<AdminRoute><Payroll /></AdminRoute>} />

      {/* Both admin and employee */}
      <Route path="/leaves" element={<PrivateRoute><Leaves /></PrivateRoute>} />

      {/* Employee only routes */}
      <Route path="/my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
      <Route path="/my-leaves" element={<PrivateRoute><MyLeaves /></PrivateRoute>} />
      <Route path="/my-payslips" element={<PrivateRoute><MyPayslips /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;