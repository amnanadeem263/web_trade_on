import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Navbar() {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav style={{ padding: '10px', background: '#2f2f2f', color: 'white' }}>
      <Link to="/signup" style={{ marginRight: 15, color: 'white' }}>Sign Up</Link>
      <Link to="/signin" style={{ marginRight: 15, color: 'white' }}>Sign In</Link>
      <Link to="/dashboard" style={{ marginRight: 15, color: 'white' }}>Dashboard</Link>
      <button onClick={handleLogout} style={{ background: '#555', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
