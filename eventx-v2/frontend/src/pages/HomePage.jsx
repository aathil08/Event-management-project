import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import useEvents from '../hooks/useEvents';
import useToast from '../hooks/useToast';
import EventCard from '../components/events/EventCard';
import CategoryFilter from '../components/events/CategoryFilter';
import BookingModal from '../components/bookings/BookingModal';
import Toast from '../components/common/Toast';
import Icon from '../components/common/Icon';
import { bookTickets, getMyBookings } from '../api/services';

const HomePage = ({ search }) => {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const eventsRef = useRef(null);
  const [category, setCategory]         = useState('All');
  const [bookingEvent, setBookingEvent] = useState(null);
  const [myBookings, setMyBookings]     = useState([]);
  const [bookLoading, setBookLoading]   = useState(false);

  const { events, setEvents, loading, error } = useEvents({
    search, category: category !== 'All' ? category : undefined,
  });

  useEffect(() => {
    if (user) getMyBookings().then(r => setMyBookings(r.data.bookings)).catch(()=>{});
  }, [user]);

  const handleConfirmBooking = async (eventId, qty) => {
    setBookLoading(true);
    try {
      await bookTickets({ eventId, tickets: qty });
      setEvents(prev => prev.map(e => e._id === eventId ? { ...e, bookedSeats: e.bookedSeats + qty } : e));
      const res = await getMyBookings();
      setMyBookings(res.data.bookings);
      setBookingEvent(null);
      showToast(`🎉 ${qty} ticket${qty>1?'s':''} booked successfully!`);
    } catch(err) {
      showToast(err.response?.data?.message || 'Booking failed.', 'error');
    } finally { setBookLoading(false); }
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ textAlign:'center', padding:'60px 20px 52px', position:'relative' }}>
        {/* Glow orb */}
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:600, height:400, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

        {/* Live badge */}
        <div className="fade-up" style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(34,211,238,0.08)',
          border:'1px solid rgba(34,211,238,0.25)',
          backdropFilter:'blur(12px)',
          borderRadius:99, padding:'6px 16px', marginBottom:22,
          fontSize:12, color:'#22D3EE', fontWeight:700,
          animation:'pulseGlow 2.5s infinite',
        }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#22D3EE', display:'inline-block', boxShadow:'0 0 8px rgba(34,211,238,0.8)' }} />
          Live Event Platform — Chennai &amp; Beyond
        </div>

        <h1 className="fade-up" style={{ fontFamily:'var(--font-head)', fontSize:'clamp(32px,5vw,60px)', fontWeight:800, lineHeight:1.1, marginBottom:16, letterSpacing:-1.5, animationDelay:'.08s' }}>
          Discover &amp; Book<br />
          <span className="grad-text">Unforgettable Events</span>
        </h1>
        <p className="fade-up" style={{ color:'rgba(255,255,255,0.4)', fontSize:16, maxWidth:460, margin:'0 auto 30px', lineHeight:1.8, animationDelay:'.16s' }}>
          From tech summits to jazz nights — find, book, and experience the best events near you.
        </p>
        <button className="fade-up" onClick={() => eventsRef.current?.scrollIntoView({ behavior:'smooth' })} style={{
          background:'linear-gradient(135deg,#7C3AED,#EC4899)',
          border:'none', color:'#fff', borderRadius:50,
          padding:'13px 32px', fontSize:14, fontWeight:700,
          display:'inline-flex', alignItems:'center', gap:9,
          boxShadow:'0 6px 28px rgba(124,58,237,0.45)',
          cursor:'pointer', animationDelay:'.24s', transition:'all .2s',
        }}
          onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 10px 40px rgba(124,58,237,0.7)'; e.currentTarget.style.transform='translateY(-2px)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 6px 28px rgba(124,58,237,0.45)'; e.currentTarget.style.transform='none'; }}
        >
          Explore Events <Icon name="arrow" size={16} color="#fff" />
        </button>
      </div>

      {/* ── Stats Strip ──────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:40 }}>
        {[
          ['Events Live',   events.length,                                              'calendar','#7C3AED'],
          ['Seats Booked',  events.reduce((a,e)=>a+e.bookedSeats,0),                  'users',   '#EC4899'],
          ['My Tickets',    myBookings.filter(b=>b.status==='Confirmed').length,       'ticket',  '#22D3EE'],
        ].map(([label,value,icon,color],i) => (
          <div key={label} className="fade-up" style={{
            background:'rgba(255,255,255,0.04)',
            backdropFilter:'blur(20px)',
            WebkitBackdropFilter:'blur(20px)',
            border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:16, padding:'18px 22px',
            display:'flex', alignItems:'center', gap:14,
            animationDelay:`${i*0.06}s`,
            transition:'all .3s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${color}33`; e.currentTarget.style.boxShadow=`0 8px 28px ${color}18`; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 16px ${color}25` }}>
              <Icon name={icon} size={19} color={color} />
            </div>
            <div>
              <div style={{ fontSize:26, fontWeight:800, fontFamily:'var(--font-head)', color:'#F0F4FF', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.8, marginTop:4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Events Section ───────────────────────────────────── */}
      <div ref={eventsRef}>
        <CategoryFilter active={category} onChange={setCategory} />

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>
            {category === 'All' ? 'All Events' : category}{' '}
            <span style={{ color:'rgba(255,255,255,0.2)', fontSize:16, fontFamily:'var(--font-body)', fontWeight:400 }}>({events.length})</span>
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:80, color:'rgba(255,255,255,0.25)' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid rgba(124,58,237,0.3)', borderTopColor:'#7C3AED', margin:'0 auto 14px', animation:'spin 1s linear infinite' }} />
            Loading events...
          </div>
        ) : error ? (
          <div style={{ textAlign:'center', padding:60, color:'#EC4899' }}>{error}</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign:'center', padding:70, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, color:'rgba(255,255,255,0.25)' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            <p style={{ fontWeight:600, fontSize:15 }}>No events found</p>
            <p style={{ fontSize:13, marginTop:6 }}>Try a different category or search term</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:22 }}>
            {events.map((ev,i) => (
              <div key={ev._id} style={{ animationDelay:`${i*0.05}s` }}>
                <EventCard event={ev} onBook={setBookingEvent} isAdmin={false} />
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingEvent && (
        <BookingModal event={bookingEvent} userBookings={myBookings} onClose={()=>setBookingEvent(null)} onConfirm={handleConfirmBooking} loading={bookLoading} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default HomePage;
