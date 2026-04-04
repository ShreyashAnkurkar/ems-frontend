import { useNavigate, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink>
        <NavLink to="/employees" className={({ isActive }) => isActive ? styles.active : ''}>Employees</NavLink>
        <NavLink to="/departments" className={({ isActive }) => isActive ? styles.active : ''}>Departments</NavLink>
        <NavLink to="/leaves" className={({ isActive }) => isActive ? styles.active : ''}>Leaves</NavLink>
        <NavLink to="/payroll" className={({ isActive }) => isActive ? styles.active : ''}>Payroll</NavLink>
      </div>
      <div className={styles.user}>
        <span>{user.username}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;