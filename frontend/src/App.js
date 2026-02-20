import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import VerifyEmail from './pages/VerifyEmail';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

import ConnectBinance from "./pages/ConnectBinance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        <Route path="/connect-binance" element={<ConnectBinance />} />
      </Routes>
    </Router>
  );
}

export default App;
