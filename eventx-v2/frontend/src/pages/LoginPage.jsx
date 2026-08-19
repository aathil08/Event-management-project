import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/common/Icon';

const F = {
  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:11, padding:'12px 14px', color:'#F0F4FF', fontSize:14,
  width:'100%', boxSizing:'border-box', fontFamily:'var(--font-body)', outline:'none',
  transition:'all .2s',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email:'', password:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const ff = e => { e.target.style.borderColor='rgba(124,58,237,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,0.12)'; };
  const fb = e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; };

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/dashboard' : '/');
    } catch(err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh', background:'#0B0F19',
      display:'flex', alignItems:'center', justifyContent:'center', padding:20,
      fontFamily:'var(--font-body)',
    }}>
      {/* Background glows */}
      <div style={{ position:'fixed', top:'-10%', left:'30%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-10%', right:'20%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div className="fade-up" style={{ width:'100%', maxWidth:420, position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{
            width:56, height:56, borderRadius:16, margin:'0 auto 16px',
            background:'linear-gradient(135deg,#7C3AED,#EC4899)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 32px rgba(124,58,237,0.5)',
          }}>
            <Icon name="star" size={24} color="#fff" />
          </div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:28, fontWeight:800, letterSpacing:-0.5, color:'#F0F4FF' }}>Welcome back</h1>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:14, marginTop:6 }}>Sign in to your EventX account</p>
        </div>

        <div style={{
          background:'rgba(255,255,255,0.04)',
          backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:20, padding:32,
          boxShadow:'0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.1)',
        }}>
          {error && (
            <div style={{
              background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.3)',
              borderRadius:10, padding:'11px 14px', color:'#F9A8D4', fontSize:13,
              marginBottom:18, display:'flex', alignItems:'center', gap:8,
            }}>
              <Icon name="x" size={14} color="#EC4899" /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display:'grid', gap:16 }}>
            {[
              { k:'email',    label:'Email address', type:'email',    ph:'you@example.com' },
              { k:'password', label:'Password',       type:'password', ph:'••••••••' },
            ].map(({k,label,type,ph}) => (
              <div key={k}>
                <label style={{ color:'rgba(255,255,255,0.4)', fontSize:11, display:'block', marginBottom:7, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{label}</label>
                <input type={type} value={form[k]} onChange={set(k)} placeholder={ph} required style={F} onFocus={ff} onBlur={fb} />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{
              background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg,#7C3AED,#EC4899)',
              border:'none', color:'#fff', borderRadius:12,
              padding:'13px', fontSize:14, fontWeight:700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop:4, boxShadow: loading ? 'none' : '0 4px 24px rgba(124,58,237,0.45)',
              transition:'all .2s',
            }}
              onMouseEnter={e=>{ if(!loading) e.currentTarget.style.boxShadow='0 6px 32px rgba(124,58,237,0.65)'; }}
              onMouseLeave={e=>{ if(!loading) e.currentTarget.style.boxShadow='0 4px 24px rgba(124,58,237,0.45)'; }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:13, marginTop:20 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'#A78BFA', fontWeight:700 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
