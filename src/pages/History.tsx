import { useState, useMemo, useEffect } from 'react';
import { Storage, type Account } from '../lib/storage';
import { Search, Edit2, Trash2, X, Save, AlertTriangle, PlusCircle, Printer, History as HistoryIcon } from 'lucide-react';

interface EditRow {
    id: string;
    isExisting: boolean;
    name: string;
    mobile: string;
    description: string;
    quantity: number;
    rate: number;
    paid: number;
    timestamp?: number;
}

const History = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRows, setEditRows] = useState<EditRow[]>([]);
    const [editDate, setEditDate] = useState('');
    const [deletingDate, setDeletingDate] = useState<string | null>(null);
    const [showDueOnly, setShowDueOnly] = useState(false);
    const [previewAccount, setPreviewAccount] = useState<Account | null>(null);

    const [companyInfo, setCompanyInfo] = useState({
        name: 'মেসার্স ভাই ভাই এন্টারপ্রাইজ',
        proprietor: 'প্রোপাইটর: মোঃ রফিকুল ইসলাম',
        mobile: 'মোবাইল: ০১৭০০-০০০০০০',
        address: 'নিউ মার্কেট, ঢাকা'
    });

    useEffect(() => {
        fetchAccounts();
        const savedInfo = localStorage.getItem('hissab_company_info');
        if (savedInfo) {
            setCompanyInfo(JSON.parse(savedInfo));
        }
    }, []);

    const updateCompanyInfo = (field: keyof typeof companyInfo, value: string) => {
        const newInfo = { ...companyInfo, [field]: value };
        setCompanyInfo(newInfo);
        localStorage.setItem('hissab_company_info', JSON.stringify(newInfo));
    };

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
        const filtered = accounts.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDue = showDueOnly ? (a.due > 0) : true;
            return matchesSearch && matchesDue;
        });

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
            accounts: groups[date].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        }));
    }, [accounts, searchTerm, showDueOnly]);

    const [originalIds, setOriginalIds] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    const openEditModalForDate = (date: string) => {
        const dateAccounts = accounts.filter(a => a.date === date);
        setEditDate(date);
        const rows = dateAccounts.map(a => ({
            id: a.id,
            isExisting: true,
            name: a.name,
            mobile: a.mobile || '',
            description: a.description || '',
            quantity: a.quantity || 1,
            rate: a.rate || a.total,
            paid: a.paid,
            timestamp: a.timestamp
        }));
        setEditRows(rows);
        setOriginalIds(rows.map(r => r.id));
        setIsEditModalOpen(true);
    };

    const addEditRow = () => {
        setEditRows([...editRows, {
            id: `new-${crypto.randomUUID()}`,
            isExisting: false,
            name: editRows[0]?.name || '',
            mobile: editRows[0]?.mobile || '',
            description: '',
            quantity: 1,
            rate: 0,
            paid: 0,
            timestamp: Date.now()
        }]);
    };

    const removeEditRow = (id: string) => {
        if (editRows.length > 0) {
            setEditRows(editRows.filter(r => r.id !== id));
        }
    };

    const updateEditRow = (id: string, field: keyof EditRow, value: string | number) => {
        setEditRows(editRows.map(r => r.id === id ? { ...r, [field]: value } : r));
    };


    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Identify rows to delete
            const currentIds = new Set(editRows.map(r => r.id));
            const idsToDelete = originalIds.filter(id => !currentIds.has(id));

            // Delete removed rows
            const deletePromises = idsToDelete.map(id => Storage.deleteAccount(id));

            // Save/Update remaining rows
            const updatePromises = editRows.map(row => {
                const total = (row.quantity || 1) * row.rate;

                return Storage.saveAccount({
                    id: row.id.startsWith('new-') ? crypto.randomUUID() : row.id,
                    name: row.name,
                    description: row.description || '',
                    quantity: row.quantity,
                    rate: row.rate,
                    mobile: row.mobile,
                    total: total,
                    paid: row.paid,
                    due: total - row.paid,
                    date: editDate,
                    timestamp: row.timestamp || Date.now()
                });
            });

            await Promise.all([...deletePromises, ...updatePromises]);
            await fetchAccounts();
            setIsEditModalOpen(false);
        } catch (error: any) {
            console.error("Update failed:", error);
            alert('সংরক্ষণ ব্যর্থ হয়েছে: ' + (error.message || 'Error'));
        } finally {
            setSaving(false);
        }
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
                <div className="flex items-center gap-4">
                    <button
                        className={`btn ${showDueOnly ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setShowDueOnly(!showDueOnly)}
                        style={{
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0 1.25rem',
                            fontWeight: 600,
                            border: showDueOnly ? 'none' : '1px solid var(--border)',
                            backgroundColor: showDueOnly ? 'var(--primary)' : 'white',
                            color: showDueOnly ? 'white' : 'var(--secondary)'
                        }}
                    >
                        <AlertTriangle size={18} className={showDueOnly ? 'text-white' : 'text-orange-500'} />
                        {showDueOnly ? 'সব হিসাব' : 'সব বাকি হিসাব'}
                    </button>
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
                                <table style={{ tableLayout: 'fixed', width: '100%', minWidth: '850px' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '15%' }}>নাম</th>
                                            <th style={{ width: '15%' }}>বিবরণ</th>
                                            <th style={{ width: '15%' }}>মোবাইল</th>
                                            <th style={{ width: '8%', textAlign: 'center' }}>পরিমাণ</th>
                                            <th style={{ width: '10%', textAlign: 'center' }}>দর</th>
                                            <th style={{ width: '10%', textAlign: 'right' }}>মোট</th>
                                            <th style={{ width: '10%', textAlign: 'right' }}>জমা</th>
                                            <th style={{ width: '10%', textAlign: 'right' }}>বাকি</th>
                                            <th style={{ width: '7%', textAlign: 'center' }}>প্রিন্ট</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dateAccounts.map((account) => (
                                            <tr key={account.id}>
                                                <td style={{ wordBreak: 'break-word' }}><strong>{account.name}</strong></td>
                                                <td style={{ wordBreak: 'break-word' }}>{account.description ? (account.description.includes(':::') ? account.description.split(':::')[0] : account.description) : '-'}</td>
                                                <td style={{ wordBreak: 'break-word' }}>{account.mobile || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>{account.quantity || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>{account.rate ? `৳${account.rate}` : '-'}</td>
                                                <td style={{ textAlign: 'right' }}>৳ {(Number(account.total) || 0).toLocaleString()}</td>
                                                <td className="text-success" style={{ textAlign: 'right' }}>৳ {(Number(account.paid) || 0).toLocaleString()}</td>
                                                <td className="text-danger" style={{ textAlign: 'right' }}>৳ {(Number(account.due) || 0).toLocaleString()}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        className="action-btn-sm"
                                                        onClick={() => setPreviewAccount(account)}
                                                        title="প্রিন্ট করুন"
                                                        style={{
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '4px',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '1px solid var(--border)',
                                                            background: 'white',
                                                            color: 'var(--primary)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Printer size={14} />
                                                    </button>
                                                </td>
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
                                    <div className="m-header-col col-mobile">মোবাইল নং</div>
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
                                                <div className="m-row-col col-mobile">
                                                    <input type="text" className="input sm" value={row.mobile} onChange={(e) => updateEditRow(row.id, 'mobile', e.target.value)} placeholder="মোবাইল" />
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
                                <button type="submit" className="btn btn-primary lg" disabled={saving}>
                                    <Save size={20} className="mr-2" />
                                    {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
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

            {previewAccount && (
                <div className="modal-overlay no-print-overlay">
                    <div className="invoice-modal card animate-slide-up">
                        <div className="invoice-header-actions no-print">
                            <h3 className="text-lg font-bold">মেমো প্রিভিউ</h3>
                            <div className="flex gap-2">
                                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                                    <Printer size={16} /> প্রিন্ট করুন
                                </button>
                                <button className="btn-close-subtle" onClick={() => setPreviewAccount(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="invoice-content" id="printable-area">
                            {/* Invoice Header */}
                            <div className="inv-header">
                                <div className="company-info">
                                    <input
                                        className="company-input-name"
                                        value={companyInfo.name}
                                        onChange={(e) => updateCompanyInfo('name', e.target.value)}
                                        placeholder="কোম্পানির নাম"
                                    />
                                    <input
                                        className="company-input-sub"
                                        value={companyInfo.proprietor}
                                        onChange={(e) => updateCompanyInfo('proprietor', e.target.value)}
                                        placeholder="প্রোপাইটর নাম"
                                    />
                                    <input
                                        className="company-input-sub"
                                        value={companyInfo.mobile}
                                        onChange={(e) => updateCompanyInfo('mobile', e.target.value)}
                                        placeholder="মোবাইল নম্বর"
                                    />
                                    <input
                                        className="company-input-address"
                                        value={companyInfo.address}
                                        onChange={(e) => updateCompanyInfo('address', e.target.value)}
                                        placeholder="ঠিকানা"
                                    />
                                </div>
                                <div className="inv-meta">
                                    <div className="meta-row">
                                        <span className="meta-label">তারিখ:</span>
                                        <span className="meta-value">{previewAccount.date}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">মেমো নং:</span>
                                        <span className="meta-value">#{previewAccount.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="inv-customer flex justify-between items-center" style={{ background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                                <div className="flex items-center">
                                    <span style={{ color: '#64748b', marginRight: '0.5rem' }}>নাম:</span>
                                    <strong style={{ fontSize: '1.1rem' }}>{previewAccount.name}</strong>
                                </div>
                                <div className="flex items-center">
                                    <span style={{ color: '#64748b', marginRight: '0.5rem' }}>মোবাইল:</span>
                                    <strong>{previewAccount.mobile || '____________________'}</strong>
                                </div>
                            </div>

                            {/* Items Table */}
                            <table className="inv-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%', textAlign: 'center' }}>নং</th>
                                        <th style={{ width: '45%', textAlign: 'left' }}>বিবরণ</th>
                                        <th style={{ width: '15%', textAlign: 'right' }}>পরিমাণ</th>
                                        <th style={{ width: '15%', textAlign: 'right' }}>দর</th>
                                        <th style={{ width: '15%', textAlign: 'right' }}>মোট</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: 'center' }}>1</td>
                                        <td style={{ textAlign: 'left' }}>{previewAccount.description ? (previewAccount.description.includes(':::') ? previewAccount.description.split(':::')[0] : previewAccount.description) : '-'}</td>
                                        <td style={{ textAlign: 'right' }}>{previewAccount.quantity || 1}</td>
                                        <td style={{ textAlign: 'right' }}>৳{(previewAccount.rate || previewAccount.total).toLocaleString()}</td>
                                        <td style={{ textAlign: 'right' }}>৳{(previewAccount.total).toLocaleString()}</td>
                                    </tr>
                                    {/* Fill empty rows for aesthetic */}
                                    {[1, 2, 3].map(i => (
                                        <tr key={i}><td colSpan={5} style={{ height: '2.5rem' }}></td></tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Footer Summary */}
                            <div className="inv-footer">
                                <div className="inv-notes">
                                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>নোট:</div>
                                    <p>ধন্যবাদ, আবার আসবেন।</p>
                                </div>
                                <div className="inv-totals">
                                    <div className="total-row">
                                        <span>মোট টাকা:</span>
                                        <span>৳ {previewAccount.total.toLocaleString()}</span>
                                    </div>
                                    <div className="total-row paid">
                                        <span>আজকের জমা:</span>
                                        <span>(-) ৳ {previewAccount.paid.toLocaleString()}</span>
                                    </div>
                                    <div className="total-row due">
                                        <span>বর্তমান বাকি:</span>
                                        <span>৳ {previewAccount.due.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="inv-signatures">
                                <div className="sig-box">ক্রেতার স্বাক্ষর</div>
                                <div className="sig-box">বিক্রেতার স্বাক্ষর</div>
                            </div>
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
                .modal-table-header { display: grid; grid-template-columns: 40px 1fr 1fr 1.2fr 60px 80px 80px 120px 40px; padding: 1rem; font-weight: 700; border-radius: 0.5rem 0.5rem 0 0; border: 1px solid var(--border); }
                .modal-row { display: grid; grid-template-columns: 40px 1fr 1fr 1.2fr 60px 80px 80px 120px 40px; padding: 1rem; gap: 0.75rem; align-items: center; border-left: 1px solid var(--border); border-right: 1px solid var(--border); }
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

                /* Invoice Modal Styles */
                .invoice-modal { width: 800px; max-width: 95%; max-height: 90vh; overflow-y: auto; padding: 0; background: white; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
                .invoice-header-actions { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
                .invoice-content { padding: 3rem; color: #1e293b; background: white; }
                
                .inv-header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 1.5rem; }
                
                /* Editable Company Info Styles */
                .company-info { display: flex; flex-direction: column; align-items: center; }
                .company-input-name { 
                    font-family: inherit; font-size: 1.75rem; font-weight: 700; color: var(--primary); text-align: center; 
                    border: none; outline: none; background: transparent; width: 100%; margin-bottom: 0.25rem; padding: 0.25rem;
                }
                .company-input-sub { 
                    font-family: inherit; font-size: 0.9rem; color: #475569; text-align: center; 
                    border: none; outline: none; background: transparent; width: 100%; margin: 0.1rem 0; padding: 0.15rem;
                }
                .company-input-address { 
                    font-family: inherit; font-size: 0.9rem; font-weight: 500; color: #475569; text-align: center; 
                    border: none; outline: none; background: transparent; width: 100%; margin-top: 0.1rem; padding: 0.15rem;
                }
                .company-input-name:focus, .company-input-sub:focus, .company-input-address:focus { background: rgba(0,0,0,0.02); border-radius: 4px; }
                
                .inv-meta { display: flex; justify-content: space-between; margin-top: 1.5rem; font-size: 0.9rem; }
                .meta-row { display: flex; gap: 0.5rem; }
                .meta-label { color: #64748b; }
                .meta-value { font-weight: 700; }
                
                .inv-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; table-layout: fixed; }
                .inv-table th { background: #f8fafc; padding: 0.75rem; border-bottom: 2px solid #e2e8f0; font-size: 0.85rem; text-transform: uppercase; color: #64748b; }
                .inv-table td { padding: 0.75rem; border-bottom: 1px solid #e2e8f0; font-size: 0.95rem; }
                
                .inv-footer { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4rem; }
                .inv-notes { flex: 1; padding-right: 2rem; font-size: 0.85rem; color: #64748b; }
                .inv-totals { width: 250px; }
                .total-row { display: flex; justify-content: space-between; padding: 0.35rem 0; font-size: 1rem; border-bottom: 1px solid #f1f5f9; }
                .total-row.paid { color: var(--success); font-weight: 600; }
                .total-row.due { border-top: 2px solid #000; margin-top: 0.5rem; padding-top: 0.5rem; font-weight: 800; font-size: 1.15rem; color: var(--danger); border-bottom: none; }
                
                .inv-signatures { display: flex; justify-content: space-between; margin-top: 5rem; }
                .sig-box { border-top: 1px solid #94a3b8; padding-top: 0.5rem; width: 150px; text-align: center; font-size: 0.85rem; color: #64748b; }

                .animate-slide-up { animation: slideUp 0.3s ease-out; }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                .btn-close-subtle { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0.4rem; border-radius: 0.5rem; transition: 0.2s; }
                .btn-close-subtle:hover { background: #fee2e2; color: var(--danger); }

                @media print {
                    body * { visibility: hidden; }
                    #printable-area, #printable-area * { visibility: visible; }
                    #printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; }
                    .no-print { display: none !important; }
                    .no-print-overlay { background: white !important; backdrop-filter: none !important; }
                    .invoice-modal { box-shadow: none !important; width: 100% !important; max-width: 100% !important; max-height: none !important; overflow: visible !important; }
                    .company-input-name, .company-input-sub, .company-input-address { border: none !important; background: transparent !important; }
                }
            `}</style>
        </div>
    );
};

export default History;
