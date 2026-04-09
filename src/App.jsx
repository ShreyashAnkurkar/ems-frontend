import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard';
import Employees from './pages/employees/Employees';
import Departments from './pages/departments/Departments';
import Leaves from './pages/leaves/Leaves';
import Payroll from './pages/payroll/Payroll';
import MyProfile from './pages/employee/MyProfile';
import MyLeaves from './pages/employee/MyLeaves';
import MyPayslips from './pages/employee/MyPayslips';

const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = getUser();
  if (!token) return <Navigate to="/login" />;
  if (user.role === 'ROLE_EMPLOYEE') return <Navigate to="/" />;
  return children;
};

const EmployeeRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = getUser();
  if (!token) return <Navigate to="/login" />;
  if (user.role !== 'ROLE_EMPLOYEE') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Admin / HR only */}
      <Route path="/employees" element={<AdminRoute><Employees /></AdminRoute>} />
      <Route path="/departments" element={<AdminRoute><Departments /></AdminRoute>} />
      <Route path="/leaves" element={<AdminRoute><Leaves /></AdminRoute>} />
      <Route path="/payroll" element={<AdminRoute><Payroll /></AdminRoute>} />

      {/* Employee only */}
      <Route path="/my-profile" element={<EmployeeRoute><MyProfile /></EmployeeRoute>} />
      <Route path="/my-leaves" element={<EmployeeRoute><MyLeaves /></EmployeeRoute>} />
      <Route path="/my-payslips" element={<EmployeeRoute><MyPayslips /></EmployeeRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;