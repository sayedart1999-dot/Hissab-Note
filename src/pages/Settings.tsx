import React, { useState, useEffect } from 'react';
import { Storage } from '../lib/storage';
import { User, Lock, LogOut, CheckCircle, Settings as SettingsIcon } from 'lucide-react';
import type { User as UserType } from '../lib/storage';
import { useNavigate, Link } from 'react-router-dom';

const Settings = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [passwordData, setPasswordData] = useState({ current: '', new: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const currentUser = await Storage.getUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            try {
                setIsUpdating(true);
                await Storage.updateProfile(user.name, user.email);
                setSuccess('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
                setTimeout(() => setSuccess(''), 3000);
            } catch (error: any) {
                console.error("Profile update error:", error);
                // We'll just show an error toast if we had one, but since we don't, we'll keep it simple
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.new.length < 6) {
            setPasswordError('নতুন পাসওয়ার্ড কমপক্ষে ৬টি অক্ষরের হতে হবে');
            return;
        }

        try {
            setIsUpdating(true);
            await Storage.updatePassword(passwordData.new);
            setPasswordSuccess('পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!');
            setPasswordData({ current: '', new: '' });
            setTimeout(() => setPasswordSuccess(''), 3000);
        } catch (error: any) {
            setPasswordError(error.message || 'পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = async () => {
        await Storage.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading-spinner"></div>
                <style>{`
                    .loading-spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="settings-page">
            <div className="page-header mb-8">
                <h1 className="flex items-center">
                    <span className="header-icon-container">
                        <SettingsIcon size={18} />
                    </span>
                    সেটিংস
                </h1>
                <p className="text-muted mt-1">আপনার প্রোফাইল এবং নিরাপত্তা ব্যবস্থাপনা</p>
            </div>

            <div className="settings-grid">
                <div className="card settings-card">
                    <div className="section-title">
                        <User size={20} />
                        <h3>ব্যক্তিগত তথ্য</h3>
                    </div>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="input-group">
                            <label className="label">আপনার নাম</label>
                            <input
                                type="text"
                                className="input"
                                value={user?.name || ''}
                                onChange={e => user && setUser({ ...user, name: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">ইমেইল ঠিকানা</label>
                            <input
                                type="email"
                                className="input"
                                value={user?.email || ''}
                                onChange={e => user && setUser({ ...user, email: e.target.value })}
                            />
                        </div>
                        {success && <div className="success-msg"><CheckCircle size={16} /> {success}</div>}
                        <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                            {isUpdating ? 'আপডেট হচ্ছে...' : 'তথ্য আপডেট করুন'}
                        </button>
                    </form>
                </div>

                <div className="card settings-card">
                    <div className="section-title">
                        <Lock size={20} />
                        <h3>পাসওয়ার্ড পরিবর্তন</h3>
                    </div>
                    <form onSubmit={handlePasswordChange}>
                        <div className="input-group">
                            <label className="label">বর্তমান পাসওয়ার্ড</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={passwordData.current}
                                onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">নতুন পাসওয়ার্ড</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={passwordData.new}
                                onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                required
                            />
                        </div>
                        {passwordError && <div className="error-msg">{passwordError}</div>}
                        {passwordSuccess && <div className="success-msg"><CheckCircle size={16} /> {passwordSuccess}</div>}
                        <div className="flex justify-between items-center mt-2">
                            <button type="submit" className="btn btn-secondary" disabled={isUpdating}>
                                {isUpdating ? 'আপডেট হচ্ছে...' : 'পাসওয়ার্ড আপডেট করুন'}
                            </button>
                            <Link to="/forgot-password" title="পাসওয়ার্ড ভুলে গেছেন?" className="forgot-password-link">পাসওয়ার্ড ভুলে গেছেন?</Link>
                        </div>
                    </form>
                </div>

                <div className="card settings-card danger-zone">
                    <div className="section-title">
                        <LogOut size={20} />
                        <h3>অ্যাকাউন্ট</h3>
                    </div>
                    <p>আপনি আপনার অ্যাকাউন্ট থেকে লগআউট করতে পারেন।</p>
                    <button onClick={handleLogout} className="btn btn-danger w-full mt-4">লগআউট করুন</button>
                </div>
            </div>

            <style>{`
        .settings-page { max-width: 900px; margin: 0 auto; }
        .settings-grid { display: flex; flex-direction: column; gap: 2rem; }
        
        .settings-card { padding: 2rem; }
        .section-title { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
        .section-title h3 { font-size: 1.125rem; }

        .success-msg { 
          display: flex; align-items: center; gap: 0.5rem; 
          background: #d1fae5; color: #065f46; 
          padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .error-msg { 
          background: #fee2e2; color: #991b1b; 
          padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .danger-zone { border-color: #fee2e2; }
        .mt-4 { margin-top: 1rem; }
        .w-full { width: 100%; }

        .forgot-password-link {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          transition: color 0.2s;
        }
        .forgot-password-link:hover {
          color: var(--primary-hover);
        }
      `}</style>
        </div>
    );
};

export default Settings;
