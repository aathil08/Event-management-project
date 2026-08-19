import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3800); return () => clearTimeout(t); }, []);
  const isErr = type === 'error';
  const isWarn = type === 'warning';
  const color = isErr ? '#EC4899' : isWarn ? '#F59E0B' : '#22D3EE';
  const bg    = isErr ? 'rgba(236,72,153,0.12)' : isWarn ? 'rgba(245,158,11,0.12)' : 'rgba(34,211,238,0.12)';
  const bord  = isErr ? 'rgba(236,72,153,0.3)' : isWarn ? 'rgba(245,158,11,0.3)' : 'rgba(34,211,238,0.3)';
  return (
    <div className="fade-up" style={{
      position:'fixed', bottom:28, right:28, zIndex:9999,
      background:'rgba(11,15,25,0.92)',
      backdropFilter:'blur(24px)',
      WebkitBackdropFilter:'blur(24px)',
      border:`1px solid ${bord}`,
      borderRadius:14,
      padding:'14px 20px',
      display:'flex', alignItems:'center', gap:12,
      boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${bord}`,
      maxWidth:360, minWidth:260,
    }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 10px ${color}`, flexShrink:0 }}/>
      <span style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.85)', flex:1 }}>{message}</span>
      <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:16, lineHeight:1 }}>×</button>
    </div>
  );
};

export default Toast;
