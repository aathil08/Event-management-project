import { seatPercent, seatColor } from '../../utils/helpers';

const SeatBar = ({ total, booked }) => {
  const pct   = seatPercent(booked, total);
  const color = pct >= 90 ? '#EC4899' : pct >= 70 ? '#F59E0B' : '#22D3EE';
  const glow  = pct >= 90 ? 'rgba(236,72,153,0.5)' : pct >= 70 ? 'rgba(245,158,11,0.5)' : 'rgba(34,211,238,0.5)';

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:6 }}>
        <span style={{ color:'rgba(255,255,255,0.35)', fontWeight:500 }}>{total - booked} seats left</span>
        <span style={{ color, fontWeight:700 }}>{pct}% filled</span>
      </div>
      <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
        <div style={{
          height:'100%', width:`${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          borderRadius:99,
          boxShadow: `0 0 8px ${glow}`,
          transition:'width 1.2s cubic-bezier(.23,1,.32,1)',
        }} />
      </div>
    </div>
  );
};

export default SeatBar;
