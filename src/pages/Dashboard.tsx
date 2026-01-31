import { useMemo, useState, useEffect } from 'react';
import { Storage, type Account } from '../lib/storage';
import { LayoutDashboard, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
    const [loading, setLoading] = useState(true);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const data = await Storage.getAccounts();
                setAccounts(data || []);
            } catch (error) {
                console.error("Dashboard failed to fetch:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const stats = useMemo(() => {
        if (!accounts || !accounts.length) {
            return { totalBalance: 0, totalPaid: 0, totalDue: 0, todaySale: 0, todayPaid: 0, todayDue: 0 };
        }

        const safeNumber = (val: any) => {
            const num = Number(val);
            return isNaN(num) ? 0 : num;
        };

        const totalBalance = accounts.reduce((acc, curr) => acc + safeNumber(curr.total), 0);
        const totalPaid = accounts.reduce((acc, curr) => acc + safeNumber(curr.paid), 0);
        const totalDue = accounts.reduce((acc, curr) => acc + safeNumber(curr.due), 0);

        const todayAccounts = accounts.filter(a => a.date === today);
        const todaySale = todayAccounts.reduce((acc, curr) => acc + safeNumber(curr.total), 0);
        const todayPaid = todayAccounts.reduce((acc, curr) => acc + safeNumber(curr.paid), 0);
        const todayDue = todayAccounts.reduce((acc, curr) => acc + safeNumber(curr.due), 0);

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
            const total = dayAccounts.reduce((sum, a) => sum + (Number(a.total) || 0), 0);
            const paid = dayAccounts.reduce((sum, a) => sum + (Number(a.paid) || 0), 0);
            const due = dayAccounts.reduce((sum, a) => sum + (Number(a.due) || 0), 0);

            // Format date for display (e.g., "Jan 31")
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

            <div className="grid grid-cols-3 gap-6 mb-8">
                <SummaryCard
                    title="মোট ব্যালেন্স"
                    amount={stats.totalBalance}
                    label="সর্বমোট হিসাব"
                    type="primary"
                />
                <SummaryCard
                    title="মোট জমা"
                    amount={stats.totalPaid}
                    label="সর্বমোট আদায়"
                    type="success"
                />
                <SummaryCard
                    title="মোট বাকি"
                    amount={stats.totalDue}
                    label="সর্বমোট পাওনা"
                    type="danger"
                />
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <SummaryCard
                    title="আজকের বিক্রি"
                    amount={stats.todaySale}
                    label="আজকের মোট হিসাব"
                    type="primary"
                />
                <SummaryCard
                    title="আজকের জমা"
                    amount={stats.todayPaid}
                    label="আজকের আদায়"
                    type="success"
                />
                <SummaryCard
                    title="আজকের বাকি"
                    amount={stats.todayDue}
                    label="আজকের পাওনা"
                    type="danger"
                />
            </div>

            <section className="chart-section">
                <div className="section-header flex items-center gap-2 mb-6">
                    <TrendingUp size={20} className="text-primary" />
                    <h3 className="font-bold">সাত দিনের লেনদেন চিত্র</h3>
                </div>

                <div className="card chart-card" style={{ height: '400px', padding: '1.5rem 1rem 1rem 0' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 13, fill: '#64748b' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickFormatter={(val) => `৳${val}`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                formatter={(value: any, name: any) => [`৳ ${Number(value).toLocaleString()}`, name]}
                            />
                            <Legend
                                iconType="circle"
                                wrapperStyle={{ paddingTop: '1rem' }}
                            />
                            <Bar
                                dataKey="total"
                                name="মোট বিক্রি"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                            <Bar
                                dataKey="paid"
                                name="জমা"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                            <Bar
                                dataKey="due"
                                name="বাকি"
                                fill="#ef4444"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

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
