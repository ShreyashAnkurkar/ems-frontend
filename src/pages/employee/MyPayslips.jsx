import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from '../employees/Employees.module.css';

const MyPayslips = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  useEffect(() => {
    api.get('/v1/employee/payslips')
      .then(res => setPayrolls(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}><h1>My Payslips</h1></div>
        {loading ? <p>Loading...</p> : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr><th>Month/Year</th><th>Basic</th><th>HRA</th><th>Allowances</th><th>Deductions</th><th>Net Salary</th><th>Status</th></tr>
              </thead>
              <tbody>
                {payrolls.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign:'center', padding:'24px', color:'#888'}}>No payslips yet</td></tr>
                ) : payrolls.map(p => (
                  <tr key={p.id}>
                    <td>{months[p.payMonth - 1]} {p.payYear}</td>
                    <td>₹{p.basicSalary?.toLocaleString()}</td>
                    <td>₹{p.hra?.toLocaleString()}</td>
                    <td>₹{p.allowances?.toLocaleString()}</td>
                    <td>₹{p.deductions?.toLocaleString()}</td>
                    <td><strong>₹{p.netSalary?.toLocaleString()}</strong></td>
                    <td><span className={`${styles.badge} ${p.status === 'PAID' ? styles.active : styles.on_leave}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPayslips;