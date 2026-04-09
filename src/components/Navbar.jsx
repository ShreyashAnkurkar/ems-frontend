import { useNavigate, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEmployee = user.role === 'ROLE_EMPLOYEE';

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

        {!isEmployee && (
          <>
            <NavLink to="/employees" className={({ isActive }) => isActive ? styles.active : ''}>Employees</NavLink>
            <NavLink to="/departments" className={({ isActive }) => isActive ? styles.active : ''}>Departments</NavLink>
            <NavLink to="/leaves" className={({ isActive }) => isActive ? styles.active : ''}>Leaves</NavLink>
            <NavLink to="/payroll" className={({ isActive }) => isActive ? styles.active : ''}>Payroll</NavLink>
          </>
        )}

        {isEmployee && (
          <>
            <NavLink to="/my-profile" className={({ isActive }) => isActive ? styles.active : ''}>My Profile</NavLink>
            <NavLink to="/my-leaves" className={({ isActive }) => isActive ? styles.active : ''}>My Leaves</NavLink>
            <NavLink to="/my-payslips" className={({ isActive }) => isActive ? styles.active : ''}>My Payslips</NavLink>
          </>
        )}
      </div>
      <div className={styles.user}>
        <span className={styles.roleBadge}
          style={{background: isEmployee ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.2)'}}>
          {user.role?.replace('ROLE_', '')}
        </span>
        <span>{user.username}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;