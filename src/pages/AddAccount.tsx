import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Storage } from '../lib/storage';
import { Trash2, Save, CheckCircle, PlusCircle } from 'lucide-react';

interface AccountRow {
    id: string;
    name: string;
    mobile: string;
    description: string;
    quantity: number;
    rate: number;
    paid: number;
    timestamp?: number;
}

const AddAccount = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [customerSuggestions, setCustomerSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const accounts = await Storage.getAccounts();
                const uniqueNames = Array.from(new Set(accounts.map(a => a.name))).sort();
                setCustomerSuggestions(uniqueNames);
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            }
        };
        fetchSuggestions();
    }, []);

    const [rows, setRows] = useState<AccountRow[]>(() => [
        { id: Date.now().toString(), name: '', mobile: '', description: '', quantity: 0, rate: 0, paid: 0 }
    ]);

    const addRow = () => {
        setRows([...rows, { id: Date.now().toString(), name: '', mobile: '', description: '', quantity: 0, rate: 0, paid: 0 }]);
    };

    const removeRow = (id: string) => {
        if (rows.length > 1) {
            if (window.confirm('আপনি কি এই লাইনটি ডিলিট করতে নিশ্চিত?')) {
                setRows(rows.filter(row => row.id !== id));
            }
        }
    };

    const updateRow = (id: string, field: keyof AccountRow, value: string | number) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validRows = rows.filter(row => row.name && (row.quantity * row.rate) > 0);

        if (validRows.length === 0) {
            alert('অন্তত একটি সঠিক হিসাব প্রদান করুন।');
            return;
        }

        try {
            setLoading(true);
            const baseTimestamp = Date.now();
            const savePromises = validRows.map((row, index) => {
                const total = row.quantity * row.rate;

                return Storage.saveAccount({
                    id: crypto.randomUUID(),
                    name: row.name,
                    description: row.description || '',
                    total: total,
                    paid: row.paid,
                    due: total - row.paid,
                    date: date,
                    quantity: row.quantity,
                    rate: row.rate,
                    mobile: row.mobile,
                    timestamp: baseTimestamp + index // Ensure sequential order
                });
            });

            await Promise.all(savePromises);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/history');
            }, 2000);
        } catch (error) {
            console.error("Failed to save accounts:", error);
            alert('হিসাব সংরক্ষণ করতে সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="container max-w-4xl py-20 px-6">
                <div className="card text-center py-16">
                    <div className="success-icon-container">
                        <CheckCircle size={80} className="text-success animate-bounce-subtle" />
                    </div>
                    <h2 className="text-2xl font-bold mt-6">সফলভাবে সংরক্ষিত হয়েছে!</h2>
                    <p className="text-muted mt-2">আপনাকে হিসাবের ইতিহাস পাতায় নিয়ে যাওয়া হচ্ছে...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="add-account-container">
            <div className="page-header flex justify-between items-center mb-8">
                <div>
                    <h1 className="flex items-center text-3xl font-bold text-slate-800">
                        <span className="header-icon-container">
                            <PlusCircle size={18} />
                        </span>
                        নতুন হিসাব যোগ করুন
                    </h1>
                    <p className="text-muted mt-1">কাস্টমারের নতুন লেনদেনের তথ্য প্রদান করুন</p>
                </div>
                <div className="date-picker-mini">
                    <input
                        type="date"
                        className="input-mini-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Details Section */}
                <div className="card details-card p-0 overflow-hidden">
                    <div className="details-header bg-slate-50 border-b">
                        <div className="header-col col-sn">#</div>
                        <div className="header-col col-name">কাস্টমারের নাম</div>
                        <div className="header-col col-desc">কাজের বিবরণ</div>
                        <div className="header-col col-mobile">মোবাইল নং</div>
                        <div className="header-col col-qty">পরিমাণ</div>
                        <div className="header-col col-rate">দর</div>
                        <div className="header-col col-paid">জমা</div>
                        <div className="header-col col-summary">সারসংক্ষেপ (বাকি)</div>
                        <div className="header-col col-action">অ্যাকশন</div>
                    </div>

                    <div className="rows-container">
                        {rows.map((row, index) => {
                            const total = row.quantity * row.rate;
                            const due = total - row.paid;
                            return (
                                <div key={row.id} className="detail-row border-b last:border-0">
                                    <div className="row-col col-sn">
                                        <span className="sn-badge">{index + 1}</span>
                                    </div>
                                    <div className="row-col col-name">
                                        <input
                                            type="text"
                                            className="row-input"
                                            list="customer-names"
                                            placeholder="নাম"
                                            value={row.name}
                                            onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="row-col col-desc">
                                        <input
                                            type="text"
                                            className="row-input"
                                            placeholder="বিবরণ"
                                            value={row.description}
                                            onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="row-col col-mobile">
                                        <input
                                            type="text"
                                            className="row-input"
                                            placeholder="মোবাইল"
                                            value={row.mobile}
                                            onChange={(e) => updateRow(row.id, 'mobile', e.target.value)}
                                        />
                                    </div>
                                    <div className="row-col col-qty">
                                        <input
                                            type="number"
                                            className="row-input text-center"
                                            placeholder="0"
                                            value={row.quantity || ''}
                                            onChange={(e) => updateRow(row.id, 'quantity', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="row-col col-rate">
                                        <input
                                            type="number"
                                            className="row-input text-center"
                                            placeholder="0"
                                            value={row.rate || ''}
                                            onChange={(e) => updateRow(row.id, 'rate', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="row-col col-paid">
                                        <input
                                            type="number"
                                            className="row-input text-center"
                                            placeholder="0"
                                            value={row.paid || ''}
                                            onChange={(e) => updateRow(row.id, 'paid', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="row-col col-summary">
                                        <div className="row-summary-box">
                                            <div className="summary-item">মোট: ৳{total.toLocaleString()}</div>
                                            <div className="summary-item due-text">বাকি: ৳{due.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="row-col col-action">
                                        <button
                                            type="button"
                                            className="delete-row-btn"
                                            onClick={() => removeRow(row.id)}
                                            disabled={rows.length === 1}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button type="button" className="add-row-trigger" onClick={addRow}>
                        <div className="add-row-inner">
                            <PlusCircle size={20} className="mr-2" />
                            নতুন লাইন যোগ করুন
                        </div>
                    </button>
                </div>

                {/* Save Section */}
                <div className="save-container">
                    <button type="submit" className="btn btn-primary w-full h-14 text-lg" disabled={loading}>
                        <Save size={20} className="mr-2" />
                        {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'সবগুলো হিসাব সংরক্ষণ করুন'}
                    </button>
                </div>
                <datalist id="customer-names">
                    {customerSuggestions.map((name, i) => (
                        <option key={i} value={name} />
                    ))}
                </datalist>
            </form>

            <style>{`
                .add-account-container {
                    width: 100%;
                    margin-top: 2rem;
                }

                .input-mini-date {
                    padding: 0.5rem 1rem;
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    background: #fcfdfe;
                    color: var(--text);
                    font-family: inherit;
                    font-size: 0.9375rem;
                    outline: none;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .input-mini-date:focus {
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
                }

                .details-header {
                    display: grid;
                    grid-template-columns: 50px 1.2fr 1.2fr 1.1fr 80px 100px 100px 1.2fr 60px;
                    padding: 0.75rem 1.5rem;
                    font-weight: 700;
                    color: var(--secondary);
                }

                .detail-row {
                    display: grid;
                    grid-template-columns: 50px 1.2fr 1.2fr 1.1fr 80px 100px 100px 1.2fr 60px;
                    padding: 1rem 1.5rem;
                    gap: 0.75rem;
                    align-items: center;
                }

                .row-input {
                    width: 100%;
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    padding: 0.5rem 0.75rem;
                }

                .sn-badge {
                    width: 24px;
                    height: 24px;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .row-summary-box {
                    padding: 0.5rem;
                    background: #f8fafc;
                    border-radius: 0.5rem;
                    font-size: 0.75rem;
                }
                .due-text { color: var(--danger); font-weight: 700; }

                .delete-row-btn {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0.5rem;
                    color: var(--danger);
                    background: white;
                    border: 1px solid #fee2e2;
                }
                .delete-row-btn:hover:not(:disabled) { background: var(--danger); color: white; }
                .delete-row-btn:disabled { opacity: 0.3; }

                .add-row-trigger {
                    width: 100%;
                    padding: 1.5rem;
                    background: white;
                    border: none;
                }
                .add-row-inner {
                    padding: 1rem;
                    border: 2px dashed var(--border);
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    font-weight: 700;
                }

                .success-icon-container {
                    background: #f0fdf4;
                    width: 120px;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    margin: 0 auto;
                }
            `}</style>
        </div>
    );
};

export default AddAccount;
