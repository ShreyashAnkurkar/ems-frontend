import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', formData);
      const userRole = response.data.role;

      // Validate role matches selected portal
      if (role === 'EMPLOYEE' && userRole !== 'ROLE_EMPLOYEE') {
        setError('This account is not an employee account. Please use Admin login.');
        setLoading(false);
        return;
      }
      if (role === 'ADMIN' && userRole === 'ROLE_EMPLOYEE') {
        setError('This account is not an admin account. Please use Employee login.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        role: response.data.role
      }));
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  // Role selector screen
  if (!role) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>EMS</div>
            <h1>Welcome to EMS</h1>
            <p>Select your portal to continue</p>
          </div>
          <div className={styles.roleGrid}>
            <button className={styles.roleBtn} onClick={() => setRole('EMPLOYEE')}>
              <span className={styles.roleIcon}>👤</span>
              <span className={styles.roleLabel}>Employee</span>
              <span className={styles.roleDesc}>View your profile, leaves & payslips</span>
            </button>
            <button className={styles.roleBtn} onClick={() => setRole('ADMIN')}>
              <span className={styles.roleIcon}>⚙️</span>
              <span className={styles.roleLabel}>Admin / HR</span>
              <span className={styles.roleDesc}>Manage employees, leaves & payroll</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>EMS</div>
          <h1>{role === 'EMPLOYEE' ? 'Employee Login' : 'Admin / HR Login'}</h1>
          <p>Sign in to your account</p>
        </div>
        <button className={styles.backBtn} onClick={() => { setRole(null); setError(''); }}>
          ← Back
        </button>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Username</label>
            <input type="text" name="username" value={formData.username}
              onChange={handleChange} placeholder="Enter username" required />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Enter password" required />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;