import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    });

    return () => unsub();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate('/signin');
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '50px auto', textAlign: 'center' }}>
        <h2>Dashboard</h2>

        {/* Buttons Section */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={handleLogout}
            style={{
              padding: 10,
              marginRight: 10,
              background: '#2f2f2f',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>

          <Link to="/connect-binance">
            <button
              style={{
                padding: 10,
                background: '#f0b90b',
                color: 'black',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              Connect Binance
            </button>
          </Link>
        </div>

        <h3>All Users:</h3>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map(user => (
            <li
              key={user.id}
              style={{ padding: 10, borderBottom: '1px solid #ccc' }}
            >
              {user.email}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Dashboard;