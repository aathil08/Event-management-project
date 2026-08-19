import { useState } from 'react';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import SeatBar from '../common/SeatBar';
import { formatDateShort, categoryColor } from '../../utils/helpers';

const BookingModal = ({ event, userBookings, onClose, onConfirm, loading }) => {
  const alreadyBooked = userBookings
    .filter(b => b.event?._id === event._id && b.status === 'Confirmed')
    .reduce((s,b) => s + b.tickets, 0);
  const maxMore = Math.min(5 - alreadyBooked, event.totalSeats - event.bookedSeats);
  const [qty, setQty] = useState(Math.min(1, maxMore));
  const color = categoryColor[event.category] || '#7C3AED';

  return (
    <Modal title="Book Tickets" onClose={onClose} width={480}>
      {/* Event mini header */}
      <div style={{
        display:'flex', gap:14, alignItems:'center',
        background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:14, padding:'14px 16px', marginBottom:20,
      }}>
        <div style={{ width:58, height:58, borderRadius:12, overflow:'hidden', flexShrink:0 }}>
          <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80'} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:15, fontFamily:'var(--font-head)', color:'#F0F4FF', marginBottom:4 }}>{event.title}</div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[['calendar',formatDateShort(event.date)],['clock',event.time],['map',event.location]].map(([icon,text])=>(
              <span key={icon} style={{ color:'rgba(255,255,255,0.35)', fontSize:11, display:'flex', alignItems:'center', gap:4 }}>
                <Icon name={icon} size={11} color={color} />{text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SeatBar total={event.totalSeats} booked={event.bookedSeats} />

      {alreadyBooked > 0 && (
        <div style={{
          marginTop:16, background:'rgba(34,211,238,0.08)',
          border:'1px solid rgba(34,211,238,0.2)', borderRadius:10, padding:'10px 14px',
          color:'#22D3EE', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:7,
        }}>
          <Icon name="check" size={13} color="#22D3EE" />
          You already have {alreadyBooked} ticket{alreadyBooked>1?'s':''} for this event
        </div>
      )}

      {maxMore > 0 ? (
        <>
          <div style={{ marginTop:20 }}>
            <label style={{ color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:12 }}>
              Select Tickets (max {maxMore} more)
            </label>
            <div style={{ display:'flex', alignItems:'center', gap:16, justifyContent:'center' }}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{
                width:44, height:44, borderRadius:12,
                background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.1)',
                color:'#F0F4FF', fontSize:22, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s',
              }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(124,58,237,0.2)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}
              >−</button>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:42, fontWeight:900, fontFamily:'var(--font-head)', background:'linear-gradient(135deg,#7C3AED,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>{qty}</div>
                <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11, marginTop:2 }}>ticket{qty>1?'s':''}</div>
              </div>
              <button onClick={()=>setQty(q=>Math.min(maxMore,q+1))} style={{
                width:44, height:44, borderRadius:12,
                background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.1)',
                color:'#F0F4FF', fontSize:22, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s',
              }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(124,58,237,0.2)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}
              >+</button>
            </div>
          </div>
          <button onClick={()=>onConfirm(event._id, qty)} disabled={loading} style={{
            width:'100%', marginTop:22,
            background: loading ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,#7C3AED,#EC4899)',
            border:'none', color:'#fff', borderRadius:14,
            padding:'14px', fontSize:15, fontWeight:700,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 6px 28px rgba(124,58,237,0.45)',
            display:'flex', alignItems:'center', justifyContent:'center', gap:9,
            transition:'all .2s',
          }}
            onMouseEnter={e=>{ if(!loading) e.currentTarget.style.boxShadow='0 8px 36px rgba(124,58,237,0.65)'; }}
            onMouseLeave={e=>{ if(!loading) e.currentTarget.style.boxShadow='0 6px 28px rgba(124,58,237,0.45)'; }}
          >
            <Icon name="ticket" size={18} color="#fff" />
            {loading ? 'Booking...' : `Confirm ${qty} Ticket${qty>1?'s':''}`}
          </button>
        </>
      ) : (
        <div style={{ textAlign:'center', padding:'20px 0', color:'rgba(255,255,255,0.4)', fontSize:13 }}>
          {alreadyBooked >= 5 ? 'You\'ve reached the maximum of 5 tickets for this event.' : 'This event is sold out.'}
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
