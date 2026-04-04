import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    leaves: 0,
    payrolls: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [emp, dept, leaves, payrolls] = await Promise.all([
          api.get('/v1/employees'),
          api.get('/v1/departments'),
          api.get('/v1/leaves'),
          api.get('/v1/payrolls')
        ]);
        setStats({
          employees: emp.data.length,
          departments: dept.data.length,
          leaves: leaves.data.length,
          payrolls: payrolls.data.length
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.welcome}>
          <h1>Welcome back, {user.username}! 👋</h1>
          <p>Here's what's happening in your organization today.</p>
        </div>
        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.blue}`}>
            <div className={styles.icon}>👥</div>
            <div className={styles.info}>
              <span className={styles.value}>{stats.employees}</span>
              <span className={styles.label}>Total Employees</span>
            </div>
          </div>
          <div className={`${styles.card} ${styles.green}`}>
            <div className={styles.icon}>🏢</div>
            <div className={styles.info}>
              <span className={styles.value}>{stats.departments}</span>
              <span className={styles.label}>Departments</span>
            </div>
          </div>
          <div className={`${styles.card} ${styles.orange}`}>
            <div className={styles.icon}>📅</div>
            <div className={styles.info}>
              <span className={styles.value}>{stats.leaves}</span>
              <span className={styles.label}>Leave Requests</span>
            </div>
          </div>
          <div className={`${styles.card} ${styles.purple}`}>
            <div className={styles.icon}>💰</div>
            <div className={styles.info}>
              <span className={styles.value}>{stats.payrolls}</span>
              <span className={styles.label}>Payrolls Generated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;