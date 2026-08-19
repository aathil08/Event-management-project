import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/common/Icon';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { getMyBookings, cancelBooking } from '../api/services';
import { formatDateShort } from '../utils/helpers';

const BookingsPage = () => {
  const { toast, showToast, hideToast } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');

  useEffect(() => {
    getMyBookings().then(r=>setBookings(r.data.bookings)).catch(()=>showToast('Failed to load.','error')).finally(()=>setLoading(false));
  }, []);

  const handleCancel = async id => {
    if(!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings(p=>p.map(b=>b._id===id?{...b,status:'Cancelled'}:b));
      showToast('Booking cancelled.','warning');
    } catch { showToast('Failed.','error'); }
  };

  const filtered = filter==='All' ? bookings : bookings.filter(b=>b.status===filter);
  const confirmed = bookings.filter(b=>b.status==='Confirmed');
  const totalTickets = confirmed.reduce((s,b)=>s+b.tickets,0);

  return (
    <div style={{ paddingTop:36 }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:30, fontWeight:800, letterSpacing:-1 }}>My Tickets</h1>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, marginTop:5 }}>All your event bookings in one place.</p>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:28 }}>
        {[
          { label:'Total Bookings', value:bookings.length,       color:'#7C3AED', icon:'ticket'   },
          { label:'Confirmed',      value:confirmed.length,      color:'#22D3EE', icon:'check'    },
          { label:'Tickets Held',   value:totalTickets,          color:'#EC4899', icon:'users'    },
          { label:'Cancelled',      value:bookings.length-confirmed.length, color:'#6B7280', icon:'x' },
        ].map(({label,value,color,icon}) => (
          <div key={label} style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'18px 20px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 14px ${color}25` }}>
              <Icon name={icon} size={17} color={color} />
            </div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, fontFamily:'var(--font-head)', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.8, marginTop:4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:22 }}>
        {['All','Confirmed','Cancelled'].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:'7px 18px', borderRadius:99, fontSize:12, fontWeight:600,
            background: filter===f ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.04)',
            border: filter===f ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: filter===f ? '#A78BFA' : 'rgba(255,255,255,0.4)',
            cursor:'pointer', transition:'all .2s',
          }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:80, color:'rgba(255,255,255,0.25)' }}>
          <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid rgba(124,58,237,0.3)', borderTopColor:'#7C3AED', margin:'0 auto 14px', animation:'spin 1s linear infinite' }} />
          Loading tickets...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, color:'rgba(255,255,255,0.25)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🎟️</div>
          <p style={{ fontWeight:600 }}>No bookings yet.</p>
          <button onClick={()=>navigate('/')} style={{ marginTop:16, background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', color:'#fff', borderRadius:12, padding:'11px 22px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
            Browse Events
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gap:12 }}>
          {filtered.map((b,i) => {
            const isOk = b.status==='Confirmed';
            return (
              <div key={b._id} className="fade-up" style={{
                background:'rgba(255,255,255,0.04)',
                backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
                border:`1px solid ${isOk?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)'}`,
                borderRadius:16, padding:'18px 22px',
                display:'flex', alignItems:'center', gap:18,
                opacity: isOk ? 1 : 0.55,
                animationDelay:`${i*0.05}s`,
                transition:'all .3s',
              }}
                onMouseEnter={e=>{ if(isOk){ e.currentTarget.style.borderColor='rgba(124,58,237,0.3)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.3)'; }}}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=isOk?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{ width:68, height:68, borderRadius:12, overflow:'hidden', flexShrink:0, border:'1px solid rgba(255,255,255,0.06)' }}>
                  <img src={b.event?.image||'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80'} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <h3 onClick={()=>b.event?._id&&navigate(`/events/${b.event._id}`)} style={{ fontSize:15, fontWeight:700, fontFamily:'var(--font-head)', color:'#F0F4FF', marginBottom:6, cursor:'pointer', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {b.event?.title||'Event'}
                  </h3>
                  <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                    {[['calendar',b.event?.date?formatDateShort(b.event.date):'—'],['clock',b.event?.time||'—'],['map',b.event?.location||'—']].map(([icon,text])=>(
                      <span key={icon} style={{ color:'rgba(255,255,255,0.3)', fontSize:12, display:'flex', alignItems:'center', gap:4 }}>
                        <Icon name={icon} size={12} color="#7C3AED" />{text}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign:'center', minWidth:56 }}>
                  <div style={{ fontSize:28, fontWeight:900, fontFamily:'var(--font-head)', background:'linear-gradient(135deg,#7C3AED,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>{b.tickets}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5, marginTop:3 }}>ticket{b.tickets>1?'s':''}</div>
                </div>
                <div style={{ textAlign:'right', minWidth:96 }}>
                  <span style={{ display:'block', padding:'4px 12px', borderRadius:99, fontSize:11, fontWeight:700, marginBottom:8, background: isOk?'rgba(34,211,238,0.1)':'rgba(107,114,128,0.15)', color: isOk?'#22D3EE':'#6B7280', border:`1px solid ${isOk?'rgba(34,211,238,0.25)':'rgba(107,114,128,0.2)'}`, boxShadow: isOk?'0 0 10px rgba(34,211,238,0.15)':'none' }}>
                    {b.status}
                  </span>
                  {isOk && (
                    <button onClick={()=>handleCancel(b._id)} style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.3)', borderRadius:8, padding:'5px 10px', fontSize:11, fontWeight:600, cursor:'pointer', transition:'all .2s' }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(236,72,153,0.35)'; e.currentTarget.style.color='#EC4899'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.3)'; }}
                    >Cancel</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default BookingsPage;
