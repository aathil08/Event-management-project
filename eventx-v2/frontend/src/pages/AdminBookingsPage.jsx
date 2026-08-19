import { useState, useEffect } from 'react';
import Icon from '../components/common/Icon';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { getAllBookings } from '../api/services';
import { formatDateShort } from '../utils/helpers';

const AdminBookingsPage = () => {
  const { toast, showToast, hideToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');

  useEffect(() => {
    getAllBookings().then(r=>setBookings(r.data.bookings)).catch(()=>showToast('Failed.','error')).finally(()=>setLoading(false));
  }, []);

  const filtered = filter==='All' ? bookings : bookings.filter(b=>b.status===filter);
  const confirmed = bookings.filter(b=>b.status==='Confirmed');
  const totalTickets = confirmed.reduce((s,b)=>s+b.tickets,0);

  return (
    <div style={{ paddingTop:36 }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:30, fontWeight:800, letterSpacing:-1 }}>All Bookings</h1>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, marginTop:5 }}>Monitor every ticket booking across all users.</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:28 }}>
        {[
          { label:'Total Bookings', value:bookings.length,  color:'#7C3AED', icon:'ticket' },
          { label:'Confirmed',      value:confirmed.length, color:'#22D3EE', icon:'check'  },
          { label:'Cancelled',      value:bookings.length-confirmed.length, color:'#EC4899', icon:'x' },
          { label:'Total Tickets',  value:totalTickets,     color:'#10B981', icon:'users'  },
        ].map(({label,value,color,icon}) => (
          <div key={label} style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'18px 20px', display:'flex', alignItems:'center', gap:12, transition:'all .3s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${color}33`; e.currentTarget.style.boxShadow=`0 8px 24px ${color}18`; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ width:40, height:40, borderRadius:11, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 14px ${color}25` }}>
              <Icon name={icon} size={17} color={color} />
            </div>
            <div>
              <div style={{ fontSize:26, fontWeight:800, fontFamily:'var(--font-head)', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.8, marginTop:4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:22 }}>
        {['All','Confirmed','Cancelled'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:'7px 18px', borderRadius:99, fontSize:12, fontWeight:600,
            background: filter===f ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.04)',
            border: filter===f ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: filter===f ? '#A78BFA' : 'rgba(255,255,255,0.4)',
            cursor:'pointer', transition:'all .2s',
          }}>{f}</button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign:'center', padding:80, color:'rgba(255,255,255,0.25)' }}>
          <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid rgba(124,58,237,0.3)', borderTopColor:'#7C3AED', margin:'0 auto 14px', animation:'spin 1s linear infinite' }} />
          Loading bookings...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, color:'rgba(255,255,255,0.25)' }}>
          No bookings found.
        </div>
      ) : (
        <div style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden' }}>
          {/* Header */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', padding:'12px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:1.2 }}>
            <span>User</span><span>Event</span><span>Tickets</span><span>Date</span><span>Status</span>
          </div>
          {filtered.map((b,i) => (
            <div key={b._id} className="fade-up" style={{
              display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr',
              padding:'14px 24px', alignItems:'center',
              borderBottom: i<filtered.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              animationDelay:`${i*0.03}s`, transition:'background .15s',
            }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.85)' }}>{b.user?.name||'—'}</div>
                <div style={{ color:'rgba(255,255,255,0.25)', fontSize:11, marginTop:2 }}>{b.user?.email||''}</div>
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:13, color:'rgba(255,255,255,0.7)' }}>{b.event?.title||'—'}</div>
                <div style={{ color:'rgba(255,255,255,0.25)', fontSize:11, marginTop:2 }}>{b.event?.date?formatDateShort(b.event.date):''}</div>
              </div>
              <div style={{ fontWeight:800, fontFamily:'var(--font-head)', background:'linear-gradient(135deg,#7C3AED,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', fontSize:17 }}>{b.tickets}</div>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>{formatDateShort(b.createdAt)}</div>
              <div>
                <span style={{ padding:'4px 12px', borderRadius:99, fontSize:11, fontWeight:700, background: b.status==='Confirmed'?'rgba(34,211,238,0.1)':'rgba(107,114,128,0.15)', color: b.status==='Confirmed'?'#22D3EE':'#6B7280', border:`1px solid ${b.status==='Confirmed'?'rgba(34,211,238,0.25)':'rgba(107,114,128,0.2)'}`, boxShadow: b.status==='Confirmed'?'0 0 8px rgba(34,211,238,0.2)':'none' }}>
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default AdminBookingsPage;
