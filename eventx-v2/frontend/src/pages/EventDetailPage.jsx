import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/common/Icon';
import SeatBar from '../components/common/SeatBar';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import { fetchEventById, bookTickets, getMyBookings } from '../api/services';
import { formatDateShort, categoryColor } from '../utils/helpers';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [event,   setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(1);
  const [booking, setBooking] = useState(false);
  const [myBooked,setMyBooked]= useState(0);

  useEffect(() => {
    fetchEventById(id).then(r=>setEvent(r.data.event)).catch(()=>navigate('/')).finally(()=>setLoading(false));
    if(user) getMyBookings().then(r=>{
      const c = r.data.bookings.filter(b=>b.event?._id===id&&b.status==='Confirmed').reduce((s,b)=>s+b.tickets,0);
      setMyBooked(c);
    }).catch(()=>{});
  }, [id]);

  const handleBook = async () => {
    setBooking(true);
    try {
      await bookTickets({ eventId:id, tickets });
      setEvent(e=>({...e, bookedSeats:e.bookedSeats+tickets}));
      setMyBooked(m=>m+tickets);
      showToast(`🎉 ${tickets} ticket${tickets>1?'s':''} booked!`);
    } catch(err){ showToast(err.response?.data?.message||'Booking failed.','error'); }
    finally{ setBooking(false); }
  };

  if(loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)' }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid rgba(124,58,237,0.3)', borderTopColor:'#7C3AED', animation:'spin 1s linear infinite' }} />
    </div>
  );
  if(!event) return null;

  const color   = categoryColor[event.category] || '#7C3AED';
  const isFull  = event.bookedSeats >= event.totalSeats;
  const canBook = !isFull && myBooked < 5 && user?.role !== 'admin';
  const maxMore = Math.min(5 - myBooked, event.totalSeats - event.bookedSeats);

  return (
    <div style={{ paddingTop:36, maxWidth:960, margin:'0 auto' }}>
      <button onClick={()=>navigate(-1)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6, marginBottom:26, padding:0, transition:'color .2s' }}
        onMouseEnter={e=>e.currentTarget.style.color='#A78BFA'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}
      >← Back</button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:28, alignItems:'start' }}>
        {/* Left */}
        <div>
          {/* Image */}
          <div style={{ borderRadius:20, overflow:'hidden', height:320, marginBottom:26, position:'relative', boxShadow:`0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${color}22` }}>
            <img src={event.image||'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} alt={event.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(11,15,25,0.8) 0%, transparent 60%)' }} />
            <span style={{ position:'absolute', top:16, left:16, background:'rgba(11,15,25,0.7)', backdropFilter:'blur(12px)', border:`1px solid ${color}44`, color, padding:'5px 14px', borderRadius:99, fontSize:12, fontWeight:700, boxShadow:`0 0 14px ${color}30` }}>{event.category}</span>
            {isFull && <span style={{ position:'absolute', top:16, right:16, background:'rgba(236,72,153,0.2)', backdropFilter:'blur(12px)', border:'1px solid rgba(236,72,153,0.4)', color:'#EC4899', padding:'5px 14px', borderRadius:99, fontSize:12, fontWeight:700 }}>SOLD OUT</span>}
          </div>

          <h1 style={{ fontFamily:'var(--font-head)', fontSize:34, fontWeight:800, lineHeight:1.2, marginBottom:18, letterSpacing:-0.5 }}>{event.title}</h1>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22 }}>
            {[['calendar',formatDateShort(event.date)],['clock',event.time],['map',event.location],['user',`By ${event.createdBy?.name||'Admin'}`]].map(([icon,text])=>(
              <div key={icon} style={{ display:'flex', alignItems:'center', gap:9, background:'rgba(255,255,255,0.04)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:11, padding:'11px 14px', color:'rgba(255,255,255,0.5)', fontSize:13 }}>
                <Icon name={icon} size={15} color={color} />{text}
              </div>
            ))}
          </div>

          <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:22, marginBottom:20 }}>
            <h3 style={{ fontFamily:'var(--font-head)', fontSize:16, fontWeight:700, marginBottom:12 }}>About this event</h3>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, lineHeight:1.9 }}>{event.description||'No description provided.'}</p>
          </div>

          <SeatBar total={event.totalSeats} booked={event.bookedSeats} />
        </div>

        {/* Right — Booking Panel */}
        <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:26, position:'sticky', top:20, boxShadow:`0 0 0 1px ${color}15` }}>
          <h3 style={{ fontFamily:'var(--font-head)', fontSize:18, fontWeight:700, marginBottom:4 }}>Book Tickets</h3>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, marginBottom:22 }}>Max 5 tickets per user per event</p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22 }}>
            {[['Available',event.totalSeats-event.bookedSeats,'#22D3EE'],['Booked',event.bookedSeats,'rgba(255,255,255,0.5)']].map(([label,value,clr])=>(
              <div key={label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'14px', textAlign:'center' }}>
                <div style={{ fontSize:26, fontWeight:900, fontFamily:'var(--font-head)', color:clr }}>{value}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:0.8, fontWeight:600, marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>

          {myBooked > 0 && (
            <div style={{ background:'rgba(34,211,238,0.08)', border:'1px solid rgba(34,211,238,0.2)', borderRadius:10, padding:'10px 14px', color:'#22D3EE', fontSize:12, fontWeight:600, marginBottom:16, display:'flex', alignItems:'center', gap:7 }}>
              <Icon name="check" size={13} color="#22D3EE" /> You have {myBooked} ticket{myBooked>1?'s':''} for this event
            </div>
          )}

          {canBook ? (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:14, justifyContent:'center', marginBottom:20 }}>
                <button onClick={()=>setTickets(t=>Math.max(1,t-1))} style={{ width:42, height:42, borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#F0F4FF', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='rgba(124,58,237,0.2)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}
                >−</button>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:40, fontWeight:900, fontFamily:'var(--font-head)', background:'linear-gradient(135deg,#7C3AED,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>{tickets}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:2 }}>max {maxMore}</div>
                </div>
                <button onClick={()=>setTickets(t=>Math.min(maxMore,t+1))} style={{ width:42, height:42, borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#F0F4FF', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='rgba(124,58,237,0.2)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}
                >+</button>
              </div>
              <button onClick={handleBook} disabled={booking} style={{
                width:'100%', background: booking?'rgba(124,58,237,0.3)':'linear-gradient(135deg,#7C3AED,#EC4899)',
                border:'none', color:'#fff', borderRadius:13, padding:'13px',
                fontSize:14, fontWeight:700, cursor: booking?'not-allowed':'pointer',
                boxShadow: booking?'none':'0 6px 28px rgba(124,58,237,0.45)',
                display:'flex', alignItems:'center', justifyContent:'center', gap:9, transition:'all .2s',
              }}
                onMouseEnter={e=>{ if(!booking) e.currentTarget.style.boxShadow='0 8px 36px rgba(124,58,237,0.65)'; }}
                onMouseLeave={e=>{ if(!booking) e.currentTarget.style.boxShadow='0 6px 28px rgba(124,58,237,0.45)'; }}
              >
                <Icon name="ticket" size={17} color="#fff" />
                {booking ? 'Booking...' : `Book ${tickets} Ticket${tickets>1?'s':''}`}
              </button>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'16px 0', color:'rgba(255,255,255,0.3)', fontSize:13 }}>
              {isFull ? '❌ This event is sold out.' : myBooked>=5 ? '✅ You\'ve booked the maximum 5 tickets.' : '🔒 Admins cannot book tickets.'}
            </div>
          )}

          <button onClick={()=>navigate('/bookings')} style={{ width:'100%', background:'none', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.35)', borderRadius:11, padding:'10px', fontSize:12, fontWeight:600, cursor:'pointer', marginTop:12, transition:'all .2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(124,58,237,0.3)'; e.currentTarget.style.color='#A78BFA'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.35)'; }}
          >View My Bookings</button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default EventDetailPage;
