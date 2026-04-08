import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from '../employees/Employees.module.css';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    startDate: '', endDate: '', reason: '', leaveType: 'ANNUAL'
  });

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const empRes = await api.get('/v1/employees');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const myEmp = empRes.data.find(e => e.email === user.email) || empRes.data[0];
      if (myEmp) {
        setEmployeeId(myEmp.id);
        const leavesRes = await api.get(`/v1/leaves/employee/${myEmp.id}`);
        setLeaves(leavesRes.data);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/v1/leaves', { ...form, employeeId });
      fetchMyData();
      setShowModal(false);
      setForm({ startDate: '', endDate: '', reason: '', leaveType: 'ANNUAL' });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'APPROVED') return styles.active;
    if (status === 'REJECTED') return styles.inactive;
    return styles.on_leave;
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Leaves</h1>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>+ Apply Leave</button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {loading ? <p>Loading...</p> : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type</th><th>Start Date</th><th>End Date</th>
                  <th>Days</th><th>Reason</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign:'center', padding:'24px', color:'#888'}}>No leave requests yet</td></tr>
                ) : leaves.map(leave => (
                  <tr key={leave.id}>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.totalDays}</td>
                    <td>{leave.reason}</td>
                    <td><span className={`${styles.badge} ${getStatusClass(leave.status)}`}>{leave.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showModal && (
          <div className={styles.overlay}>
            <div className={styles.modal}>
              <h2>Apply for Leave</h2>
              {error && <div className={styles.error}>{error}</div>}
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Start Date</label>
                    <input type="date" value={form.startDate}
                      onChange={e => setForm({...form, startDate: e.target.value})} required />
                  </div>
                  <div className={styles.field}>
                    <label>End Date</label>
                    <input type="date" value={form.endDate}
                      onChange={e => setForm({...form, endDate: e.target.value})} required />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Leave Type</label>
                  <select value={form.leaveType} onChange={e => setForm({...form, leaveType: e.target.value})}>
                    <option value="ANNUAL">Annual</option>
                    <option value="SICK">Sick</option>
                    <option value="CASUAL">Casual</option>
                    <option value="MATERNITY">Maternity</option>
                    <option value="PATERNITY">Paternity</option>
                    <option value="UNPAID">Unpaid</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Reason</label>
                  <input value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                  <button type="submit" className={styles.submitBtn}>Apply</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLeaves;