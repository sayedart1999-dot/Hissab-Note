import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Storage } from '../lib/storage';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await Storage.login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message === 'Invalid login credentials') {
        setError('ইমেইল অথবা পাসওয়ার্ড সঠিক নয়');
      } else if (err.message.includes('Email not confirmed')) {
        setError('আপনার ইমেইলটি ভেরিফাই করা হয়নি। দয়া করে আপনার ইনবক্স চেক করুন।');
      } else {
        setError('লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <img src="/logo.png" alt="Hissab Note" className="logo-icon large" />
          <h1>স্বাগতম</h1>
          <p>আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-badge">{error}</div>}

          <div className="input-group">
            <label className="label">ইমেইল</label>
            <div className="input-with-icon">
              <Mail size={18} className="icon" />
              <input
                type="email"
                className="input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="label">পাসওয়ার্ড</label>
            <div className="input-with-icon">
              <Lock size={18} className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-actions">
            <Link to="/forgot-password">পাসওয়ার্ড ভুলে গেছেন?</Link>
          </div>

          <button type="submit" className="btn btn-primary w-full shadow-lg" disabled={loading}>
            {loading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>

        <div className="auth-footer">
          অ্যাকাউন্ট নেই? <Link to="/signup">নতুন অ্যাকাউন্ট খুলুন</Link>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 1rem;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-icon.large {
          width: 48px;
          height: 48px;
          margin: 0 auto 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          object-fit: contain;
        }

        .auth-header h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: var(--text-muted);
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon .icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-with-icon .input {
          padding-left: 2.75rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: none;
          color: var(--text-muted);
        }

        .auth-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: var(--primary);
        }

        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .auth-footer a {
          color: var(--primary);
          font-weight: 700;
        }

        .error-badge {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }

        .w-full { width: 100%; }
      `}</style>
    </div>
  );
};

export default Login;
