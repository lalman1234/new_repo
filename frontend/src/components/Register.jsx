import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [colleges, setColleges] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/colleges');
        const data = await response.json();
        if (response.ok) {
          setColleges(data);
        } else {
          throw new Error(data.message || 'Failed to fetch colleges');
        }
      } catch (err) {
        console.error(err);
        setError('Could not load college list. Please check if the server is running.');
      }
    };
    fetchColleges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!collegeId) {
      setError('Please select your college');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          college_id: parseInt(collegeId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
            <div className="bg-accent/10 p-4 rounded-full border border-accent/20 shadow-inner">
              <BookOpen size={36} className="text-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Student Registration</h2>
          <p className="text-sm text-slate-400 mt-1">Create your central training account</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm mb-5">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 p-3.5 bg-green-500/15 border border-green-500/30 text-green-400 rounded-xl text-sm mb-5">
            <CheckCircle size={18} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:bg-bg-dark/80 focus:ring-4 focus:ring-brand/20"
              placeholder="e.g., John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:bg-bg-dark/80 focus:ring-4 focus:ring-brand/20"
              placeholder="e.g., john@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Select Affiliated College</label>
            <div className="relative">
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-bg-dark/50 text-white text-sm transition-all focus:outline-none focus:border-brand focus:bg-bg-dark/80 focus:ring-4 focus:ring-brand/20 appearance-none pr-10"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                required
              >
                <option value="" className="bg-bg-dark text-slate-400">-- Choose your College --</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id} className="bg-bg-dark text-white">
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:bg-bg-dark/80 focus:ring-4 focus:ring-brand/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:bg-bg-dark/80 focus:ring-4 focus:ring-brand/20"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:pointer-events-none mt-2" 
            disabled={loading}
          >
            <UserPlus size={18} />
            {loading ? 'Creating Account...' : 'Register as Student'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/5 pt-6">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-semibold hover:text-accent-light transition-colors ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
