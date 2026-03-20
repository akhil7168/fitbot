'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Dumbbell, TrendingUp, Menu, X, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'AI Coach', icon: MessageSquare },
  { href: '/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Zap size={22} color="#fff" />
          </div>
          <div>
            <div className="sidebar-title">FitBot</div>
            <div className="sidebar-subtitle">AI Fitness Coach</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="nav-icon" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{
            padding: '16px',
            background: 'rgba(0, 212, 255, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0, 212, 255, 0.1)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: 'var(--accent-primary)', fontWeight: 600 }}>
              <Zap size={14} />
              Powered by Gemini AI
            </div>
            Your personal AI fitness coach for workouts, nutrition & wellness.
          </div>
        </div>
      </aside>
    </>
  );
}
