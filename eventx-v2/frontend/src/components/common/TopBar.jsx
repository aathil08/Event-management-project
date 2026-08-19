import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from './Icon';
import { getAllBookings, getMyBookings } from '../../api/services';
import { formatDateShort } from '../../utils/helpers';

const TopBar = ({ search, onSearch }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [open, setOpen]                   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(false);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (user?.role === 'admin' ? getAllBookings() : getMyBookings())
      .then(r => setNotifications((r.data.bookings || []).slice(0, 6)))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    const h = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div style={{
      position: 'sticky', top: 0,
      height: 60,
      background: 'rgba(11,15,25,0.75)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      zIndex: 50,
      display: 'flex', alignItems: 'center',
      padding: '0 32px', gap: 16,
    }}>
      {/* Search */}
      <div style={{
        flex: 1, maxWidth: 380,
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '0 14px', height: 38,
        transition: 'border-color .2s',
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
        onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
      >
        <Icon name="search" size={15} color="rgba(255,255,255,0.25)" />
        <input
          value={search} onChange={e => onSearch(e.target.value)}
          placeholder="Search events..."
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: '#F0F4FF', fontSize: 13, flex: 1,
          }}
        />
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>{today}</span>

        {/* Bell */}
        <div ref={panelRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(o => !o)}
            title="Notifications"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: open ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${open ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .2s', position: 'relative',
              boxShadow: open ? '0 0 14px rgba(124,58,237,0.25)' : 'none',
            }}
          >
            <Icon name="bell" size={16} color={open ? '#A78BFA' : 'rgba(255,255,255,0.45)'} />
            <span style={{
              position: 'absolute', top: 8, right: 8,
              width: 6, height: 6, borderRadius: '50%',
              background: '#EC4899',
              boxShadow: '0 0 8px rgba(236,72,153,0.8)',
            }} />
          </button>

          {open && (
            <div className="fade-in" style={{
              position: 'absolute', top: 44, right: 0,
              width: 330,
              background: 'rgba(15,20,32,0.95)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
              overflow: 'hidden',
              zIndex: 200,
            }}>
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>
                  {user?.role === 'admin' ? '🔔 Recent Bookings' : '🎟️ My Bookings'}
                </span>
                <button onClick={() => { setOpen(false); navigate(user?.role === 'admin' ? '/admin/bookings' : '/bookings'); }}
                  style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  View All →
                </button>
              </div>

              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ padding: '30px 0', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading...</div>
                ) : notifications.length === 0 ? (
                  <div style={{ padding: '30px 0', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No bookings yet.</div>
                ) : notifications.map((b, i) => (
                  <div key={b._id} onClick={() => { setOpen(false); navigate(user?.role === 'admin' ? '/admin/bookings' : '/bookings'); }}
                    style={{
                      padding: '12px 18px',
                      borderBottom: i < notifications.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: 'pointer', transition: 'background .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800, color: '#fff',
                    }}>
                      {(b.user?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                        {user?.role === 'admin' ? (
                          <>{b.user?.name} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>booked</span> <span style={{ color: '#A78BFA' }}>{b.tickets} ticket{b.tickets > 1 ? 's' : ''}</span></>
                        ) : (
                          <>{b.tickets} ticket{b.tickets > 1 ? 's' : ''} booked</>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {b.event?.title} · {formatDateShort(b.createdAt)}
                      </div>
                    </div>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: b.status === 'Confirmed' ? '#22D3EE' : '#6B7280', boxShadow: b.status === 'Confirmed' ? '0 0 8px rgba(34,211,238,0.6)' : 'none' }} />
                  </div>
                ))}
              </div>

              <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => { setOpen(false); navigate(user?.role === 'admin' ? '/admin/bookings' : '/bookings'); }}
                  style={{
                    width: '100%', background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(124,58,237,0.25)', color: '#A78BFA',
                    borderRadius: 10, padding: '9px', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', transition: 'all .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.22)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.12)'; }}
                >
                  {user?.role === 'admin' ? 'Go to All Bookings' : 'Go to My Tickets'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
