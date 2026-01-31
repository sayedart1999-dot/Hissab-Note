import { useState, useMemo, useEffect } from 'react';
import { Storage, type Account } from '../lib/storage';
import { Search, Edit2, Trash2, X, Save, AlertTriangle, PlusCircle, History as HistoryIcon } from 'lucide-react';

interface EditRow {
    id: string;
    isExisting: boolean;
    name: string;
    description: string;
    quantity: number;
    rate: number;
    paid: number;
}

const History = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRows, setEditRows] = useState<EditRow[]>([]);
    const [editDate, setEditDate] = useState('');
    const [deletingDate, setDeletingDate] = useState<string | null>(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await Storage.getAccounts();
            setAccounts(data || []);
        } catch (error) {
            console.error("History failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupedAccounts = useMemo(() => {
        const filtered = accounts.filter(a =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const groups: Record<string, Account[]> = {};
        filtered.forEach(account => {
            if (!groups[account.date]) {
                groups[account.date] = [];
            }
            groups[account.date].push(account);
        });

        const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

        return sortedDates.map(date => ({
            date,
            accounts: groups[date]
        }));
    }, [accounts, searchTerm]);

    const openEditModalForDate = (date: string) => {
        const dateAccounts = accounts.filter(a => a.date === date);
        setEditDate(date);
        setEditRows(dateAccounts.map(a => ({
            id: a.id,
            isExisting: true,
            name: a.name,
            description: a.description || '',
            quantity: 1,
            rate: a.total,
            paid: a.paid
        })));
        setIsEditModalOpen(true);
    };

    const addEditRow = () => {
        setEditRows([...editRows, {
            id: `new-${crypto.randomUUID()}`,
            isExisting: false,
            name: editRows[0]?.name || '',
            description: '',
            quantity: 1,
            rate: 0,
            paid: 0
        }]);
    };

    const removeEditRow = (id: string) => {
        if (editRows.length > 1) {
            setEditRows(editRows.filter(r => r.id !== id));
        }
    };

    const updateEditRow = (id: string, field: keyof EditRow, value: string | number) => {
        setEditRows(editRows.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const updates = editRows.map(row => {
            const total = (row.quantity || 1) * row.rate;
            return Storage.saveAccount({
                id: row.id.startsWith('new-') ? crypto.randomUUID() : row.id,
                name: row.name,
                description: row.description,
                total: total,
                paid: row.paid,
                due: total - row.paid,
                date: editDate
            });
        });

        await Promise.all(updates);
        fetchAccounts();
        setIsEditModalOpen(false);
    };

    const handleDeleteDate = async () => {
        if (deletingDate) {
            const dateAccounts = accounts.filter(a => a.date === deletingDate);
            await Promise.all(dateAccounts.map(account => Storage.deleteAccount(account.id)));
            fetchAccounts();
            setDeletingDate(null);
        }
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
        <div className="history-page">
            <div className="page-header flex justify-between items-center mb-8">
                <div>
                    <h1 className="flex items-center">
                        <span className="header-icon-container">
                            <HistoryIcon size={18} />
                        </span>
                        হিসাবের ইতিহাস
                    </h1>
                    <p className="text-muted mt-1">সব লেনদেনের বিস্তারিত তালিকা</p>
                </div>
                <div className="search-box">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="কাস্টমারের নাম দিয়ে খুঁজুন..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {groupedAccounts.length === 0 ? (
                <div className="card table-card">
                    <div className="empty-state">
                        <Search size={24} style={{ opacity: 0.2, marginRight: '1rem' }} />
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>কোন ফলাফল পাওয়া যায়নি</h3>
                    </div>
                </div>
            ) : (
                <div className="date-groups">
                    {groupedAccounts.map(({ date, accounts: dateAccounts }) => (
                        <div key={date} className="date-group card">
                            <div className="date-header">
                                <div className="date-header-left">
                                    📅 <span className="date-text">{date}</span>
                                </div>
                                <div className="date-header-actions">
                                    <button className="action-btn edit" onClick={() => openEditModalForDate(date)} title="এই তারিখের সব এন্ট্রি এডিট করুন">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => setDeletingDate(date)} title="এই তারিখের সব এন্ট্রি ডিলিট করুন">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>নাম</th>
                                            <th>বিবরণ</th>
                                            <th>মোট</th>
                                            <th>জমা</th>
                                            <th>বাকি</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dateAccounts.map((account) => (
                                            <tr key={account.id}>
                                                <td><strong>{account.name}</strong></td>
                                                <td>{account.description}</td>
                                                <td>৳ {(Number(account.total) || 0).toLocaleString()}</td>
                                                <td className="text-success">৳ {(Number(account.paid) || 0).toLocaleString()}</td>
                                                <td className="text-danger">৳ {(Number(account.due) || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="edit-modal-content card">
                        <div className="modal-header">
                            <h2>হিসাব আপডেট করুন</h2>
                            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="modal-body">
                            <div className="modal-date-section mb-6">
                                <label className="label">তারিখ</label>
                                <input
                                    type="date"
                                    className="input date-input"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="modal-table-container">
                                <div className="modal-table-header bg-slate-50">
                                    <div className="m-header-col col-sn">#</div>
                                    <div className="m-header-col col-name">নাম</div>
                                    <div className="m-header-col col-desc">বিবরণ</div>
                                    <div className="m-header-col col-qty">পরিমাণ</div>
                                    <div className="m-header-col col-rate">দর</div>
                                    <div className="m-header-col col-paid">জমা</div>
                                    <div className="m-header-col col-total">মোট ও বাকি</div>
                                    <div className="m-header-col col-action"></div>
                                </div>

                                <div className="modal-rows-container">
                                    {editRows.map((row, index) => {
                                        const total = (row.quantity || 1) * row.rate;
                                        const due = total - row.paid;
                                        return (
                                            <div key={row.id} className="modal-row border-b">
                                                <div className="m-row-col col-sn">{index + 1}</div>
                                                <div className="m-row-col col-name">
                                                    <input type="text" className="input sm" value={row.name} onChange={(e) => updateEditRow(row.id, 'name', e.target.value)} required />
                                                </div>
                                                <div className="m-row-col col-desc">
                                                    <input type="text" className="input sm" value={row.description} onChange={(e) => updateEditRow(row.id, 'description', e.target.value)} />
                                                </div>
                                                <div className="m-row-col col-qty">
                                                    <input type="number" className="input sm text-center" value={row.quantity || ''} onChange={(e) => updateEditRow(row.id, 'quantity', Number(e.target.value))} required />
                                                </div>
                                                <div className="m-row-col col-rate">
                                                    <input type="number" className="input sm text-center" value={row.rate || ''} onChange={(e) => updateEditRow(row.id, 'rate', Number(e.target.value))} required />
                                                </div>
                                                <div className="m-row-col col-paid">
                                                    <input type="number" className="input sm text-center" value={row.paid || ''} onChange={(e) => updateEditRow(row.id, 'paid', Number(e.target.value))} required />
                                                </div>
                                                <div className="m-row-col col-total">
                                                    <div className="modal-summary">
                                                        <span>মোট: {total}</span>
                                                        <span className="text-danger font-bold">বাকি: {due}</span>
                                                    </div>
                                                </div>
                                                <div className="m-row-col col-action">
                                                    <button type="button" className="btn-icon danger" onClick={() => removeEditRow(row.id)} disabled={editRows.length === 1}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button type="button" className="add-row-btn-modal" onClick={addEditRow}>
                                <PlusCircle size={18} className="mr-2" />
                                নতুন লাইন যোগ করুন
                            </button>

                            <div className="modal-footer mt-8">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>বাতিল</button>
                                <button type="submit" className="btn btn-primary lg">
                                    <Save size={20} className="mr-2" />
                                    পরিবর্তন সংরক্ষণ করুন
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingDate && (
                <div className="overlay mini">
                    <div className="overlay-content confirm-dialog card">
                        <AlertTriangle size={48} color="var(--danger)" />
                        <h3>আপনি কি নিশ্চিত?</h3>
                        <p>এই তারিখের সব এন্ট্রি ডিলিট হয়ে যাবে এবং আর ফিরে পাওয়া যাবে না।</p>
                        <div className="overlay-footer">
                            <button className="btn btn-secondary" onClick={() => setDeletingDate(null)}>না, থাক</button>
                            <button className="btn btn-danger" onClick={handleDeleteDate}>হ্যাঁ, ডিলিট করুন</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .history-page { width: 100%; }
                .history-page .empty-state { display: flex; align-items: center; justify-content: center; padding: 4rem 2rem; color: var(--text-muted); }
                .date-groups { display: flex; flex-direction: column; gap: 1.25rem; }
                .date-group { padding: 0; overflow: hidden; }
                .date-header { padding: 1rem 1.5rem; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 2px solid #e2e8f0; font-size: 1.125rem; font-weight: 700; color: var(--secondary); display: flex; align-items: center; justify-content: space-between; }
                .date-header-left { display: flex; align-items: center; gap: 0.5rem; }
                .date-header-actions { display: flex; gap: 0.5rem; }
                .date-text { color: var(--primary); }
                .search-box { position: relative; width: 350px; height: 40px; }
                .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--secondary); opacity: 0.6; pointer-events: none; }
                .search-box input { width: 100%; height: 100%; padding: 0 12px 0 40px; border: 1px solid var(--border); background: #fcfdfe; border-radius: 8px; font-size: 0.9375rem; transition: all 0.2s; }
                .search-box input:focus { outline: none; border-color: var(--primary); background: white; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08); }
                .text-success { color: var(--success); }
                .text-danger { color: var(--danger); }
                .action-btn { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: white; color: var(--secondary); transition: all 0.2s; }
                .action-btn.edit:hover { background: #eff6ff; color: var(--primary); border-color: var(--primary); }
                .action-btn.delete:hover { background: #fef2f2; color: var(--danger); border-color: var(--danger); }
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .edit-modal-content { width: 100%; max-width: 85rem; max-height: 90vh; display: flex; flex-direction: column; padding: 0; overflow: hidden; }
                .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: white; }
                .modal-body { padding: 2rem; overflow-y: auto; flex: 1; }
                .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border); padding-top: 2rem; }
                .modal-table-header { display: grid; grid-template-columns: 40px 1.2fr 1.2fr 80px 100px 100px 1.2fr 40px; padding: 1rem; font-weight: 700; border-radius: 0.5rem 0.5rem 0 0; border: 1px solid var(--border); }
                .modal-row { display: grid; grid-template-columns: 40px 1.2fr 1.2fr 80px 100px 100px 1.2fr 40px; padding: 1rem; gap: 0.75rem; align-items: center; border-left: 1px solid var(--border); border-right: 1px solid var(--border); }
                .modal-summary { font-size: 0.75rem; display: flex; flex-direction: column; background: #f8fafc; padding: 0.5rem; border-radius: 0.5rem; }
                .add-row-btn-modal { width: 100%; padding: 1.25rem; background: #f8fafc; border: 2px dashed var(--border); border-radius: 0 0 0.5rem 0.5rem; color: var(--primary); font-weight: 700; display: flex; align-items: center; justify-content: center; border-top: none; }
                .add-row-btn-modal:hover { background: #eff6ff; }
                .input.sm { padding: 0.4rem 0.6rem; font-size: 0.875rem; }
                .btn-icon { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: white; }
                .btn-icon.danger { color: var(--danger); border-color: #fee2e2; }
                .btn-icon.danger:hover { background: var(--danger); color: white; }
                .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 3000; }
                .confirm-dialog { max-width: 400px; text-align: center; display: flex; flex-direction: column; align-items: center; padding: 2.5rem; }
                .overlay-footer { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
            `}</style>
        </div>
    );
};

export default History;
