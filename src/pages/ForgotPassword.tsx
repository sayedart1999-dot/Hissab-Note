import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Bell } from 'lucide-react';
import { Storage } from '../lib/storage';

type ResetStep = 'email' | 'success';

const ForgotPassword = () => {
    const [step, setStep] = useState<ResetStep>('email');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendResetLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await Storage.resetPassword(email);
            setStep('success');
        } catch (err: any) {
            setError(err.message || 'রিসেট মেইল পাঠাতে সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card">
                <div className="auth-header">
                    <img src="/logo.png" alt="Hissab Note" className="logo-icon large" />

                    {step === 'email' && (
                        <>
                            <h1>পাসওয়ার্ড ভুলে গেছেন?</h1>
                            <p>আপনার ইমেইল দিন, আমরা একটি গোপন রিসেট লিংক পাঠাবো</p>
                        </>
                    )}
                    {step === 'success' && (
                        <>
                            <div className="step-icon-wrapper success-pop"><Bell size={48} color="var(--primary)" /></div>
                            <h1>মেইল পাঠানো হয়েছে!</h1>
                            <p>আপনার ইমেইলে একটি পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। চেক করুন।</p>
                        </>
                    )}
                </div>

                {error && <div className="error-badge mb-4">{error}</div>}

                {step === 'email' && (
                    <form onSubmit={handleSendResetLink}>
                        <div className="input-group">
                            <label className="label">ইমেইল ঠিকানা</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="icon" />
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-full shadow-lg mt-4" disabled={loading}>
                            {loading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
                        </button>
                    </form>
                )}

                {step === 'success' && (
                    <div className="success-actions">
                        <Link to="/login" className="btn btn-secondary w-full">লগইন পেজে যান</Link>
                    </div>
                )}

                <Link to="/login" className="back-link">
                    <ArrowLeft size={16} /> লগইন পেজে ফিরুন
                </Link>
            </div>

            <style>{`
                .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 1rem; position: relative; overflow: hidden; }
                .auth-card { width: 100%; max-width: 420px; padding: 2.5rem; border-radius: 1.5rem; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); }
                .auth-header { text-align: center; margin-bottom: 2rem; }
                .logo-icon.large { width: 56px; height: 56px; border-radius: 14px; margin: 0 auto 1.5rem; object-fit: contain; }
                .auth-header h1 { font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700; color: #1e293b; }
                .auth-header p { color: #64748b; font-size: 0.93rem; }
                
                .step-icon-wrapper { margin: 0 auto 1.5rem; width: 64px; height: 64px; background: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                
                .input-with-icon { position: relative; }
                .input-with-icon .icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
                .input-with-icon .input { padding-left: 2.75rem; }
                
                .back-link { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; font-size: 0.875rem; color: #64748b; font-weight: 500; }
                .back-link:hover { color: var(--primary); }
                
                .w-full { width: 100%; }
                .mt-4 { margin-top: 1rem; }
                .mb-4 { margin-bottom: 1rem; }
                
                @keyframes pop { 0% { transform: scale(0.8); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                .success-pop { animation: pop 0.5s ease-out; }

                .error-badge {
                    background: #fee2e2;
                    color: #991b1b;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
