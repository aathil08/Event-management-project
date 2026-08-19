import Icon from '../common/Icon';

const StatCard = ({ label, value, icon, color }) => (
  <div
    className="fade-up"
    style={{
      background:'rgba(255,255,255,0.04)',
      backdropFilter:'blur(20px)',
      WebkitBackdropFilter:'blur(20px)',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:18,
      padding:'24px 22px',
      position:'relative', overflow:'hidden',
      transition:'all .3s ease',
    }}
    onMouseEnter={e=>{
      e.currentTarget.style.border=`1px solid ${color}44`;
      e.currentTarget.style.boxShadow=`0 8px 32px ${color}22, 0 0 0 1px ${color}22`;
      e.currentTarget.style.transform='translateY(-3px)';
    }}
    onMouseLeave={e=>{
      e.currentTarget.style.border='1px solid rgba(255,255,255,0.08)';
      e.currentTarget.style.boxShadow='none';
      e.currentTarget.style.transform='none';
    }}
  >
    {/* Background radial glow */}
    <div style={{
      position:'absolute', top:-20, right:-20,
      width:100, height:100, borderRadius:'50%',
      background:`radial-gradient(circle, ${color}20 0%, transparent 70%)`,
      pointerEvents:'none',
    }}/>
    <div style={{
      width:44, height:44, borderRadius:13,
      background:`rgba(${color==='#7C3AED'?'124,58,237':color==='#EC4899'?'236,72,153':color==='#22D3EE'?'34,211,238':'16,185,129'},0.15)`,
      border:`1px solid ${color}30`,
      display:'flex', alignItems:'center', justifyContent:'center',
      marginBottom:16,
      boxShadow:`0 0 16px ${color}25`,
    }}>
      <Icon name={icon} size={20} color={color} />
    </div>
    <div style={{ fontSize:32, fontWeight:800, fontFamily:'var(--font-head)', color:'#F0F4FF', lineHeight:1 }}>{value}</div>
    <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11, fontWeight:600, marginTop:6, textTransform:'uppercase', letterSpacing:1 }}>
      {label}
    </div>
  </div>
);

export default StatCard;
