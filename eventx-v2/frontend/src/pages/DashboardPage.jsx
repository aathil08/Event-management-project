import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatCard from '../components/admin/StatCard';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import Icon from '../components/common/Icon';
import { fetchEvents, createEvent, updateEvent, deleteEvent, getDashboardStats } from '../api/services';

const DashboardPage = () => {
  const { toast, showToast, hideToast } = useToast();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [events,      setEvents]      = useState([]);
  const [stats,       setStats]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editingEvent,setEditingEvent]= useState(null);
  const [showCreate,  setShowCreate]  = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [evRes, statsRes] = await Promise.all([fetchEvents({ limit:100 }), getDashboardStats()]);
      setEvents(evRes.data.events);
      setStats(statsRes.data);
    } catch { showToast('Failed to load data.','error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); if(location.state?.openCreate) setShowCreate(true); }, []);

  const handleCreate = async fd => {
    setFormLoading(true);
    try {
      const res = await createEvent(fd);
      setEvents(p=>[res.data.event,...p]);
      setShowCreate(false); showToast('🎉 Event created!'); loadData();
    } catch(err){ showToast(err.response?.data?.message||'Failed.','error'); }
    finally{ setFormLoading(false); }
  };

  const handleUpdate = async fd => {
    setFormLoading(true);
    try {
      const res = await updateEvent(editingEvent._id, fd);
      setEvents(p=>p.map(e=>e._id===editingEvent._id?res.data.event:e));
      setEditingEvent(null); showToast('Event updated!');
    } catch(err){ showToast(err.response?.data?.message||'Failed.','error'); }
    finally{ setFormLoading(false); }
  };

  const handleDelete = async id => {
    if(!window.confirm('Delete this event?')) return;
    try { await deleteEvent(id); setEvents(p=>p.filter(e=>e._id!==id)); showToast('Event deleted.','warning'); loadData(); }
    catch{ showToast('Failed.','error'); }
  };

  const statCards = [
    { label:'Total Events',   value: stats?.totalEvents      ?? '—', icon:'calendar', color:'#7C3AED' },
    { label:'Total Bookings', value: stats?.totalBookings    ?? '—', icon:'ticket',   color:'#EC4899' },
    { label:'Seats Sold',     value: stats?.totalSeatsBooked ?? '—', icon:'users',    color:'#22D3EE' },
    { label:'Registered Users',value:stats?.totalUsers      ?? '—', icon:'trending', color:'#10B981' },
  ];

  return (
    <div style={{ paddingTop:36 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:30, fontWeight:800, letterSpacing:-1, color:'#F0F4FF' }}>
            Admin Dashboard
          </h1>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, marginTop:5 }}>Manage events and monitor your platform.</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>navigate('/admin/bookings')} style={{
            background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)',
            color:'rgba(255,255,255,0.6)', borderRadius:12,
            padding:'10px 18px', fontSize:13, fontWeight:600,
            display:'flex', alignItems:'center', gap:7, cursor:'pointer', transition:'all .2s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; e.currentTarget.style.color='#A78BFA'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.6)'; }}
          >
            <Icon name="ticket" size={14} /> All Bookings
          </button>
          <button onClick={()=>setShowCreate(true)} style={{
            background:'linear-gradient(135deg,#7C3AED,#EC4899)',
            border:'none', color:'#fff', borderRadius:12,
            padding:'10px 20px', fontSize:13, fontWeight:700,
            display:'flex', alignItems:'center', gap:7, cursor:'pointer',
            boxShadow:'0 4px 20px rgba(124,58,237,0.4)', transition:'all .2s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 6px 28px rgba(124,58,237,0.6)'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 4px 20px rgba(124,58,237,0.4)'; e.currentTarget.style.transform='none'; }}
          >
            <Icon name="plus" size={15} color="#fff" /> New Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:16, marginBottom:32 }}>
        {statCards.map((s,i) => <div key={s.label} style={{ animationDelay:`${i*0.07}s` }}><StatCard {...s} /></div>)}
      </div>

      {/* Category breakdown */}
      {stats?.categoryStats?.length > 0 && (
        <div style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'20px 24px', marginBottom:28 }}>
          <h3 style={{ fontFamily:'var(--font-head)', fontSize:14, fontWeight:700, marginBottom:14, color:'rgba(255,255,255,0.7)' }}>Events by Category</h3>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {stats.categoryStats.map(({_id,count}) => (
              <div key={_id} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:99, padding:'6px 14px', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', gap:8 }}>
                {_id||'Other'} <span style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight:800 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events grid */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ fontFamily:'var(--font-head)', fontSize:20, fontWeight:800 }}>
          All Events <span style={{ color:'rgba(255,255,255,0.2)', fontSize:15, fontWeight:400 }}>({events.length})</span>
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:80, color:'rgba(255,255,255,0.25)' }}>
          <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid rgba(124,58,237,0.3)', borderTopColor:'#7C3AED', margin:'0 auto 14px', animation:'spin 1s linear infinite' }} />
          Loading...
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign:'center', padding:'70px 20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, color:'rgba(255,255,255,0.25)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📅</div>
          <p style={{ fontWeight:700, fontSize:15 }}>No events yet. Create your first one!</p>
          <button onClick={()=>setShowCreate(true)} style={{ marginTop:18, background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', color:'#fff', borderRadius:12, padding:'12px 24px', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 20px rgba(124,58,237,0.4)' }}>
            + Create Event
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:20 }}>
          {events.map((ev,i) => (
            <div key={ev._id} style={{ animationDelay:`${i*0.04}s` }}>
              <EventCard event={ev} onEdit={setEditingEvent} onDelete={handleDelete} isAdmin={true} />
            </div>
          ))}
        </div>
      )}

      {showCreate   && <EventForm onClose={()=>setShowCreate(false)} onSave={handleCreate} loading={formLoading} />}
      {editingEvent && <EventForm event={editingEvent} onClose={()=>setEditingEvent(null)} onSave={handleUpdate} loading={formLoading} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default DashboardPage;
