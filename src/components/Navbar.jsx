import { useNavigate, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { getUser, isAdmin } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const admin = isAdmin() || user.role === 'ROLE_HR';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <div className={styles.logo}>EMS</div>
        <span>Employee Management</span>
      </div>
      <div className={styles.links}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
          Dashboard
        </NavLink>

        {admin && (
          <>
            <NavLink to="/employees" className={({ isActive }) => isActive ? styles.active : ''}>
              Employees
            </NavLink>
            <NavLink to="/departments" className={({ isActive }) => isActive ? styles.active : ''}>
              Departments
            </NavLink>
            <NavLink to="/leaves" className={({ isActive }) => isActive ? styles.active : ''}>
              Leaves
            </NavLink>
            <NavLink to="/payroll" className={({ isActive }) => isActive ? styles.active : ''}>
              Payroll
            </NavLink>
          </>
        )}

        {!admin && (
          <>
            <NavLink to="/my-profile" className={({ isActive }) => isActive ? styles.active : ''}>
              My Profile
            </NavLink>
            <NavLink to="/my-leaves" className={({ isActive }) => isActive ? styles.active : ''}>
              My Leaves
            </NavLink>
            <NavLink to="/my-payslips" className={({ isActive }) => isActive ? styles.active : ''}>
              My Payslips
            </NavLink>
          </>
        )}
      </div>
      <div className={styles.user}>
        <span className={styles.roleBadge}>{user.role?.replace('ROLE_', '')}</span>
        <span>{user.username}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;