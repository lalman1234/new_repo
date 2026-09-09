import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Landmark, User, Mail, GraduationCap } from 'lucide-react';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchStudentData = async () => {
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const pRes = await fetch('http://localhost:5000/api/auth/me', { headers });
        if (pRes.ok) {
          const profileData = await pRes.json();
          if (profileData.role !== 'student') {
            navigate('/login');
            return;
          }
          setProfile(profileData);
        } else {
          navigate('/login');
          return;
        }

        const cRes = await fetch('http://localhost:5000/api/courses', { headers });
        if (cRes.ok) {
          setCourses(await cRes.json());
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchStudentData();
  }, [token, navigate]);

  if (!profile) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-400 animate-pulse text-sm">Loading your profile details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Student Hub</h2>
        <p className="text-sm text-slate-400 mt-1">Access your centralized learning dashboard and course schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Courses list (2 Cols) */}
        <div className="lg:col-span-2 bg-bg-card backdrop-blur-md border border-border-glass rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <BookOpen size={20} className="text-brand" />
            Available Courses
          </h3>
          <p className="text-xs text-slate-400 mb-6 pb-3 border-b border-white/5">
            These courses are published centrally and available to students of all connected colleges.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.length === 0 ? (
              <p className="col-span-full text-center py-8 text-sm text-slate-500">No courses published yet.</p>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="bg-bg-dark/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-brand/35 hover:bg-bg-dark/60 transition-all">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <span className="font-semibold text-white leading-tight">{course.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3">{course.description || 'No course syllabus description details yet.'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Student Profile & College Info (1 Col) */}
        <div className="bg-bg-card backdrop-blur-md border border-border-glass rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pb-3 border-b border-white/5">
            <GraduationCap size={20} className="text-accent" />
            Academic Info
          </h3>

          <div className="flex flex-col gap-5 mt-2">
            <div className="flex items-center gap-3">
              <div className="bg-brand/10 p-2.5 rounded-xl border border-brand/20 shrink-0">
                <User size={18} className="text-brand-light" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Full Name</span>
                <span className="text-sm font-medium text-white block truncate">{profile.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-brand/10 p-2.5 rounded-xl border border-brand/20 shrink-0">
                <Mail size={18} className="text-brand-light" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Email Address</span>
                <span className="text-sm font-medium text-white block truncate">{profile.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2.5 rounded-xl border border-accent/20 shrink-0">
                <Landmark size={18} className="text-accent-light" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Affiliated College</span>
                <span className="text-sm font-semibold text-accent-light block truncate">{profile.college_name || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
