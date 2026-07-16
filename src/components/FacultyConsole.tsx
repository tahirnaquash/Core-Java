import React, { useState, useEffect } from "react";
import { Download, Users, Award, Shield, Search, RefreshCw, Trash2, Check, ExternalLink, Sparkles, BookOpen } from "lucide-react";

interface StudentRecord {
  USN: string;
  Name: string;
  Streak: number;
  CompletedProblemsCount: number;
  CompletedProblemsList?: string;
  CompletedQuizzesCount: number;
  CompletedQuizzesList?: string;
  CertificateEarned: string;
  LastActiveDate: string;
  RegistrationTime: string;
}

export default function FacultyConsole() {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/students");
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        setError("Failed to fetch students. Ensure the local server is running.");
      }
    } catch (e) {
      setError("Network error connecting to local server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.USN.toLowerCase().includes(term) ||
      r.Name.toLowerCase().includes(term)
    );
  });

  // Calculate statistics
  const totalStudents = records.length;
  const certificatesAwarded = records.filter((r) => r.CertificateEarned === "Yes").length;
  const totalProblemsSolved = records.reduce((sum, r) => sum + (Number(r.CompletedProblemsCount) || 0), 0);
  const averageStreak = totalStudents
    ? Math.round((records.reduce((sum, r) => sum + (Number(r.Streak) || 0), 0) / totalStudents) * 10) / 10
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="faculty-console">
      {/* Top Banner */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_60%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-sans text-[10px] font-black tracking-widest uppercase">CSE Faculty Administration</span>
            </div>
            <h1 className="font-sans text-2xl font-black uppercase tracking-tight">
              Laboratory Progress Console
            </h1>
            <p className="font-sans text-xs text-indigo-200/80 leading-relaxed max-w-2xl font-medium">
              Real-time monitoring panel for CSE course instructors and lab examiners. This console fetches records directly from <code className="bg-indigo-900/40 px-1.5 py-0.5 rounded font-mono border border-indigo-800">student_progress.xlsx</code> on the server-side file system.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchRecords}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-2xl bg-indigo-900/60 hover:bg-indigo-900 text-indigo-100 px-4 py-3.5 text-xs font-black uppercase tracking-wider border border-indigo-800 active:translate-y-0.5 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
            <a
              href="/api/admin/download-excel"
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-950/40 active:translate-y-0.5 transition-all"
              id="btn-download-excel"
            >
              <Download className="h-4 w-4" />
              Download Excel Sheet
            </a>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="faculty-stats-grid">
        <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">Students Enrolled</p>
            <p className="font-sans text-xl font-black text-gray-900 mt-1">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">Certificates Earned</p>
            <p className="font-sans text-xl font-black text-gray-900 mt-1">{certificatesAwarded}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">Exercises Solved</p>
            <p className="font-sans text-xl font-black text-gray-900 mt-1">{totalProblemsSolved}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Study Streak</p>
            <p className="font-sans text-xl font-black text-gray-900 mt-1">{averageStreak} Days</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-150 rounded-3xl shadow-sm overflow-hidden" id="faculty-records-card">
        {/* Card Header & Search bar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sans text-base font-extrabold text-gray-900 uppercase tracking-tight">Student Enrollment & Progression</h3>
            <p className="font-sans text-[11px] text-gray-500 font-semibold mt-1">
              Showing {filteredRecords.length} of {records.length} records. Search by USN or Name.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search USN or Name..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-gray-900 font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && records.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
            <p className="font-sans text-xs text-gray-500 font-extrabold uppercase tracking-widest">
              Fetching spreadsheet data...
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 bg-rose-50/20 max-w-xl mx-auto rounded-2xl my-6 border border-rose-100">
            <p className="font-sans text-xs font-bold uppercase tracking-wider">{error}</p>
            <button
              onClick={fetchRecords}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="font-sans text-xs font-extrabold uppercase tracking-wider">No Student Records Found</p>
            <p className="font-sans text-[11px] text-gray-400 mt-1">Try resetting your search query or registering new students.</p>
          </div>
        ) : (
          /* Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest p-4">University USN</th>
                  <th className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest p-4">Student Name</th>
                  <th className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest p-4 text-center">Streak</th>
                  <th className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest p-4 text-center">Solves (out of 30)</th>
                  <th className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest p-4 text-center">Quizzes (out of 10)</th>
                  <th className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest p-4 text-center">Certificate</th>
                  <th className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest p-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((record) => (
                  <tr key={record.USN} className="hover:bg-indigo-50/25 transition-colors">
                    <td className="p-4 font-mono text-[11px] font-black text-indigo-900 tracking-wider">
                      {record.USN}
                    </td>
                    <td className="p-4">
                      <div className="font-sans text-xs font-extrabold text-gray-900">{record.Name}</div>
                      <div className="font-sans text-[9px] text-gray-400 uppercase tracking-wider">Registered: {record.RegistrationTime ? new Date(record.RegistrationTime).toLocaleDateString() : 'N/A'}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-black text-orange-600">
                        🔥 {record.Streak || 1}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="font-mono text-xs font-bold text-gray-900">
                        {record.CompletedProblemsCount || 0} / 30
                      </div>
                      <div className="w-16 bg-gray-100 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, ((record.CompletedProblemsCount || 0) / 30) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-mono text-xs font-bold text-gray-900">
                        {record.CompletedQuizzesCount || 0} / 10
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${record.CertificateEarned === "Yes" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-50 text-gray-400 border border-gray-200"}`}>
                        {record.CertificateEarned === "Yes" ? "Awarded" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-sans text-[11px] font-semibold text-gray-600">
                        {record.LastActiveDate || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guide Note */}
      <div className="p-5 bg-indigo-50 border border-indigo-150 rounded-3xl flex items-start gap-4">
        <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-sans text-xs font-black text-indigo-950 uppercase tracking-tight">Instructors & Examiners Tip</h4>
          <p className="font-sans text-[11px] text-indigo-900 leading-relaxed font-semibold">
            The Excel file <code className="bg-indigo-100/80 px-1 py-0.5 rounded font-mono text-[10px]">student_progress.xlsx</code> is saved directly in the server's working directory. You can download it using the button above and open it in Microsoft Excel, Google Sheets, or LibreOffice to grade students, analyze pass-fail percentages, or keep formal departmental registers.
          </p>
        </div>
      </div>
    </div>
  );
}
