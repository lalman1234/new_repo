import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Trash2, Award, AlertCircle, CheckCircle } from 'lucide-react';

export default function TrainerDashboard() {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role !== 'trainer') {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCourses(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: courseTitle, description: courseDesc })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create course');

      setSuccess('Course added successfully!');
      setCourseTitle('');
      setCourseDesc('');
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete course');
      fetchCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Trainer Workspace</h2>
        <p className="text-sm text-slate-400 mt-1">Welcome back, <strong className="text-white">{user.name}</strong>. Here you can curate the course schedule and content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left side: Course Grid (2 Cols) */}
        <div className="lg:col-span-2 bg-bg-card backdrop-blur-md border border-border-glass rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pb-3 border-b border-white/5">
            <BookOpen size={20} className="text-brand" />
            Course Curriculum
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3">{course.description || 'No description provided.'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side: Add Course Form (1 Col) */}
        <div className="bg-bg-card backdrop-blur-md border border-border-glass rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Plus size={20} className="text-brand" />
            Create Course
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Publish new subjects and study schedules for students across affiliated colleges.
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm mb-4">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm mb-4">
              <CheckCircle size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Course Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                placeholder="e.g., Cloud Architectures"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description</label>
              <textarea
                className="w-full px-4 py-2 rounded-xl border border-white/10 bg-bg-dark/50 text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 resize-none"
                placeholder="Core topics, syllabus, and assignment details..."
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                rows="4"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
              <Plus size={16} /> Add Course
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
