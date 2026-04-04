import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from '../../pages/employees/Employees.module.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/v1/departments');
      setDepartments(res.data);
    } catch (err) {
      setError('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await api.put(`/v1/departments/${editingDept.id}`, form);
      } else {
        await api.post('/v1/departments', form);
      }
      fetchDepartments();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setForm({ name: dept.name, description: dept.description });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this department?')) {
      await api.delete(`/v1/departments/${id}`);
      fetchDepartments();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDept(null);
    setForm({ name: '', description: '' });
    setError('');
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Departments</h1>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>+ Add Department</button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {loading ? <p>Loading...</p> : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Total Employees</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => (
                  <tr key={dept.id}>
                    <td>{dept.id}</td>
                    <td>{dept.name}</td>
                    <td>{dept.description}</td>
                    <td>{dept.totalEmployees}</td>
                    <td>
                      <button className={styles.editBtn} onClick={() => handleEdit(dept)}>Edit</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(dept.id)}>Delete</button>
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
              <h2>{editingDept ? 'Edit Department' : 'Add Department'}</h2>
              {error && <div className={styles.error}>{error}</div>}
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label>Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className={styles.field}>
                  <label>Description</label>
                  <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                  <button type="submit" className={styles.submitBtn}>{editingDept ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;

