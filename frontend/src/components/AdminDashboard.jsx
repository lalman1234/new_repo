import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Plus, Trash2, UserPlus, Users, Award, Landmark, 
  AlertCircle, CheckCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  
  const [trainerName, setTrainerName] = useState('');
  const [trainerEmail, setTrainerEmail] = useState('');
  const [trainerPassword, setTrainerPassword] = useState('');

  const [courseErr, setCourseErr] = useState('');
  const [courseOk, setCourseOk] = useState('');
  const [trainerErr, setTrainerErr] = useState('');
  const [trainerOk, setTrainerOk] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'super_admin') {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const cRes = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses`, { headers });
      if (cRes.ok) setCourses(await cRes.json());

      const tRes = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/trainers`, { headers });
      if (tRes.ok) setTrainers(await tRes.json());

      const sRes = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/students`, { headers });
      if (sRes.ok) setStudents(await sRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setCourseErr('');
    setCourseOk('');

    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: courseTitle, description: courseDesc })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create course');

      setCourseOk('Course added successfully!');
      setCourseTitle('');
      setCourseDesc('');
      fetchData();
    } catch (err) {
      setCourseErr(err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete course');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    setTrainerErr('');
    setTrainerOk('');

    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/trainers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: trainerName, email: trainerEmail, password: trainerPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create trainer');

      setTrainerOk('Trainer registered successfully!');
      setTrainerName('');
      setTrainerEmail('');
      setTrainerPassword('');
      fetchData();
    } catch (err) {
      setTrainerErr(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Super Admin Dashboard</h2>
        <p className="text-sm text-slate-400 mt-1">Manage and orchestrate courses, trainers, and college student connections centrally.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-card backdrop-blur-md border border-border-glass rounded-xl p-5 flex items-center gap-4 transition-all hover:border-border-glass-hover">
          <div className="bg-brand/10 p-3.5 rounded-xl border border-brand/20">
            <BookOpen size={24} className="text-brand" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white leading-none">{courses.length}</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Active Courses</p>
          </div>
        </div>
        <div className="bg-bg-card backdrop-blur-md border border-border-glass rounded-xl p-5 flex items-center gap-4 transition-all hover:border-border-glass-hover">
          <div className="bg-accent/10 p-3.5 rounded-xl border border-accent/20">
            <Award size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white leading-none">{trainers.length}</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Total Trainers</p>
          </div>
        </div>
        <div className="bg-bg-card backdrop-blur-md border border-border-glass rounded-xl p-5 flex items-center gap-4 transition-all hover:border-border-glass-hover">
          <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
            <Users size={24} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white leading-none">{students.length}</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Affiliated Students</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left side: Course CRUD and Lists (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Courses CRUD */}
          <div className="bg-bg-card backdrop-blur-md border border-border-glass rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pb-3 border-b border-white/5">
              <BookOpen size={20} className="text-brand" />
              Manage Course Catalogue
            </h3>

            <form onSubmit={handleAddCourse} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Course Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                    placeholder="e.g., Fullstack Web Development"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description / Syllabus</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                    placeholder="React, Node.js, and SQL details"
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-1">
                <button type="submit" className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
                  <Plus size={16} /> Add Course
                </button>
              </div>
            </form>

            {courseErr && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm mb-4">
                <AlertCircle size={16} className="shrink-0" />
                <span>{courseErr}</span>
              </div>
            )}
            {courseOk && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm mb-4">
                <CheckCircle size={16} className="shrink-0" />
                <span>{courseOk}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {courses.length === 0 ? (
                <p className="col-span-full text-center py-8 text-sm text-slate-500">No courses added yet.</p>
              ) : (
                courses.map((course) => (
                  <div key={course.id} className="bg-bg-dark/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-brand/35 hover:bg-bg-dark/60 transition-all">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <span className="font-semibold text-white leading-tight">{course.title}</span>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)} 
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-1.5 rounded-lg cursor-pointer transition-all shrink-0"
                        title="Delete Course"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description || 'No description provided.'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Enrolled Students Table */}
          <div className="bg-bg-card backdrop-blur-md border border-border-glass rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pb-3 border-b border-white/5">
              <Users size={20} className="text-emerald-400" />
              Enrolled Students
            </h3>
            <div className="overflow-x-auto rounded-xl border border-border-glass bg-bg-dark/30">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-dark/60 border-b border-border-glass text-slate-300">
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">College</th>
                    <th className="px-4 py-3 font-semibold">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-500">No students registered yet.</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 font-medium">{student.name}</td>
                        <td className="px-4 py-3 text-slate-400">{student.email}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5">
                            <Landmark size={14} className="text-slate-500" />
                            {student.college_name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{new Date(student.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side: Trainer Forms (1 Col) */}
        <div className="space-y-8">
          
          {/* Create Trainer Form */}
          <div className="bg-bg-card backdrop-blur-md border border-border-glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <UserPlus size={20} className="text-accent" />
              Create Trainer
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Trainer accounts are provisioned centrally by Super Admin.
            </p>

            {trainerErr && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm mb-4">
                <AlertCircle size={16} className="shrink-0" />
                <span>{trainerErr}</span>
              </div>
            )}
            {trainerOk && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm mb-4">
                <CheckCircle size={16} className="shrink-0" />
                <span>{trainerOk}</span>
              </div>
            )}

            <form onSubmit={handleAddTrainer} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Trainer Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder="e.g., Prof. Alan Turing"
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder="e.g., alan@institute.org"
                  value={trainerEmail}
                  onChange={(e) => setTrainerEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder="••••••••"
                  value={trainerPassword}
                  onChange={(e) => setTrainerPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(168,85,247,0.2)]">
                <Plus size={16} /> Provision Trainer
              </button>
            </form>
          </div>

          {/* List of Trainers */}
          <div className="bg-bg-card backdrop-blur-md border border-border-glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award size={20} className="text-accent" />
              Trainers List
            </h3>
            <div className="overflow-hidden rounded-xl border border-border-glass bg-bg-dark/30">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-dark/60 border-b border-border-glass text-slate-300">
                    <th className="px-4 py-2.5 font-semibold">Name</th>
                    <th className="px-4 py-2.5 font-semibold">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {trainers.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center py-4 text-slate-500">No trainers added.</td>
                    </tr>
                  ) : (
                    trainers.map((t) => (
                      <tr key={t.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{t.name}</td>
                        <td className="px-4 py-2.5 text-slate-400">{t.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
