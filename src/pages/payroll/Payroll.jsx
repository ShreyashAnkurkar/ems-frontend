import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from '../../pages/employees/Employees.module.css';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ employeeId: '', payMonth: '', payYear: '' });

  useEffect(() => { fetchPayrolls(); }, []);

  const fetchPayrolls = async () => {
    try {
      const res = await api.get('/v1/payrolls');
      setPayrolls(res.data);
    } catch (err) {
      setError('Failed to fetch payrolls');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/v1/payrolls', form);
      fetchPayrolls();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await api.put(`/v1/payrolls/${id}/mark-paid`);
      fetchPayrolls();
    } catch (err) {
      setError('Failed to mark as paid');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ employeeId: '', payMonth: '', payYear: '' });
    setError('');
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Payroll</h1>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>+ Generate Payroll</button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {loading ? <p>Loading...</p> : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month/Year</th>
                  <th>Basic</th>
                  <th>HRA</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map(p => (
                  <tr key={p.id}>
                    <td>{p.employeeName}</td>
                    <td>{months[p.payMonth - 1]} {p.payYear}</td>
                    <td>₹{p.basicSalary?.toLocaleString()}</td>
                    <td>₹{p.hra?.toLocaleString()}</td>
                    <td>₹{p.allowances?.toLocaleString()}</td>
                    <td>₹{p.deductions?.toLocaleString()}</td>
                    <td><strong>₹{p.netSalary?.toLocaleString()}</strong></td>
                    <td>
                      <span className={`${styles.badge} ${p.status === 'PAID' ? styles.active : styles.on_leave}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.status === 'GENERATED' && (
                        <button className={styles.editBtn} onClick={() => handleMarkPaid(p.id)}>
                          Mark Paid
                        </button>
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
              <h2>Generate Payroll</h2>
              {error && <div className={styles.error}>{error}</div>}
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label>Employee ID</label>
                  <input type="number" value={form.employeeId}
                    onChange={e => setForm({...form, employeeId: e.target.value})} required />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Month (1-12)</label>
                    <input type="number" min="1" max="12" value={form.payMonth}
                      onChange={e => setForm({...form, payMonth: e.target.value})} required />
                  </div>
                  <div className={styles.field}>
                    <label>Year</label>
                    <input type="number" value={form.payYear}
                      onChange={e => setForm({...form, payYear: e.target.value})} required />
                  </div>
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                  <button type="submit" className={styles.submitBtn}>Generate</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;
