import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from './Employees.module.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', position: '', salary: '',
    joiningDate: '', departmentId: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/v1/employees');
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    const res = await api.get('/v1/departments');
    setDepartments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.put(`/v1/employees/${editingEmployee.id}`, form);
      } else {
        await api.post('/v1/employees', form);
      }
      fetchEmployees();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      position: emp.position,
      salary: emp.salary,
      joiningDate: emp.joiningDate,
      departmentId: departments.find(d => d.name === emp.departmentName)?.id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await api.delete(`/v1/employees/${id}`);
      fetchEmployees();
    }
};

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setForm({ firstName: '', lastName: '', email: '',
      phone: '', position: '', salary: '',
      joiningDate: '', departmentId: '' });
    setError('');
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Employees</h1>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>
            + Add Employee
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? <p>Loading...</p> : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{fontWeight: '600', color: '#1e3a5f'}}>{emp.firstName} {emp.lastName}</div>
                      <div style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>ID: #{emp.id}</div>
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.position}</td>
                    <td>{emp.departmentName}</td>
                    <td>₹{emp.salary?.toLocaleString()}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[emp.status?.toLowerCase()]}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.editBtn} onClick={() => handleEdit(emp)}>Edit</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(emp.id)}>Delete</button>
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
              <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
              {error && <div className={styles.error}>{error}</div>}
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>First Name</label>
                    <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
                  </div>
                  <div className={styles.field}>
                    <label>Last Name</label>
                    <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div className={styles.field}>
                    <label>Phone</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Position</label>
                    <input value={form.position} onChange={e => setForm({...form, position: e.target.value})} required />
                  </div>
                  <div className={styles.field}>
                    <label>Salary</label>
                    <input type="number" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} required />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Joining Date</label>
                    <input type="date" value={form.joiningDate} onChange={e => setForm({...form, joiningDate: e.target.value})} required />
                  </div>
                  <div className={styles.field}>
                    <label>Department</label>
                    <select value={form.departmentId} onChange={e => setForm({...form, departmentId: e.target.value})} required>
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                  <button type="submit" className={styles.submitBtn}>
                    {editingEmployee ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;

