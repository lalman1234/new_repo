import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, BookOpen, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'super_admin') navigate('/admin');
        else if (user.role === 'trainer') navigate('/trainer');
        else if (user.role === 'student') navigate('/student');
      } catch (e) {
        localStorage.clear();
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'super_admin') {
        navigate('/admin');
      } else if (data.user.role === 'trainer') {
        navigate('/trainer');
      } else if (data.user.role === 'student') {
        navigate('/student');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 w-full">
      <div className="w-full max-w-md bg-bg-card backdrop-blur-xl border border-border-glass rounded-2xl shadow-2xl p-8 sm:p-10 transition-all hover:border-border-glass-hover">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-brand/10 p-4 rounded-full border border-brand/20 shadow-inner">
              <BookOpen size={36} className="text-brand" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Training Manager</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to access your portal</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm mb-5">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:bg-bg-dark/80 focus:ring-4 focus:ring-brand/20"
              placeholder="e.g., admin@training.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:bg-bg-dark/80 focus:ring-4 focus:ring-brand/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:pointer-events-none mt-2" 
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/5 pt-6">
          <p>
            Are you a student?{' '}
            <Link to="/register" className="text-accent font-semibold hover:text-accent-light transition-colors ml-1">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
