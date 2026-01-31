import { useState, useEffect } from 'react';
import { Storage, type Task } from '../lib/storage';
import { Plus, CheckCircle2, Circle, ClipboardList, Edit2, Trash2, X } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        type: '', size: '', quantity: 1, rate: 0, total: 0, advance: 0, due: 0
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await Storage.getTasks();
            setTasks(data || []);
        } catch (error) {
            console.error("Tasks failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    const computedTotal = formData.quantity * formData.rate;
    const computedDue = computedTotal - formData.advance;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const taskData: Task = {
            ...formData,
            id: editingId || crypto.randomUUID(),
            total: computedTotal,
            due: computedDue,
            completed: editingId ? (tasks.find(t => t.id === editingId)?.completed || false) : false
        };
        await Storage.saveTask(taskData);
        fetchTasks();
        setShowAddForm(false);
        setEditingId(null);
        setFormData({ type: '', size: '', quantity: 1, rate: 0, total: 0, advance: 0, due: 0 });
    };

    const toggleTask = async (task: Task) => {
        const updated = { ...task, completed: !task.completed };
        await Storage.saveTask(updated);
        fetchTasks();
    };

    const handleEdit = (task: Task) => {
        setFormData({
            type: task.type,
            size: task.size,
            quantity: task.quantity,
            rate: task.rate,
            total: task.total,
            advance: task.advance || 0,
            due: task.due
        });
        setEditingId(task.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('আপনি কি এই কাজটি ডিলিট করতে নিশ্চিত?')) {
            try {
                await Storage.deleteTask(id);
                fetchTasks();
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

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
        <div className="tasks-page">
            <div className="page-header flex justify-between items-center mb-8">
                <div>
                    <h1 className="flex items-center">
                        <span className="header-icon-container">
                            <ClipboardList size={18} />
                        </span>
                        অসম্পূর্ণ কাজ
                    </h1>
                    <p className="text-muted mt-1">চলমান কাজের তালিকা ও ট্র্যাকিং</p>
                </div>
                {!showAddForm && (
                    <button className="btn btn-primary" onClick={() => {
                        setShowAddForm(true);
                        setEditingId(null);
                        setFormData({ type: '', size: '', quantity: 1, rate: 0, total: 0, advance: 0, due: 0 });
                    }}>
                        <Plus size={20} /> নতুন কাজ যোগ করুন
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="card mb-8">
                    <div className="card-header-flex">
                        <h3 className="card-title">{editingId ? 'কাজ এডিট করুন' : 'নতুন কাজ যোগ করুন'}</h3>
                        <button className="btn-close" onClick={() => {
                            setShowAddForm(false);
                            setEditingId(null);
                        }}><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSave} className="task-form">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="input-group">
                                <label className="label">কাজের ধরণ</label>
                                <input type="text" className="input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} placeholder="যেমন: ব্যানার প্রিন্ট" required />
                            </div>
                            <div className="input-group">
                                <label className="label">সাইজ/মাপ</label>
                                <input type="text" className="input" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} placeholder="যেমন: ১০ x ৪ ফিট" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            <div className="input-group">
                                <label className="label">পরিমাণ</label>
                                <input type="number" className="input" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} required />
                            </div>
                            <div className="input-group">
                                <label className="label">রেট</label>
                                <input type="number" className="input" value={formData.rate} onChange={e => setFormData({ ...formData, rate: Number(e.target.value) })} required />
                            </div>
                            <div className="input-group">
                                <label className="label">অগ্রিম</label>
                                <input type="number" className="input" value={formData.advance} onChange={e => setFormData({ ...formData, advance: Number(e.target.value) })} required />
                            </div>
                            <div className="input-group">
                                <label className="label">বাকী</label>
                                <div className="input input-readonly">৳ {computedDue.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => {
                                setShowAddForm(false);
                                setEditingId(null);
                            }}>বাতিল</button>
                            <button type="submit" className="btn btn-primary">{editingId ? 'আপডেট করুন' : 'যোগ করুন'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="tasks-sections">
                <section className="task-section">
                    <h3>চলমান কাজ ({pendingTasks.length})</h3>
                    <div className="task-list">
                        {pendingTasks.length === 0 ? (
                            <p className="empty-text">কোন চলমান কাজ নেই</p>
                        ) : (
                            pendingTasks.map(task => (
                                <div key={task.id} className="task-card card">
                                    <div className="task-info">
                                        <h4>{task.type}</h4>
                                        <span className="task-meta">{task.size} | {task.quantity} টি | {task.rate} টাকা করে</span>
                                        <div className="task-money">
                                            <span className="total">মোট: ৳{task.total.toLocaleString()}</span>
                                            <span className="due">বাকী: ৳{task.due.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="task-actions-stack">
                                        <button className="action-btn-mini edit" onClick={() => handleEdit(task)} title="এডিট">
                                            <Edit2 size={16} />
                                        </button>

                                        <button className="complete-toggle" onClick={() => toggleTask(task)} title="সম্পন্ন করুন">
                                            <Circle size={24} />
                                            <span>সম্পন্ন করুন</span>
                                        </button>

                                        <button className="action-btn-mini delete" onClick={() => handleDelete(task.id)} title="ডিলিট">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="task-section completed">
                    <h3>সম্পন্ন কাজ ({completedTasks.length})</h3>
                    <div className="task-list">
                        {completedTasks.length === 0 ? (
                            <p className="empty-text">কোন সম্পন্ন কাজ নেই</p>
                        ) : (
                            completedTasks.map(task => (
                                <div key={task.id} className="task-card card done">
                                    <div className="task-info">
                                        <h4>{task.type}</h4>
                                        <span className="task-meta">{task.size}</span>
                                    </div>
                                    <div className="task-actions-stack">
                                        <button className="action-btn-mini delete" onClick={() => handleDelete(task.id)} title="ডিলিট">
                                            <Trash2 size={16} />
                                        </button>
                                        <button className="complete-toggle success" onClick={() => toggleTask(task)}>
                                            <CheckCircle2 size={24} />
                                            <span>সম্পন্ন</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <style>{`
                .tasks-page { width: 100%; margin: 0 auto; }
                .task-form { padding: 0.5rem 0; }
                .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .card-title { font-size: 1.25rem; font-weight: 700; color: var(--text); }
                .btn-close { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 5px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .btn-close:hover { background: #fee2e2; color: var(--danger); }
                
                .tasks-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                @media (max-width: 1024px) { .tasks-sections { grid-template-columns: 1fr; } }

                .task-section h3 { margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
                .task-list { display: flex; flex-direction: column; gap: 1rem; }
                
                .task-card { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border-left: 4px solid var(--primary); position: relative; }
                .task-card.done { border-left-color: var(--success); opacity: 0.8; }
                
                .task-info h4 { font-size: 1.15rem; margin-bottom: 0.25rem; font-weight: 700; }
                .task-meta { font-size: 0.875rem; color: var(--text-muted); }
                .task-money { margin-top: 0.75rem; display: flex; gap: 1.25rem; font-size: 0.9375rem; font-weight: 700; }
                .task-money .due { color: var(--danger); }
                
                .task-actions-stack {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    padding-left: 1rem;
                    border-left: 1px solid var(--border);
                }

                .action-btn-mini {
                    background: none;
                    border: none;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: 0.2s;
                }

                .action-btn-mini.edit { color: var(--primary); }
                .action-btn-mini.edit:hover { background: #eff6ff; }
                
                .action-btn-mini.delete { color: #94a3b8; }
                .action-btn-mini.delete:hover { background: #fef2f2; color: var(--danger); }

                .complete-toggle { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    gap: 4px; 
                    background: none; 
                    border: none; 
                    color: #94a3b8; 
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .complete-toggle:hover { color: var(--primary); }
                .complete-toggle.success { color: var(--success); }
                .complete-toggle span { font-size: 0.7rem; font-weight: 700; }

                .input-readonly { background: #f8fafc; color: #64748b; font-weight: 700; display: flex; align-items: center; }

                .empty-text { text-align: center; padding: 3rem; color: var(--text-muted); border: 2px dashed var(--border); border-radius: 1rem; font-style: italic; }
                .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
            `}</style>
        </div>
    );
};

export default Tasks;
