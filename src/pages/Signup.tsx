import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Storage } from '../lib/storage';
import { User, Mail, Lock } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await Storage.signup(formData.email, formData.password, formData.name);

            if (data.session) {
                navigate('/');
            } else {
                setSuccess(true);
            }
        } catch (err: any) {
            setError(err.message || 'অ্যাকাউন্ট খুলতে সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card">
                <div className="auth-header">
                    <img src="/logo.png" alt="Hissab Note" className="logo-icon large" />
                    <h1>{success ? 'সফল হয়েছে!' : 'নতুন অ্যাকাউন্ট'}</h1>
                    <p>{success ? 'আপনার অ্যাকাউন্টটি তৈরি করা হয়েছে' : 'আপনার ব্যবসার জন্য নতুন অ্যাকাউন্ট খুলুন'}</p>
                </div>

                {success ? (
                    <div className="success-message text-center">
                        <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 mb-6">
                            আপনার ইমেইল ঠিকানায় একটি ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। দয়া করে আপনার ইনবক্স চেক করে অ্যাকাউন্টটি ভেরিফাই করুন।
                        </div>
                        <Link to="/login" className="btn btn-primary w-full">লগইন করুন</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-badge mb-4">{error}</div>}
                        <div className="input-group">
                            <label className="label">নাম</label>
                            <div className="input-with-icon">
                                <User size={18} className="icon" />
                                <input type="text" className="input" placeholder="আপনার নাম" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="label">ইমেইল</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="icon" />
                                <input type="email" className="input" placeholder="email@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="label">পাসওয়ার্ড</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="icon" />
                                <input type="password" className="input" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full shadow-lg mt-4" disabled={loading}>
                            {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট খুলুন'}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login">লগইন করুন</Link>
                </div>
            </div>
            <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 1rem; }
        .auth-card { width: 100%; max-width: 400px; padding: 2.5rem; }
        .auth-header { text-align: center; margin-bottom: 2rem; }
        .logo-icon.large { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; object-fit: contain; }
        .input-with-icon { position: relative; }
        .input-with-icon .icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .input-with-icon .input { padding-left: 2.75rem; }
        .auth-footer { margin-top: 2rem; text-align: center; font-size: 0.875rem; }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
        .error-badge { background: #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; text-align: center; }
      `}</style>
        </div>
    );
};

export default Signup;
