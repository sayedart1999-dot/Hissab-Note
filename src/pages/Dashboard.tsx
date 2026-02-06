import { useState, useMemo, useEffect } from 'react';
import { Storage, type Account, type Task } from '../lib/storage';
import { LayoutDashboard, TrendingUp, ClipboardList, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SummaryCard = ({ title, amount, label, type }: { title: string, amount: number, label: string, type: 'primary' | 'success' | 'danger' | 'warning' }) => {
    const colors = {
        primary: { text: '#2563eb', bg: '#eff6ff' },
        success: { text: '#10b981', bg: '#ecfdf5' },
        danger: { text: '#ef4444', bg: '#fef2f2' },
        warning: { text: '#f59e0b', bg: '#fffbeb' },
    };

    const config = colors[type];

    return (
        <div className="card summary-card">
            <div className="summary-header">
                <span className="summary-label">{title}</span>
            </div>
            <div className="summary-body">
                <h3 style={{ color: config.text }}>৳ {(Number(amount) || 0).toLocaleString()}</h3>
                <p>{label}</p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accountsData, tasksData] = await Promise.all([
                    Storage.getAccounts(),
                    Storage.getTasks()
                ]);
                setAccounts(accountsData || []);
                setTasks(tasksData || []);
            } catch (error) {
                console.error("Dashboard failed to fetch:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = useMemo(() => {
        if (!accounts || !accounts.length) {
            return { totalBalance: 0, totalPaid: 0, totalDue: 0, todaySale: 0, todayPaid: 0, todayDue: 0 };
        }

        const safeNumber = (val: any) => {
            const num = Number(val);
            return isNaN(num) ? 0 : num;
        };

        const totalBalance = accounts.reduce((acc: number, curr: Account) => acc + safeNumber(curr.total), 0);
        const totalPaid = accounts.reduce((acc: number, curr: Account) => acc + safeNumber(curr.paid), 0);
        const totalDue = accounts.reduce((acc: number, curr: Account) => acc + safeNumber(curr.due), 0);

        const todayAccounts = accounts.filter(a => a.date === today);
        const todaySale = todayAccounts.reduce((acc: number, curr: Account) => acc + safeNumber(curr.total), 0);
        const todayPaid = todayAccounts.reduce((acc: number, curr: Account) => acc + safeNumber(curr.paid), 0);
        const todayDue = todayAccounts.reduce((acc: number, curr: Account) => acc + safeNumber(curr.due), 0);

        return {
            totalBalance, totalPaid, totalDue,
            todaySale, todayPaid, todayDue
        };
    }, [accounts, today]);

    const chartData = useMemo(() => {
        if (!accounts || !accounts.length) return [];

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            const dayAccounts = accounts.filter(a => a.date === date);
            const total = dayAccounts.reduce((sum: number, a: Account) => sum + (Number(a.total) || 0), 0);
            const paid = dayAccounts.reduce((sum: number, a: Account) => sum + (Number(a.paid) || 0), 0);
            const due = dayAccounts.reduce((sum: number, a: Account) => sum + (Number(a.due) || 0), 0);

            const d = new Date(date);
            const label = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });

            return { date, label, total, paid, due };
        });
    }, [accounts]);

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

    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasksCount = tasks.filter(t => t.completed).length;
    const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1 className="flex items-center">
                    <span className="header-icon-container">
                        <LayoutDashboard size={18} />
                    </span>
                    ড্যাশবোর্ড
                </h1>
                <p className="text-muted mt-1">ব্যবসায়িক কার্যক্রমের সংক্ষিপ্তসার</p>
            </div>

            {/* Total Stats Row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <SummaryCard title="মোট ব্যালেন্স" amount={stats.totalBalance} label="সর্বমোট হিসাব" type="primary" />
                <SummaryCard title="মোট জমা" amount={stats.totalPaid} label="সর্বমোট আদায়" type="success" />
                <SummaryCard title="মোট বাকি" amount={stats.totalDue} label="সর্বমোট পাওনা" type="danger" />
            </div>

            {/* Today Recap row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <SummaryCard title="আজকের বিক্রি" amount={stats.todaySale} label="আজকের মোট হিসাব" type="primary" />
                <SummaryCard title="আজকের জমা" amount={stats.todayPaid} label="আজকের আদায়" type="success" />
                <SummaryCard title="আজকের বাকি" amount={stats.todayDue} label="আজকের পাওনা" type="danger" />
            </div>

            {/* Middle Row: Progress & Spotlight */}
            <div className="grid grid-cols-12 gap-6 mb-8">
                {/* Transaction Chart */}
                <div className="col-span-12 lg:col-span-8">
                    <section className="chart-section" style={{ marginTop: 0 }}>
                        <div className="section-header flex items-center justify-between gap-2 mb-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" />
                                <h3 className="font-bold">সাত দিনের লেনদেন চিত্র</h3>
                            </div>
                        </div>
                        <div className="card chart-card" style={{ height: '350px', padding: '1.5rem 1rem 1rem 0' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `৳${val}`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                        formatter={(value: any, name: any) => [`৳ ${Number(value).toLocaleString()}`, name === 'total' ? 'বিক্রি' : name === 'paid' ? 'জমা' : 'বাকি']}
                                    />
                                    <Bar dataKey="total" name="বিক্রি" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={15} />
                                    <Bar dataKey="paid" name="জমা" fill="#10b981" radius={[4, 4, 0, 0]} barSize={15} />
                                    <Bar dataKey="due" name="বাকি" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={15} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </div>

                {/* Work Tracker Spotlight */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="card h-full flex flex-col" style={{ padding: '1.5rem' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                                    <ClipboardList size={18} />
                                </div>
                                চলমান কাজ
                            </h3>
                            <Link to="/tasks" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                সব দেখুন <ArrowRight size={12} />
                            </Link>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-2xl font-black text-slate-800">
                                    {pendingTasks.length}
                                    <small className="text-xs font-normal text-slate-400 ml-1">বাকি</small>
                                </span>
                                <span className="text-xs font-bold text-slate-500">{progressPercent}% সম্পন্ন</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1">
                            {pendingTasks.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-50" />
                                    <p className="text-xs text-slate-400 italic">সব কাজ সম্পন্ন!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {pendingTasks.slice(0, 3).map(task => (
                                        <div key={task.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 hover:border-amber-200 transition-colors">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Clock size={16} className="text-amber-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-700 truncate">{task.type}</h4>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{task.size}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingTasks.length > 3 && (
                                        <p className="text-[10px] text-slate-400 text-center font-medium mt-1">
                                            আরও {pendingTasks.length - 3} টি কাজ বাকি আছে...
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <style>{`
                .dashboard-page h1 { font-size: 2.25rem; margin-bottom: 0.25rem; }
                .page-header { margin-bottom: 2rem; }
                .summary-card { padding: 1.5rem; }
                .summary-label { font-size: 0.875rem; font-weight: 300; color: var(--text-muted); margin-bottom: 1rem; display: block; }
                .summary-body h3 { font-size: 1.75rem; margin-bottom: 0.25rem; font-weight: 700; }
                .summary-body p { font-size: 0.75rem; color: var(--text-muted); }
                .chart-section { margin-top: 3rem; }
                .chart-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); }
            `}</style>
        </div>
    );
};

export default Dashboard;
