import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import styles from '../employees/Employees.module.css';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/v1/employee/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div><Navbar /><div className={styles.container}>Loading...</div></div>;
  if (!profile) return <div><Navbar /><div className={styles.container}>Profile not found. Make sure your account is linked to an employee.</div></div>;

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}><h1>My Profile</h1></div>
        <div style={{background:'white', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', padding:'32px', maxWidth:'600px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'20px', marginBottom:'28px'}}>
            <div style={{width:'72px', height:'72px', borderRadius:'50%', background:'linear-gradient(135deg, #1e3a5f, #2d6a9f)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'24px', fontWeight:'700'}}>
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
            <div>
              <div style={{fontSize:'22px', fontWeight:'700', color:'#1e3a5f'}}>{profile.firstName} {profile.lastName}</div>
              <div style={{color:'#888', fontSize:'14px'}}>{profile.position}</div>
            </div>
          </div>
          {[
            ['Employee ID', `#${profile.id}`],
            ['Email', profile.email],
            ['Phone', profile.phone],
            ['Department', profile.departmentName],
            ['Joining Date', profile.joiningDate],
            ['Salary', `₹${profile.salary?.toLocaleString()}`],
            ['Status', profile.status],
          ].map(([label, value]) => (
            <div key={label} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f1f5f9', fontSize:'14px'}}>
              <span style={{color:'#64748b'}}>{label}</span>
              <span style={{color:'#1e3a5f', fontWeight:'500'}}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;