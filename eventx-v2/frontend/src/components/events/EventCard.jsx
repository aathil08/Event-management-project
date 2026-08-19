import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import SeatBar from '../common/SeatBar';
import { formatDateShort, categoryColor } from '../../utils/helpers';

const catGrad = {
  Technology:'linear-gradient(135deg,#7C3AED,#22D3EE)',
  Music:      'linear-gradient(135deg,#EC4899,#7C3AED)',
  Business:   'linear-gradient(135deg,#0891B2,#7C3AED)',
  Art:        'linear-gradient(135deg,#D97706,#EC4899)',
  Food:       'linear-gradient(135deg,#16A34A,#22D3EE)',
  Sports:     'linear-gradient(135deg,#DC2626,#EC4899)',
  Workshop:   'linear-gradient(135deg,#7C3AED,#EC4899)',
  Other:      'linear-gradient(135deg,#6B7280,#9CA3AF)',
};

const EventCard = ({ event, onBook, onEdit, onDelete, isAdmin }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const isFull = event.bookedSeats >= event.totalSeats;
  const color  = categoryColor[event.category] || '#6B7280';
  const grad   = catGrad[event.category] || catGrad.Other;
  const pct    = Math.round((event.bookedSeats / event.totalSeats) * 100);

  return (
    <div
      className="fade-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:'rgba(255,255,255,0.04)',
        backdropFilter:'blur(20px)',
        WebkitBackdropFilter:'blur(20px)',
        borderRadius:20, overflow:'hidden',
        border: hovered ? `1px solid ${color}44` : '1px solid rgba(255,255,255,0.08)',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'none',
        transition:'all .35s cubic-bezier(.23,1,.32,1)',
        boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${color}22` : '0 4px 20px rgba(0,0,0,0.3)',
        cursor:'pointer',
      }}
    >
      {/* Image */}
      <div style={{ position:'relative', height:190, overflow:'hidden' }} onClick={() => navigate(`/events/${event._id}`)}>
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'}
          alt={event.title}
          style={{
            width:'100%', height:'100%', objectFit:'cover',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition:'transform .6s ease',
          }}
        />
        {/* Dark overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(11,15,25,0.9) 0%, rgba(11,15,25,0.3) 50%, transparent 100%)' }} />

        {/* Category badge */}
        <span style={{
          position:'absolute', top:12, left:12,
          background:'rgba(11,15,25,0.7)',
          backdropFilter:'blur(12px)',
          WebkitBackdropFilter:'blur(12px)',
          border:`1px solid ${color}44`,
          color, padding:'4px 12px',
          borderRadius:99, fontSize:11, fontWeight:700,
          boxShadow:`0 0 12px ${color}30`,
        }}>{event.category}</span>

        {/* Sold out / Live badge */}
        {isFull ? (
          <span style={{
            position:'absolute', top:12, right:12,
            background:'rgba(236,72,153,0.2)',
            backdropFilter:'blur(12px)',
            border:'1px solid rgba(236,72,153,0.4)',
            color:'#EC4899', padding:'4px 12px',
            borderRadius:99, fontSize:11, fontWeight:700,
          }}>SOLD OUT</span>
        ) : pct < 30 ? (
          <span style={{
            position:'absolute', top:12, right:12,
            background:'rgba(34,211,238,0.15)',
            backdropFilter:'blur(12px)',
            border:'1px solid rgba(34,211,238,0.35)',
            color:'#22D3EE', padding:'4px 12px',
            borderRadius:99, fontSize:11, fontWeight:700,
            display:'flex', alignItems:'center', gap:5,
            animation:'pulseGlow 2s infinite',
          }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#22D3EE', display:'inline-block' }} />
            OPEN
          </span>
        ) : null}

        {/* Hover overlay — Book Now */}
        {hovered && !isAdmin && (
          <div className="fade-in" style={{
            position:'absolute', inset:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            background:'rgba(11,15,25,0.45)',
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); !isFull && onBook(event); }}
              disabled={isFull}
              style={{
                background: isFull ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#7C3AED,#EC4899)',
                border:'none', color:'#fff', borderRadius:50,
                padding:'12px 28px', fontSize:14, fontWeight:700,
                boxShadow: isFull ? 'none' : '0 8px 28px rgba(124,58,237,0.5)',
                cursor: isFull ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', gap:8,
                transform:'scale(1)', transition:'transform .2s',
              }}
              onMouseEnter={e=>{ if(!isFull) e.currentTarget.style.transform='scale(1.05)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; }}
            >
              <Icon name="ticket" size={16} color="#fff" />
              {isFull ? 'Sold Out' : 'Book Now'}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding:'18px 20px 20px' }} onClick={() => navigate(`/events/${event._id}`)}>
        <h3 style={{ fontSize:16, fontWeight:700, fontFamily:'var(--font-head)', color:'#F0F4FF', marginBottom:10, lineHeight:1.3 }}>
          {event.title}
        </h3>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px 0', marginBottom:12 }}>
          {[['calendar', formatDateShort(event.date)], ['clock', event.time], ['map', event.location]].map(([icon, text]) => (
            <div key={icon} style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.35)', fontSize:12 }}>
              <Icon name={icon} size={12} color={color} />{text}
            </div>
          ))}
        </div>

        <SeatBar total={event.totalSeats} booked={event.bookedSeats} />

        {/* Admin buttons */}
        {isAdmin && (
          <div style={{ marginTop:14, display:'flex', gap:8 }}>
            <button onClick={e=>{ e.stopPropagation(); navigate(`/events/${event._id}`); }} style={glassBtn}>
              <Icon name="eye" size={13} color="rgba(255,255,255,0.5)" /> View
            </button>
            <button onClick={e=>{ e.stopPropagation(); onEdit(event); }} style={{ ...glassBtn, color:'#A78BFA', borderColor:'rgba(124,58,237,0.25)' }}>
              <Icon name="edit" size={13} color="#A78BFA" /> Edit
            </button>
            <button onClick={e=>{ e.stopPropagation(); onDelete(event._id); }} style={{ ...glassBtn, color:'#EC4899', borderColor:'rgba(236,72,153,0.25)', background:'rgba(236,72,153,0.08)' }}>
              <Icon name="trash" size={13} color="#EC4899" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const glassBtn = {
  flex:1, background:'rgba(255,255,255,0.05)',
  border:'1px solid rgba(255,255,255,0.08)',
  color:'rgba(255,255,255,0.5)', borderRadius:10,
  padding:'8px 0', fontSize:12, fontWeight:600,
  cursor:'pointer', display:'flex', alignItems:'center',
  justifyContent:'center', gap:5,
  transition:'all .2s',
};

export default EventCard;
