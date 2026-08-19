import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import { formatDateShort } from '../../utils/helpers';

const BookingCard = ({ booking, onCancel }) => {
  const navigate   = useNavigate();
  const isConfirmed = booking.status === 'Confirmed';
  const event       = booking.event;

  return (
    <div style={{
      background: '#111827',
      border: `1px solid ${isConfirmed ? '#1f2937' : '#1a1a2e'}`,
      borderRadius: 14, padding: '18px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      opacity: isConfirmed ? 1 : 0.65,
    }}>
      {/* Event Image */}
      <div style={{
        width: 72, height: 72, borderRadius: 10, flexShrink: 0,
        overflow: 'hidden', background: '#1f2937',
      }}>
        <img
          src={event?.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80'}
          alt={event?.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          onClick={() => event?._id && navigate(`/events/${event._id}`)}
          style={{
            fontSize: 15, fontWeight: 800, color: '#f9fafb',
            marginBottom: 6, cursor: 'pointer',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >
          {event?.title || 'Event'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
          {[
            ['calendar', event?.date ? formatDateShort(event.date) : '—'],
            ['clock',    event?.time || '—'],
            ['map',      event?.location || '—'],
          ].map(([icon, text]) => (
            <span key={icon} style={{ color: '#6b7280', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name={icon} size={12} color="#374151" /> {text}
            </span>
          ))}
        </div>
      </div>

      {/* Ticket count */}
      <div style={{ textAlign: 'center', minWidth: 60 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#a78bfa' }}>{booking.tickets}</div>
        <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
          Ticket{booking.tickets > 1 ? 's' : ''}
        </div>
      </div>

      {/* Status + Cancel */}
      <div style={{ textAlign: 'right', minWidth: 90 }}>
        <span style={{
          display: 'block', padding: '4px 12px', borderRadius: 99,
          fontSize: 11, fontWeight: 700, marginBottom: 8,
          background: isConfirmed ? '#10b98122' : '#6b728022',
          color: isConfirmed ? '#34d399' : '#9ca3af',
          border: `1px solid ${isConfirmed ? '#10b98133' : '#374151'}`,
        }}>
          {booking.status}
        </span>
        {isConfirmed && onCancel && (
          <button
            onClick={() => onCancel(booking._id)}
            style={{
              background: 'none', border: '1px solid #374151',
              color: '#6b7280', borderRadius: 7, padding: '5px 10px',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
