import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Direct imports to skip lazy-loading issues
import Dashboard from './pages/Dashboard.tsx';
import AddAccount from './pages/AddAccount.tsx';
import History from './pages/History.tsx';
import Tasks from './pages/Tasks.tsx';
import Wholesale from './pages/Wholesale.tsx';
import Settings from './pages/Settings.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
    <div className="loading-spinner"></div>
    <style>{`
      .loading-spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddAccount />} />
            <Route path="/history" element={<History />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/wholesale" element={<Wholesale />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
