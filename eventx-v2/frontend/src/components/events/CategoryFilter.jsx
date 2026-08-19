import { ALL_CATEGORIES, categoryColor } from '../../utils/helpers';

const CategoryFilter = ({ active, onChange }) => (
  <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
    {ALL_CATEGORIES.map((cat) => {
      const isActive = active === cat;
      const color = cat === 'All' ? '#7C3AED' : (categoryColor[cat] || '#6B7280');
      return (
        <button key={cat} onClick={() => onChange(cat)} style={{
          padding:'7px 16px', borderRadius:99, fontSize:12, fontWeight:600,
          background: isActive ? `${color}22` : 'rgba(255,255,255,0.04)',
          border: isActive ? `1px solid ${color}55` : '1px solid rgba(255,255,255,0.08)',
          color: isActive ? color : 'rgba(255,255,255,0.4)',
          cursor:'pointer',
          boxShadow: isActive ? `0 0 14px ${color}25` : 'none',
          transition:'all .2s',
          backdropFilter:'blur(10px)',
        }}
          onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.color='rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}}
          onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.color='rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

export default CategoryFilter;
