import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from './Icon';

export const SIDEBAR_WIDTH = 220;

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminNav = [
    { to: '/',               label: 'Explore',       icon: 'home'   },
    { to: '/dashboard',      label: 'Dashboard',     icon: 'layout' },
    { to: '/admin/bookings', label: 'All Bookings',  icon: 'ticket' },
  ];
  const userNav = [
    { to: '/',         label: 'Explore',    icon: 'home'   },
    { to: '/bookings', label: 'My Tickets', icon: 'ticket' },
  ];
  const navItems = user?.role === 'admin' ? adminNav : userNav;

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: SIDEBAR_WIDTH,
      background: 'rgba(11,15,25,0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      zIndex: 100,
      display: 'flex', flexDirection: 'column',
      padding: '0',
    }}>
      {/* Logo */}
      <div style={{ padding: '26px 22px 20px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 18px rgba(124,58,237,0.5)',
          flexShrink: 0,
        }}>
          <Icon name="star" size={17} color="#fff" />
        </div>
        <span style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 800, fontSize: 19,
          background: 'linear-gradient(135deg,#fff,rgba(255,255,255,0.7))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.3px',
        }}>EventX</span>
      </div>

      {/* Section label */}
      <div style={{ padding: '0 22px 10px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Navigation
        </span>
      </div>

      {/* Nav links */}
      <nav style={{ padding: '0 12px', flex: 1 }}>
        {navItems.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            title={label}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 12,
              marginBottom: 4, textDecoration: 'none',
              background: isActive ? 'rgba(124,58,237,0.18)' : 'transparent',
              border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
              color: isActive ? '#C4B5FD' : 'rgba(255,255,255,0.45)',
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              boxShadow: isActive ? '0 0 14px rgba(124,58,237,0.15) inset' : 'none',
              transition: 'all .2s ease',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: 99,
                    background: 'linear-gradient(180deg,#7C3AED,#EC4899)',
                    boxShadow: '0 0 8px rgba(124,58,237,0.8)',
                  }} />
                )}
                <Icon name={icon} size={17} color={isActive ? '#A78BFA' : 'rgba(255,255,255,0.3)'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom user card */}
      <div style={{ padding: '12px' }}>
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/dashboard', { state: { openCreate: true } })}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
              border: 'none', color: '#fff', borderRadius: 12,
              padding: '11px 0', fontSize: 13, fontWeight: 700,
              marginBottom: 10, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.4)'; e.currentTarget.style.transform = 'none'; }}
          >
            <Icon name="plus" size={15} color="#fff" /> New Event
          </button>
        )}

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '12px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: '#fff',
              boxShadow: '0 0 12px rgba(124,58,237,0.4)',
            }}>
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Guest'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                {user?.role === 'admin' ? '👑 Admin' : '👤 Member'}
              </div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)', borderRadius: 9,
            padding: '7px', fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <Icon name="logout" size={12} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
