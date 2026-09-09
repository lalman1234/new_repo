import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Shield, GraduationCap, Award } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    if (role === 'super_admin') return <Shield size={14} />;
    if (role === 'trainer') return <Award size={14} />;
    return <GraduationCap size={14} />;
  };

  const getRoleName = (role) => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'trainer') return 'Trainer';
    return 'Student';
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-bg-dark">
      {/* Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Navigation Header */}
      {token && user && (
        <nav className="w-full border-b border-border-glass bg-bg-dark/85 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-brand-light transition-colors">
              <BookOpen className="text-brand" size={24} />
              <span>Training Hub</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-sm font-medium text-white">{user.name}</span>
                <span className="inline-flex items-center gap-1 bg-brand/15 text-brand-light px-3 py-0.5 rounded-full text-2xs font-semibold uppercase tracking-wider">
                  {getRoleIcon(user.role)}
                  <span className="ml-1">{getRoleName(user.role)}</span>
                </span>
              </div>
              <div className="h-6 w-[1px] bg-white/10"></div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 font-medium text-sm transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Page Layout */}
      <main className="w-full flex-grow flex flex-col relative z-20">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/trainer" element={<TrainerDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route 
            path="/" 
            element={
              token && user ? (
                user.role === 'super_admin' ? (
                  <Navigate to="/admin" replace />
                ) : user.role === 'trainer' ? (
                  <Navigate to="/trainer" replace />
                ) : (
                  <Navigate to="/student" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
