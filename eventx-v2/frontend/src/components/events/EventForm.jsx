import { useState } from 'react';
import Modal from '../common/Modal';
import { ALL_CATEGORIES } from '../../utils/helpers';

const FIELD = {
  background:'rgba(255,255,255,0.05)',
  border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:10, padding:'11px 14px',
  color:'#F0F4FF', fontSize:13,
  width:'100%', boxSizing:'border-box',
  fontFamily:'var(--font-body)',
  outline:'none', transition:'border-color .2s',
};

const LABEL = {
  color:'rgba(255,255,255,0.4)', fontSize:11,
  display:'block', marginBottom:7,
  textTransform:'uppercase', letterSpacing:1, fontWeight:700,
};

const EventForm = ({ event, onClose, onSave, loading }) => {
  const isEditing = Boolean(event);
  const [form, setForm] = useState({
    title:       event?.title       || '',
    description: event?.description || '',
    date:        event?.date        ? new Date(event.date).toISOString().split('T')[0] : '',
    time:        event?.time        || '',
    location:    event?.location    || '',
    category:    event?.category    || 'Technology',
    totalSeats:  event?.totalSeats  || 100,
    image:       event?.image       || '',
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) return;
    onSave(form);
  };

  const fieldFocus = e => { e.target.style.borderColor='rgba(124,58,237,0.6)'; e.target.style.boxShadow='0 0 0 2px rgba(124,58,237,0.15)'; };
  const fieldBlur  = e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; };

  return (
    <Modal title={isEditing ? 'Edit Event' : 'Create New Event'} onClose={onClose} width={560}>
      <form onSubmit={handleSubmit} style={{ display:'grid', gap:16 }}>
        <div>
          <label style={LABEL}>Event Title *</label>
          <input value={form.title} onChange={set('title')} placeholder="e.g. Chennai Tech Summit 2026"
            required style={FIELD} onFocus={fieldFocus} onBlur={fieldBlur} />
        </div>
        <div>
          <label style={LABEL}>Description</label>
          <textarea value={form.description} onChange={set('description')} placeholder="What's this event about?"
            rows={3} style={{ ...FIELD, resize:'vertical' }} onFocus={fieldFocus} onBlur={fieldBlur} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={LABEL}>Date *</label>
            <input type="date" value={form.date} onChange={set('date')} required style={{ ...FIELD, colorScheme:'dark' }} onFocus={fieldFocus} onBlur={fieldBlur} />
          </div>
          <div>
            <label style={LABEL}>Time</label>
            <input value={form.time} onChange={set('time')} placeholder="e.g. 7:00 PM" style={FIELD} onFocus={fieldFocus} onBlur={fieldBlur} />
          </div>
        </div>
        <div>
          <label style={LABEL}>Location *</label>
          <input value={form.location} onChange={set('location')} placeholder="Venue / City" required style={FIELD} onFocus={fieldFocus} onBlur={fieldBlur} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={LABEL}>Category</label>
            <select value={form.category} onChange={set('category')} style={{ ...FIELD, cursor:'pointer' }} onFocus={fieldFocus} onBlur={fieldBlur}>
              {ALL_CATEGORIES.filter(c=>c!=='All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={LABEL}>Total Seats</label>
            <input type="number" value={form.totalSeats} onChange={set('totalSeats')} min={1} max={5000} style={FIELD} onFocus={fieldFocus} onBlur={fieldBlur} />
          </div>
        </div>
        <div>
          <label style={LABEL}>Image URL (optional)</label>
          <input value={form.image} onChange={set('image')} placeholder="https://..." style={FIELD} onFocus={fieldFocus} onBlur={fieldBlur} />
        </div>

        <div style={{ display:'flex', gap:10, marginTop:4 }}>
          <button type="button" onClick={onClose} style={{
            flex:1, background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)',
            color:'rgba(255,255,255,0.5)', borderRadius:12,
            padding:'12px', fontSize:14, fontWeight:600, cursor:'pointer',
          }}>Cancel</button>
          <button type="submit" disabled={loading} style={{
            flex:2,
            background: loading ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,#7C3AED,#EC4899)',
            border:'none', color:'#fff', borderRadius:12,
            padding:'12px', fontSize:14, fontWeight:700,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
            transition:'all .2s',
          }}
            onMouseEnter={e=>{ if(!loading) e.currentTarget.style.boxShadow='0 6px 28px rgba(124,58,237,0.6)'; }}
            onMouseLeave={e=>{ if(!loading) e.currentTarget.style.boxShadow='0 4px 20px rgba(124,58,237,0.4)'; }}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventForm;
