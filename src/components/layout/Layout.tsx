import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  ClipboardList,
  Truck,
  Settings,
  LogOut,
  Menu,
  X,
  AlertCircle,
  Bell
} from 'lucide-react';
import { Storage } from '../../lib/storage';
import { supabase } from '../../lib/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

const SidebarItem = ({ to, icon: Icon, label, active, badge }: { to: string, icon: React.ElementType, label: string, active: boolean, badge?: number }) => (
  <Link
    to={to}
    className={`sidebar-item ${active ? 'active' : ''}`}
  >
    {active && <div className="active-item-indicator" />}
    <span className="sidebar-icon-wrapper">
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    </span>
    <span className="nav-label">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="sidebar-badge">{badge}</span>
    )}
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const currentUser = await Storage.getUser();
        if (mounted) {
          setUser(currentUser);
          handleRedirects(currentUser);
        }
      } catch (err: any) {
        console.error("Auth init error:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    };

    initAuth();
    fetchPendingCount();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;

      if (session?.user) {
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email || ''
        };
        setUser(userData);
        handleRedirects(userData);
        fetchPendingCount();
      } else {
        setUser(null);
        handleRedirects(null);
      }
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Only run once on mount

  const fetchPendingCount = async () => {
    try {
      const tasks = await Storage.getTasks();
      const count = (tasks || []).filter(t => !t.completed).length;
      setPendingCount(count);
    } catch (err) {
      console.error("Failed to fetch pending count:", err);
    }
  };

  // Watch for path changes to trigger redirects and update notification count
  useEffect(() => {
    if (!authLoading) {
      handleRedirects(user);
      fetchPendingCount();
    }
  }, [location.pathname, authLoading, user]);

  const handleRedirects = (currentUser: any) => {
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';
    if (!currentUser && !isAuthPage) {
      navigate('/login');
    } else if (currentUser && isAuthPage) {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await Storage.logout();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>সিস্টেম লোড করতে সমস্যা হচ্ছে</h1>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>আবার চেষ্টা করুন</button>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <div className="loading-spinner"></div>
        <style>{`
          .loading-spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  if (!user && isAuthPage) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
    { to: '/add', icon: PlusCircle, label: 'হিসাব যোগ করুন' },
    { to: '/history', icon: History, label: 'হিসাবের ইতিহাস' },
    { to: '/tasks', icon: ClipboardList, label: 'অসম্পূর্ণ কাজ' },
    { to: '/wholesale', icon: Truck, label: 'পাইকারী হিসাব' },
    { to: '/settings', icon: Settings, label: 'সেটিংস' },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span>Hissab Note</span>
          </div>
          <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-item logout-btn">
            <span className="sidebar-icon-wrapper">
              <LogOut size={16} />
            </span>
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="header-user">
            <span>স্বাগতম, <strong>{user?.name || 'User'}</strong></span>
          </div>

          <div className="header-spacer" style={{ flex: 1 }}></div>

          <div className="header-right-actions">
            <Link to="/tasks" className="notification-bell-container" title="অসম্পূর্ণ কাজ দেখুন">
              <div className="bell-wrapper">
                <Bell size={22} className="text-slate-500" />
                {pendingCount > 0 && (
                  <span className="bell-badge">{pendingCount}</span>
                )}
              </div>
            </Link>
          </div>
        </header>

        <div className="content-container">
          <div className="container">
            {children}
          </div>
        </div>
      </main>

      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: #fcfdfe;
        }

        .sidebar {
          width: 290px;
          background: #0a1120;
          border-right: 1px solid rgba(255,255,255,0.03);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
          box-shadow: 10px 0 50px rgba(0,0,0,0.2);
        }

        .sidebar-header {
          padding: 2.5rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 800;
          font-size: 1.5rem;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 0 12px rgba(59, 130, 246, 1));
          animation: logo-glow 3s infinite ease-in-out;
        }

        @keyframes logo-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 1)); transform: scale(1.02); }
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 0.9rem 1.25rem;
          color: #64748b;
          border-radius: 14px;
          font-weight: 500;
          position: relative;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
        }

        .sidebar-item:hover {
          color: #e2e8f0;
          padding-left: 1.5rem;
        }

        .sidebar-item.active {
          background: #2563eb;
          color: white;
          font-weight: 700;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
        }

        .active-item-indicator {
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: white;
          border-radius: 10px;
        }

        .nav-label {
          font-size: 1.05rem;
          letter-spacing: 0.01em;
        }

        .sidebar-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
        }

        .sidebar-badge {
          background: var(--danger);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1.5px 7px;
          border-radius: 6px;
          margin-left: auto;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
          animation: badge-pulse 2s infinite;
        }

        @keyframes badge-pulse {
          0% { transform: scale(1); box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(239, 68, 68, 0.6); }
          100% { transform: scale(1); box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
        }

        .sidebar-item.active .active-indicator {
          display: block;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .logout-btn {
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          color: #fca5a5;
          opacity: 0.8;
          margin-top: auto;
        }

        .logout-btn:hover {
          background: rgba(248, 113, 113, 0.1);
          color: #f87171;
          opacity: 1;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-header {
          height: 70px;
          background: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .mobile-toggle, .mobile-close {
          display: none;
          background: none;
          border: none;
          color: var(--secondary);
        }

        .header-right-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .notification-bell-container {
          position: relative;
          color: inherit;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 12px;
          transition: 0.2s;
          background: #f8fafc;
        }

        .notification-bell-container:hover {
          background: #f1f5f9;
        }

        .bell-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bell-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--danger);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
        }

        .content-container {
          padding: 2rem 0;
          flex: 1;
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .main-content {
            margin-left: 0;
          }
          .mobile-toggle {
            display: block;
          }
          .mobile-close {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};
