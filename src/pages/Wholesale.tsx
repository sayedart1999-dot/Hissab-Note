import { useState, useMemo, useEffect } from 'react';
import { Storage, type WholesaleEntry } from '../lib/storage';
import { Plus, Truck, Edit2, Trash2, X, Minus, Calculator, Eye } from 'lucide-react';

const Wholesale = () => {
    const [entries, setEntries] = useState<WholesaleEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const data = await Storage.getWholesale();
            setEntries(data);
        } catch (error) {
            console.error('Error fetching wholesale data:', error);
        } finally {
            setLoading(false);
        }
    };

    const uniqueCustomerNames = useMemo(() => {
        const names = entries.map(e => e.customerName);
        return Array.from(new Set(names)).sort();
    }, [entries]);

    const findPreviousDue = (name: string) => {
        if (!name) return 0;
        const customerEntries = entries.filter(e => e.customerName.trim() === name.trim());
        if (customerEntries.length === 0) return 0;

        // Sort to get the absolute latest entry
        const sorted = [...customerEntries].sort((a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.id.localeCompare(a.id);
        });

        return sorted[0].remainingDue;
    };

    // Form State
    const [formData, setFormData] = useState({
        customerName: '',
        previousDue: 0,
        newAmount: 0,
        paidNow: 0,
        description: '',
        note: ''
    });
    const [formItems, setFormItems] = useState<{ id?: string; name: string; qty: number; rate: number }[]>([]);

    const groupedSummaries = useMemo(() => {
        const groups: Record<string, WholesaleEntry[]> = {};
        entries.forEach(entry => {
            if (!groups[entry.customerName]) groups[entry.customerName] = [];
            groups[entry.customerName].push(entry);
        });

        return Object.keys(groups).sort().map(name => {
            const customerEntries = groups[name].sort((a, b) => {
                const dateCompare = b.date.localeCompare(a.date);
                if (dateCompare !== 0) return dateCompare;
                // If dates are same, sort by ID (timestamp) to get the actual latest
                return b.id.localeCompare(a.id);
            });
            const oldestToNewest = [...customerEntries].reverse();

            return {
                customerName: name,
                latestEntry: customerEntries[0],
                allEntries: customerEntries,
                summary: {
                    date: customerEntries[0].date,
                    initialDue: oldestToNewest[0].previousDue,
                    totalNew: customerEntries.reduce((sum, e) => sum + e.newAmount, 0),
                    totalPaid: customerEntries.reduce((sum, e) => sum + e.paidNow, 0),
                    currentDue: customerEntries[0].remainingDue
                }
            };
        });
    }, [entries]);

    const stats = useMemo(() => {
        const outstanding = groupedSummaries.reduce((sum, item) => sum + item.summary.currentDue, 0);
        const totalPaid = entries.reduce((a, b) => a + b.paidNow, 0);
        const totalNew = entries.reduce((a, b) => a + b.newAmount, 0);

        return { outstanding, totalPaid, totalNew };
    }, [entries, groupedSummaries]);

    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let calculatedNewAmount = formData.newAmount;
            if (formItems.length > 0) {
                calculatedNewAmount = formItems.reduce((sum, item) => sum + (item.qty * item.rate), 0);
            }

            const remainingDue = (formData.previousDue + calculatedNewAmount) - formData.paidNow;
            const entry: WholesaleEntry = {
                ...formData,
                newAmount: calculatedNewAmount,
                items: formItems.map(item => ({ name: item.name, qty: item.qty, rate: item.rate })),
                id: editingId || crypto.randomUUID(),
                remainingDue,
                date: editingId ? entries.find(e => e.id === editingId)!.date : new Date().toISOString().split('T')[0]
            };

            await Storage.saveWholesale(entry);
            await fetchEntries();

            setShowAddForm(false);
            setEditingId(null);
            setFormData({ customerName: '', previousDue: 0, newAmount: 0, paidNow: 0, description: '', note: '' });
            setFormItems([]);
        } catch (error: any) {
            console.error('Error saving wholesale entry:', error);
            alert('হিসাব সংরক্ষণ করতে সমস্যা হয়েছে: ' + (error.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (entry: WholesaleEntry) => {
        setFormData({
            customerName: entry.customerName,
            previousDue: entry.previousDue,
            newAmount: entry.newAmount,
            paidNow: entry.paidNow,
            description: entry.description || '',
            note: entry.note || ''
        });
        setFormItems(entry.items || []);
        setEditingId(entry.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('আপনি কি এই এন্ট্রিটি ডিলিট করতে নিশ্চিত?')) {
            await Storage.deleteWholesale(id);
            fetchEntries();
        }
    };

    const addItem = () => setFormItems([...formItems, { name: '', qty: 1, rate: 0 }]);
    const updateItem = (index: number, field: keyof typeof formItems[0], value: any) => {
        const newItems = [...formItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormItems(newItems);
    };
    const removeItem = (index: number) => setFormItems(formItems.filter((_, i) => i !== index));

    const currentTotalNew = formItems.length > 0
        ? formItems.reduce((acc, i) => acc + (i.qty * i.rate), 0)
        : formData.newAmount;

    return (
        <div className="wholesale-page">
            <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            {/* Header */}
            <div className="page-header flex justify-between items-center mb-8">
                <div>
                    <h1 className="flex items-center">
                        <span className="header-icon-container">
                            <Truck size={18} />
                        </span>
                        পাইকারী হিসাব {loading && <span className="loading-spinner-small ml-2"></span>}
                    </h1>
                    <p className="text-muted mt-1">পাইকারী কাস্টমারদের লেনদেন ব্যবস্থাপনা</p>
                </div>
                {!showAddForm && (
                    <button className="btn btn-primary" onClick={() => {
                        setShowAddForm(true);
                        setEditingId(null);
                        setFormData({ customerName: '', previousDue: 0, newAmount: 0, paidNow: 0, description: '', note: '' });
                        setFormItems([]);
                    }}>
                        <Plus size={20} /> নতুন এন্ট্রি যোগ করুন
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="card summary-card">
                    <div className="summary-header">
                        <span className="summary-label">মোট পাওনা (আউটস্ট্যান্ডিং)</span>
                    </div>
                    <div className="summary-body">
                        <h3 className="amount-danger">৳ {stats.outstanding.toLocaleString()}</h3>
                        <p>সর্বমোট পাওনা</p>
                    </div>
                </div>
                <div className="card summary-card">
                    <div className="summary-header">
                        <span className="summary-label">সর্বমোট আদায়</span>
                    </div>
                    <div className="summary-body">
                        <h3 className="amount-success">৳ {stats.totalPaid.toLocaleString()}</h3>
                        <p>মোট ক্যাশ জমা</p>
                    </div>
                </div>
                <div className="card summary-card">
                    <div className="summary-header">
                        <span className="summary-label">সর্বমোট নতুন মাল</span>
                    </div>
                    <div className="summary-body">
                        <h3 className="amount-primary">৳ {stats.totalNew.toLocaleString()}</h3>
                        <p>মোট বিক্রিত মাল</p>
                    </div>
                </div>
            </div>

            {/* Enhanced Form */}
            {showAddForm && (
                <div className="card mb-10 form-card-container">
                    <div className="form-header-premium">
                        <div className="flex items-center gap-3">
                            <div className="form-icon-pill">
                                {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
                            </div>
                            <h3 className="font-bold text-lg">{editingId ? 'এন্ট্রি আপডেট করুন' : 'নতুন এন্ট্রি যোগ করুন'}</h3>
                        </div>
                        <button className="btn-close-subtle" onClick={() => setShowAddForm(false)} title="বন্ধ করুন">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="wholesale-modern-form">
                        {/* Section 1: Customer Information */}
                        <div className="form-section">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="input-group">
                                    <label className="label-light">কাস্টমারের নাম</label>
                                    <input
                                        type="text"
                                        className="input input-bold"
                                        placeholder="কাস্টমারের নাম লিখুন..."
                                        list="customer-suggestions"
                                        value={formData.customerName}
                                        onChange={e => {
                                            const name = e.target.value;
                                            setFormData({ ...formData, customerName: name, previousDue: findPreviousDue(name) });
                                        }}
                                        required
                                    />
                                    <datalist id="customer-suggestions">
                                        {uniqueCustomerNames.map(name => (
                                            <option key={name} value={name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="input-group">
                                    <label className="label-light">পূর্বের বাকি</label>
                                    <div className="input-readonly">
                                        <span className="currency-symbol">৳</span> {formData.previousDue.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Item Details */}
                        <div className="form-section bg-subtle">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="section-title">
                                    <Calculator size={16} /> মালের বিবরণ (ঐচ্ছিক)
                                </h4>
                                <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
                                    <Plus size={14} /> আইটেম যোগ করুন
                                </button>
                            </div>

                            <div className="items-list-container">
                                {formItems.length === 0 ? (
                                    <div className="empty-items-placeholder">
                                        কোন আইটেম যোগ করা হয়নি
                                    </div>
                                ) : (
                                    <div className="items-table-header grid grid-cols-12 gap-3 mb-2 px-2">
                                        <div className="col-span-6 label-xs">আইটেমের নাম</div>
                                        <div className="col-span-2 label-xs text-center">পরিমাণ</div>
                                        <div className="col-span-3 label-xs text-center">দর (টাকা)</div>
                                        <div className="col-span-1"></div>
                                    </div>
                                )}

                                {formItems.map((item, idx) => (
                                    <div key={idx} className="item-row-modern-container animate-slide-in">
                                        <span className="item-row-date">{editingId ? entries.find(e => e.id === editingId)?.date : new Date().toISOString().split('T')[0]}</span>
                                        <div className="item-row-modern grid grid-cols-12 gap-3">
                                            <div className="col-span-6">
                                                <input type="text" className="input input-sm" placeholder="আইটেম..." value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} />
                                            </div>
                                            <div className="col-span-2">
                                                <input type="number" className="input input-sm text-center" placeholder="0" value={item.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} />
                                            </div>
                                            <div className="col-span-3">
                                                <input type="number" className="input input-sm text-center" placeholder="0.00" value={item.rate} onChange={e => updateItem(idx, 'rate', Number(e.target.value))} />
                                            </div>
                                            <div className="col-span-1 flex justify-center items-center">
                                                <button type="button" className="btn-remove-item" onClick={() => removeItem(idx)} title="মুছে ফেলুন">
                                                    <Minus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: Billing & Totals */}
                        <div className="form-section">
                            <div className="billing-grid">
                                <div className="input-group">
                                    <label className="label-light">নতুন মাল (মোট টাকা)</label>
                                    <input
                                        type="number"
                                        className={`input input-bold ${formItems.length > 0 ? 'input-readonly-style' : 'input-active'}`}
                                        value={currentTotalNew}
                                        onChange={e => setFormData({ ...formData, newAmount: Number(e.target.value) })}
                                        readOnly={formItems.length > 0}
                                        required
                                    />
                                    {formItems.length > 0 && <span className="helper-text">* আইটেম লিস্ট থেকে হিসাব করা</span>}
                                </div>
                                <div className="input-group">
                                    <label className="label-light">আজকের জমা</label>
                                    <input
                                        type="number"
                                        className="input input-bold input-success-focus"
                                        placeholder="0.00"
                                        value={formData.paidNow}
                                        onChange={e => setFormData({ ...formData, paidNow: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="input-group due-field-compact">
                                    <label className="label-light text-right">বর্তমান পাওনা</label>
                                    <div className="input-total-due">
                                        <span className="currency-symbol">৳</span> {((formData.previousDue + currentTotalNew) - formData.paidNow).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Footer Actions */}
                        <div className="form-actions-premium">
                            <button type="button" className="btn btn-secondary-modern" onClick={() => setShowAddForm(false)} disabled={saving}>
                                বাতিল করুন
                            </button>
                            <button type="submit" className="btn btn-primary-modern" disabled={saving}>
                                {saving ? 'সংরক্ষণ হচ্ছে...' : (editingId ? 'হিসাব আপডেট করুন' : 'হিসাব সংরক্ষণ করুন')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Section */}
            <div className="wholesale-list">
                {groupedSummaries.length === 0 ? (
                    <div className="card empty-state-card">
                        <Truck size={40} className="empty-icon" />
                        <p>এখনো কোন এন্ট্রি নেই。 নতুন এন্ট্রি যোগ করতে উপরের বাটনে ক্লিক করুন。</p>
                    </div>
                ) : (
                    groupedSummaries.map(({ customerName, allEntries, summary }) => (
                        <div key={customerName} className="card customer-summary-card">
                            <div className="customer-card-header">
                                <h4 className="customer-name">
                                    <div className="avatar-small">👤</div> {customerName}
                                </h4>
                                <div className="card-actions">
                                    <div className="header-due-badge">
                                        <span className="due-label">মোট বাকি:</span>
                                        <span className="due-value">৳{summary.currentDue.toLocaleString()}</span>
                                    </div>
                                    <button
                                        className={`action-btn-view ${expandedCustomer === customerName ? 'active' : ''}`}
                                        onClick={() => setExpandedCustomer(expandedCustomer === customerName ? null : customerName)}
                                        title="বিস্তারিত দেখুন"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>

                            {expandedCustomer === customerName && (
                                <div className="customer-details-box animate-slide-in">
                                    <div className="details-header">
                                        <h5 className="details-title">লেনদেনের ইতিহাস</h5>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="summary-table">
                                            <thead>
                                                <tr>
                                                    <th>তারিখ</th>
                                                    <th>পূর্বের বাকি</th>
                                                    <th>নতুন মাল</th>
                                                    <th>জমা</th>
                                                    <th>বর্তমান বাকি</th>
                                                    <th style={{ width: '80px' }}>অ্যাকশন</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allEntries.map((entry) => (
                                                    <tr key={entry.id}>
                                                        <td className="date-cell">{entry.date}</td>
                                                        <td>৳ {entry.previousDue.toLocaleString()}</td>
                                                        <td className="amount-new">৳ {entry.newAmount.toLocaleString()}</td>
                                                        <td className="amount-paid">৳ {entry.paidNow.toLocaleString()}</td>
                                                        <td className="amount-due">৳ {entry.remainingDue.toLocaleString()}</td>
                                                        <td className="actions-cell">
                                                            <div className="flex gap-2 justify-center">
                                                                <button className="action-btn-sm" onClick={() => handleEdit(entry)} title="এডিট">
                                                                    <Edit2 size={12} />
                                                                </button>
                                                                <button className="action-btn-sm-delete" onClick={() => handleDelete(entry.id)} title="ডিলিট">
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .wholesale-page { width: 100%; margin: 0 auto; padding-bottom: 3rem; font-family: 'Hind Siliguri', sans-serif; }
                
                /* Typography & Colors */
                .amount-primary { color: var(--primary); }
                .amount-success { color: var(--success); }
                .amount-danger { color: var(--danger); }
                .label-light { font-weight: 300; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; display: block; }
                .label-xs { font-size: 0.75rem; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.025em; }
                .input-bold { font-weight: 700; }
                
                /* Layout Components */
                /* Dashboard-style Summary Cards */
                .summary-card { padding: 1.5rem; }
                .summary-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .summary-label { font-size: 0.875rem; font-weight: 300; color: var(--text-muted); }
                .summary-body h3 { font-size: 1.75rem; margin-bottom: 0.25rem; font-weight: 700; }
                .summary-body p { font-size: 0.75rem; color: var(--text-muted); }
                
                .grid-cols-12 { display: grid; grid-template-columns: repeat(12, 1fr); }
                .col-span-6 { grid-column: span 6 / span 6; }
                .col-span-3 { grid-column: span 3 / span 3; }
                .col-span-2 { grid-column: span 2 / span 2; }
                .col-span-1 { grid-column: span 1 / span 1; }

                /* Premium Form Styling */
                .form-card-container { padding: 0; overflow: hidden; border-radius: 1rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid var(--border); background: white; margin-bottom: 3.5rem; }
                .form-header-premium { padding: 0.75rem 1.5rem; background: #fafafa; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                .form-icon-pill { width: 36px; height: 36px; background: #eef2ff; color: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
                .btn-close-subtle { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0.4rem; border-radius: 0.5rem; transition: 0.2s; }
                .btn-close-subtle:hover { background: #fee2e2; color: var(--danger); }
                
                .wholesale-modern-form { padding: 0.25rem 1.5rem 1.25rem 1.5rem; }
                .form-section { border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem; margin-bottom: 1rem; }
                .form-section.bg-subtle { background: #f8fafc; margin: 0 -1.5rem 1rem -1.5rem; padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0; }
                .form-section.no-border { border-bottom: none; margin-bottom: 0.5rem; padding-bottom: 0; }
                
                .section-title { font-size: 0.875rem; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .billing-grid { display: grid; grid-template-columns: 1fr 1fr 0.75fr; gap: 1.5rem; align-items: flex-start; }
                .due-field-compact { justify-self: end; width: 100%; max-width: 220px; }
                .text-right { text-align: right; }
                
                .item-row-modern-container { margin-bottom: 0.5rem; display: flex; flex-direction: column; gap: 0.15rem; }
                .item-row-date { font-size: 0.65rem; color: var(--text-muted); font-weight: 500; padding-left: 0.25rem; }
                
                .input-readonly { 
                    padding: 0.625rem 0.875rem; 
                    background: #f1f5f9; 
                    border: 1px solid #e2e8f0; 
                    border-radius: var(--radius); 
                    font-weight: 700; 
                    color: #64748b; 
                    cursor: not-allowed; 
                    display: flex; 
                    align-items: center; 
                    gap: 0.25rem; 
                }
                .currency-symbol { opacity: 0.5; font-weight: 300; }
                
                .input-readonly-style { background: #f8fafc !important; color: #94a3b8 !important; border-style: dashed !important; cursor: not-allowed; }
                .input-success-focus:focus { border-color: var(--success); box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
                .input-total-due { 
                    background: #fff1f2; 
                    border: 1.5px solid #fecaca; 
                    padding: 0.5rem 0.875rem; 
                    border-radius: var(--radius); 
                    color: var(--danger); 
                    font-weight: 800; 
                    font-size: 1.15rem; 
                    height: 42px;
                    display: flex; 
                    align-items: center; 
                    justify-content: flex-end; 
                    gap: 0.5rem; 
                    line-height: 1;
                }
                
                .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
                .items-list-container { max-height: 300px; overflow-y: auto; padding-right: 0.5rem; }
                .empty-items-placeholder { text-align: center; padding: 2rem; color: #cbd5e1; border: 2px dashed #e2e8f0; border-radius: 0.75rem; font-style: italic; font-size: 0.875rem; }
                
                .btn-remove-item { background: #fff1f2; color: #f43f5e; border: 1px solid #fecaca; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
                .btn-remove-item:hover { background: var(--danger); color: white; border-color: var(--danger); transform: scale(1.1); }
                
                .helper-text { display: block; font-size: 0.7rem; color: #94a3b8; margin-top: 0.25rem; font-style: italic; }
                
                .form-actions-premium { display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border); padding: 1rem 1.5rem; background: #fafafa; margin: 1rem -1.5rem -1.5rem -1.5rem; }
                .btn-primary-modern { background: var(--primary); color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.2); }
                .btn-primary-modern:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(37,99,235,0.3); }
                .btn-secondary-modern { background: white; border: 1px solid var(--border); padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 500; color: #64748b; cursor: pointer; transition: 0.2s; }
                .btn-secondary-modern:hover { background: #f8fafc; border-color: #cbd5e1; }

                /* List View Refinement */
                .empty-state-card { text-align: center; padding: 4rem 2rem; border: 2px dashed var(--border); background: none; box-shadow: none; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .empty-icon { opacity: 0.2; }
                
                .customer-summary-card { padding: 0; overflow: hidden; border-radius: 1rem; margin-bottom: 1.5rem; background: white; border: 1px solid var(--border); }
                .customer-card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; background: #f8fafc; border-bottom: 1px solid var(--border); }
                .customer-name { margin: 0; font-size: 1.1rem; color: var(--text); display: flex; align-items: center; gap: 0.75rem; font-weight: 700; }
                .avatar-small { width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                
                .card-actions { display: flex; align-items: center; gap: 1rem; }
                
                .header-due-badge { 
                    display: flex; 
                    align-items: center; 
                    gap: 0.5rem; 
                    background: #fff1f2; 
                    padding: 0.25rem 0.75rem; 
                    border-radius: 2rem; 
                    border: 1px solid #fecaca;
                    margin-right: 0.5rem;
                }
                .due-label { font-size: 0.75rem; color: #991b1b; font-weight: 500; }
                .due-value { font-size: 1rem; color: var(--danger); font-weight: 800; }
                
                .action-btn-edit, .action-btn-delete, .action-btn-view { background: white; border: 1px solid #e2e8f0; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: 0.2s; }
                .action-btn-view:hover, .action-btn-view.active { color: var(--primary); border-color: var(--primary); background: #eff6ff; }
                .action-btn-edit:hover { color: var(--primary); border-color: var(--primary); background: #eff6ff; }
                .action-btn-delete:hover { color: var(--danger); border-color: var(--danger); background: #fef2f2; }
                
                .customer-details-box { border-top: 1px solid var(--border); background: #fafafa; }
                .details-header { padding: 0.75rem 1.25rem; border-bottom: 1px solid #f1f5f9; }
                .details-title { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
                
                .actions-cell { padding: 0.5rem !important; }
                .action-btn-sm, .action-btn-sm-delete { width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; background: white; cursor: pointer; color: #64748b; transition: 0.2s; }
                .action-btn-sm:hover { color: var(--primary); border-color: var(--primary); background: #eff6ff; }
                .action-btn-sm-delete:hover { color: var(--danger); border-color: var(--danger); background: #fef2f2; }
                
                .summary-table { width: 100%; border-collapse: collapse; }
                .summary-table th { background: #fff; padding: 0.75rem 1.25rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; border-bottom: 1px solid #f1f5f9; text-align: center; }
                .summary-table td { padding: 1rem 1.25rem; text-align: center; font-weight: 600; font-size: 1rem; }
                .summary-table .date-cell { font-size: 0.875rem; color: #64748b; font-weight: 400; }
                
                .amount-new { color: var(--primary); }
                .amount-paid { color: var(--success); }
                .amount-due { color: var(--danger); font-weight: 800; font-size: 1.1rem; }

                /* Animations */
                @keyframes slide-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
                
                @media (max-width: 768px) {
                    .grid-cols-3 { grid-template-columns: 1fr; gap: 1rem; }
                    .grid-cols-2 { grid-template-columns: 1fr; gap: 1rem; }
                    .item-row-modern { grid-template-columns: 1fr; gap: 0.5rem; padding: 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; }
                    .items-table-header { display: none; }
                }
                .ml-2 { margin-left: 0.5rem; }
                .loading-spinner-small { width: 14px; height: 14px; border: 2px solid #e2e8f0; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Wholesale;
