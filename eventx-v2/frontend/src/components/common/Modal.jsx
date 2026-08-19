import { useEffect } from 'react';

const Modal = ({ title, onClose, children, width = 540 }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div className="fade-in" style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.7)',
      backdropFilter:'blur(8px)',
      WebkitBackdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:20,
    }} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="fade-up" style={{
        background:'rgba(15,20,32,0.95)',
        backdropFilter:'blur(32px)',
        WebkitBackdropFilter:'blur(32px)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:20,
        width:'100%', maxWidth:width,
        boxShadow:'0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.15)',
        overflow:'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding:'20px 24px',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <h3 style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:18, color:'#F0F4FF' }}>{title}</h3>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:9,
            background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.08)',
            color:'rgba(255,255,255,0.5)', fontSize:18,
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', lineHeight:1,
            transition:'all .2s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(236,72,153,0.15)'; e.currentTarget.style.color='#EC4899'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}
          >×</button>
        </div>
        <div style={{ padding:'22px 24px' }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
