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
  AlertCircle
} from 'lucide-react';
import { Storage } from '../../lib/storage';
import { supabase } from '../../lib/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: React.ElementType, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`sidebar-item ${active ? 'active' : ''}`}
  >
    <div className="active-indicator" />
    <span className="sidebar-icon-wrapper">
      <Icon size={16} />
    </span>
    <span>{label}</span>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
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

  // Watch for path changes to trigger redirects if needed
  useEffect(() => {
    if (!authLoading) {
      handleRedirects(user);
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
          background: #f8fafc;
        }

        .sidebar {
          width: 280px;
          background: #0f172a;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
          transition: transform 0.3s ease;
          color: white;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
          color: white;
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
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.4));
          animation: pulse-glow 3s infinite ease-in-out;
        }

        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 15px rgba(59, 130, 246, 1)); }
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          color: #94a3b8;
          border-radius: 12px;
          font-weight: 500;
          position: relative;
          transition: all 0.2s;
        }

        .sidebar-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .sidebar-item.active {
          background: var(--primary);
          color: white;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .sidebar-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
        }

        .active-indicator {
          display: none;
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 4px;
          background: white;
          border-radius: 0 4px 4px 0;
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
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
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

        .header-user {
          font-size: 0.9375rem;
          color: var(--secondary);
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
