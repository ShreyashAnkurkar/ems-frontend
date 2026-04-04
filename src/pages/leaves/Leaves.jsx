import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from '../../pages/employees/Employees.module.css';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    employeeId: '', startDate: '', endDate: '', reason: '', leaveType: 'ANNUAL'
  });

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/v1/leaves');
      setLeaves(res.data);
    } catch (err) {
      setError('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/v1/leaves', form);
      fetchLeaves();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/v1/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ employeeId: '', startDate: '', endDate: '', reason: '', leaveType: 'ANNUAL' });
    setError('');
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
          <h1>Leave Requests</h1>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>+ Apply Leave</button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {loading ? <p>Loading...</p> : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(leave => (
                  <tr key={leave.id}>
                    <td>{leave.employeeName}</td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.totalDays}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`${styles.badge} ${getStatusClass(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'PENDING' && (
                        <>
                          <button className={styles.editBtn}
                            onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}>
                            Approve
                          </button>
                          <button className={styles.deleteBtn}
                            onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}>
                            Reject
                          </button>
                        </>
                      )}
                    </td>
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
                <div className={styles.field}>
                  <label>Employee ID</label>
                  <input type="number" value={form.employeeId}
                    onChange={e => setForm({...form, employeeId: e.target.value})} required />
                </div>
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
                  <input value={form.reason}
                    onChange={e => setForm({...form, reason: e.target.value})} />
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
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

export default Leaves;
