/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Download,
  Users,
  Award,
  Shield,
  Search,
  RefreshCw,
  Check,
  ExternalLink,
  Sparkles,
  BookOpen,
  X,
  Code,
  Clock,
  AlertCircle,
  GraduationCap
} from "lucide-react";
import { JAVA_SESSIONS } from "../javaData";

interface StudentRecord {
  USN: string;
  Name: string;
  Streak: number;
  CompletedProblemsCount: number;
  CompletedProblemsList?: string;
  CompletedQuizzesCount: number;
  CompletedQuizzesList?: string;
  CodingMarks?: number;
  QuizMarks?: number;
  TotalMarks?: number;
  Grade?: string;
  CertificateEarned: string;
  LastActiveDate: string;
  RegistrationTime: string;
  SubmittedCodes?: string; // Stored JSON string
}

export default function FacultyConsole() {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [inspectorProblemId, setInspectorProblemId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/students");
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        setError("Failed to fetch student records. Ensure the server is online.");
      }
    } catch (e) {
      setError("Network error connecting to local grading server.");
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
  
  // Aggregate overall solutions count
  const totalProblemsSolved = records.reduce((sum, r) => sum + (Number(r.CompletedProblemsCount) || 0), 0);
  
  // Average total marks
  const averageMarks = totalStudents
    ? Math.round(records.reduce((sum, r) => sum + (Number(r.TotalMarks) || 0), 0) / totalStudents)
    : 0;

  const getGradeColor = (g?: string) => {
    if (!g) return "bg-slate-100 text-slate-800 border-slate-200";
    switch (g.toUpperCase()) {
      case "S": return "bg-purple-100 text-purple-850 border-purple-200 text-purple-700 font-bold";
      case "A": return "bg-emerald-100 text-emerald-850 border-emerald-200 text-emerald-700 font-bold";
      case "B": return "bg-indigo-100 text-indigo-850 border-indigo-200 text-indigo-700 font-bold";
      case "C": return "bg-blue-100 text-blue-850 border-blue-200 text-blue-700 font-bold";
      case "D": return "bg-amber-100 text-amber-850 border-amber-200 text-amber-700 font-bold";
      default: return "bg-rose-100 text-rose-850 border-rose-200 text-rose-700 font-bold";
    }
  };

  const getDifficultyPoints = (diff: string) => {
    if (diff === "Easy") return 10;
    if (diff === "Medium") return 15;
    return 20; // Hard
  };

  // Helper to parse student's submitted code for inspector
  const getStudentSubmittedCode = (student: StudentRecord, problemId: string) => {
    if (!student.SubmittedCodes) return "";
    try {
      const codes = JSON.parse(student.SubmittedCodes);
      return codes[problemId] || "";
    } catch {
      return "";
    }
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="mx-auto max-w-none w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-8" id="faculty-console">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-350">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-sans text-[10px] font-black tracking-widest uppercase text-indigo-300">CSE Department Administration</span>
            </div>
            <h1 className="font-sans text-2xl font-black uppercase tracking-tight text-white">
              Laboratory Grading & Evaluation Console
            </h1>
            <p className="font-sans text-xs text-slate-350 leading-relaxed max-w-2xl font-semibold">
              Real-time progression dashboard and physical Java code inspection portal. This panel audits completed student tasks from <code className="bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-700 text-indigo-350 font-bold">student_progress.xlsx</code> and assigns detailed grades.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchRecords}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-3.5 text-xs font-black uppercase tracking-wider border-2 border-slate-700 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Spreadsheet
            </button>
            <a
              href="/api/admin/download-excel"
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3.5 text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-950/40 active:translate-y-0.5 transition-all"
              id="btn-download-excel"
            >
              <Download className="h-4 w-4" />
              Download Graded Excel
            </a>
          </div>
        </div>
      </div>

      {/* Analytics Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="faculty-stats-grid">
        <div className="bg-white border-4 border-slate-100 p-5 rounded-3xl shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">Students Enrolled</p>
            <p className="font-sans text-xl font-black text-gray-900 mt-1">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-white border-4 border-slate-100 p-5 rounded-3xl shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">Certificates Issued</p>
            <p className="font-sans text-xl font-black text-gray-900 mt-1">{certificatesAwarded}</p>
          </div>
        </div>

        <div className="bg-white border-4 border-slate-100 p-5 rounded-3xl shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">Codes Compiled</p>
            <p className="font-sans text-xl font-black text-gray-900 mt-1">{totalProblemsSolved}</p>
          </div>
        </div>

        <div className="bg-white border-4 border-slate-100 p-5 rounded-3xl shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 border border-purple-100">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">Average Score</p>
            <p className="font-sans text-xl font-black text-gray-900 mt-1">{averageMarks} / 500</p>
          </div>
        </div>
      </div>

      {/* Student Registry Table */}
      <div className="bg-white border-4 border-slate-100 rounded-3xl shadow-lg overflow-hidden animate-fade-in" id="faculty-records-card">
        {/* Card Header & Search bar */}
        <div className="p-6 border-b-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sans text-base font-extrabold text-slate-800 uppercase tracking-tight">Active Graded Student Register</h3>
            <p className="font-sans text-[11px] text-gray-500 font-bold mt-1">
              Select any student record to launch the **Detailed Lab Gradebook** and inspect their custom written code submissions.
            </p>
          </div>

          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search USN or Name..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-gray-900 font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && records.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
            <p className="font-sans text-xs text-gray-500 font-extrabold uppercase tracking-widest">
              Reading student_progress.xlsx database...
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 bg-rose-50/20 max-w-xl mx-auto rounded-2xl my-6 border border-rose-150">
            <p className="font-sans text-xs font-black uppercase tracking-wider">{error}</p>
            <button
              onClick={fetchRecords}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all"
            >
              Retry Database Connection
            </button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="font-sans text-xs font-extrabold uppercase tracking-wider">No Student Records Found</p>
            <p className="font-sans text-[11px] text-gray-400 mt-1">Try resetting your search query or logging in from the student panel.</p>
          </div>
        ) : (
          /* Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b-2 border-slate-100 text-slate-500 select-none">
                  <th className="font-sans text-[10px] font-black uppercase tracking-widest p-4">University USN</th>
                  <th className="font-sans text-[10px] font-black uppercase tracking-widest p-4">Student Name</th>
                  <th className="font-sans text-[10px] font-black uppercase tracking-widest p-4 text-center">Streak</th>
                  <th className="font-sans text-[10px] font-black uppercase tracking-widest p-4 text-center">Solves (30)</th>
                  <th className="font-sans text-[10px] font-black uppercase tracking-widest p-4 text-center">Quizzes (10)</th>
                  <th className="font-sans text-[10px] font-black uppercase tracking-widest p-4 text-center">Lab Marks (500)</th>
                  <th className="font-sans text-[10px] font-black uppercase tracking-widest p-4 text-center">Grade</th>
                  <th className="font-sans text-[10px] font-black uppercase tracking-widest p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => (
                  <tr key={record.USN} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-4 font-mono text-xs font-black text-indigo-950 tracking-wider">
                      {record.USN}
                    </td>
                    <td className="p-4">
                      <div className="font-sans text-xs font-extrabold text-slate-800">{record.Name}</div>
                      <div className="font-sans text-[9px] text-gray-400 uppercase tracking-wider font-bold">Logged: {record.RegistrationTime ? new Date(record.RegistrationTime).toLocaleDateString() : 'N/A'}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-black text-orange-600">
                        🔥 {record.Streak || 1}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="font-mono text-xs font-bold text-slate-700">
                        {record.CompletedProblemsCount || 0} / 30
                      </div>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full mx-auto mt-1 overflow-hidden border border-slate-200">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, ((record.CompletedProblemsCount || 0) / 30) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {record.CompletedQuizzesCount || 0} / 5
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {record.TotalMarks || 0} / 500
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] ${getGradeColor(record.Grade)}`}>
                        Grade {record.Grade || "F"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedStudent(record);
                          setInspectorProblemId(null);
                        }}
                        className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-sans text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all hover:shadow-md cursor-pointer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grade and Solutions Evaluation Overlay Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="evaluation-gradebook-modal">
          <div className="bg-white rounded-3xl border-4 border-slate-100 w-full max-w-6xl h-[88vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white border-b-2 border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans text-lg font-black uppercase tracking-tight text-white">{selectedStudent.Name}</h3>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-850 rounded border border-slate-700 text-indigo-400 tracking-wider uppercase">USN: {selectedStudent.USN}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                    Last active in portal: {selectedStudent.LastActiveDate || 'N/A'} • Solved: {selectedStudent.CompletedProblemsCount || 0}/30 Programs • Quizzes: {selectedStudent.CompletedQuizzesCount || 0}/5 Modules
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {/* Scorecard Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-50 border-b-2 border-slate-100 p-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 shrink-0 select-none">
              <div className="p-2 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Coding Score</span>
                <span className="font-mono text-xl font-black text-slate-800 block mt-1">{selectedStudent.CodingMarks || 0} / 450</span>
              </div>
              <div className="p-2 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Quiz Score</span>
                <span className="font-mono text-xl font-black text-slate-800 block mt-1">{selectedStudent.QuizMarks || 0} / 50</span>
              </div>
              <div className="p-2 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Lab Marks</span>
                <span className="font-mono text-2xl font-black text-indigo-650 block mt-0.5 text-indigo-600">{selectedStudent.TotalMarks || 0} / 500</span>
              </div>
              <div className="p-2 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Course Grade</span>
                <span className={`inline-flex px-3.5 py-0.5 rounded border-2 text-xs uppercase tracking-wider font-black mt-1 ${getGradeColor(selectedStudent.Grade)}`}>
                  Grade {selectedStudent.Grade || "F"}
                </span>
              </div>
            </div>

            {/* Modal Split Content Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-full">
              
              {/* Left Column: Exercises & Quizzes List */}
              <div className="md:col-span-5 border-r-2 border-slate-100 flex flex-col h-full overflow-hidden bg-slate-50/50">
                <div className="p-4 border-b border-slate-150 bg-white">
                  <span className="text-[11px] font-black text-indigo-950 uppercase tracking-widest">
                    Course Challenges List
                  </span>
                </div>

                {/* Problems scroll container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {JAVA_SESSIONS.map((session) => (
                    <div key={session.num} className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="font-mono text-[9px] font-black text-indigo-900 uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          Module {session.num}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {session.title.split(" - ")[0]}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {session.problems.map((prob) => {
                          const solvedList = selectedStudent.CompletedProblemsList
                            ? selectedStudent.CompletedProblemsList.split(",")
                            : [];
                          const isSolved = solvedList.includes(prob.id);
                          const isActive = inspectorProblemId === prob.id;

                          return (
                            <button
                              key={prob.id}
                              onClick={() => setInspectorProblemId(prob.id)}
                              className={`w-full text-left p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                                isActive
                                  ? "bg-indigo-50/50 border-indigo-400 shadow-sm"
                                  : "bg-white border-slate-100 hover:border-indigo-150"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <h4 className="font-sans text-xs font-black text-slate-800 line-clamp-1">
                                  {prob.title}
                                </h4>
                                <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">
                                  {prob.difficulty} • Max {getDifficultyPoints(prob.difficulty)} Marks
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {isSolved ? (
                                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Done
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                    Pending
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Detailed Code Inspector */}
              <div className="md:col-span-7 flex flex-col h-full overflow-hidden bg-white">
                {inspectorProblemId ? (
                  (() => {
                    const activeProb = JAVA_SESSIONS.flatMap((s) => s.problems).find((p) => p.id === inspectorProblemId);
                    if (!activeProb) return null;

                    const solvedList = selectedStudent.CompletedProblemsList
                      ? selectedStudent.CompletedProblemsList.split(",")
                      : [];
                    const isSolved = solvedList.includes(activeProb.id);
                    const customCode = getStudentSubmittedCode(selectedStudent, activeProb.id);

                    return (
                      <div className="flex-col h-full overflow-y-auto p-6 space-y-6">
                        <div className="space-y-2 border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded border ${
                              activeProb.difficulty === "Easy" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                              activeProb.difficulty === "Medium" ? "text-amber-700 bg-amber-50 border-amber-200" :
                              "text-rose-700 bg-rose-50 border-rose-200"
                            }`}>
                              {activeProb.difficulty} ({getDifficultyPoints(activeProb.difficulty)} Marks)
                            </span>
                            <span className="font-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              ID: {activeProb.id}
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-slate-800 uppercase tracking-tight">
                            {activeProb.title}
                          </h4>
                          <p className="font-sans text-[11px] text-slate-600 leading-relaxed font-semibold">
                            <span className="font-black text-slate-800">Question:</span> {activeProb.question}
                          </p>
                        </div>

                        {/* Checklist criteria */}
                        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-150 space-y-3 shrink-0">
                          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest block">
                            Automated Code Checklist Verification
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                            <div className="flex items-center gap-2">
                              {isSolved ? (
                                <Check className="h-4 w-4 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                              ) : (
                                <X className="h-4 w-4 text-slate-400 bg-slate-100 rounded-full p-0.5" />
                              )}
                              <span>Problem Flagged as Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {customCode.includes("class") ? (
                                <Check className="h-4 w-4 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                              ) : (
                                <X className="h-4 w-4 text-slate-400 bg-slate-100 rounded-full p-0.5" />
                              )}
                              <span>Valid Class declaration found</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {customCode.includes("Scanner") ? (
                                <Check className="h-4 w-4 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                              ) : (
                                <X className="h-4 w-4 text-slate-400 bg-slate-100 rounded-full p-0.5" />
                              )}
                              <span>Utilizes Scanner library utility</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {customCode.length > 80 ? (
                                <Check className="h-4 w-4 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                              ) : (
                                <X className="h-4 w-4 text-slate-400 bg-slate-100 rounded-full p-0.5" />
                              )}
                              <span>Meets minimal syntax volume</span>
                            </div>
                          </div>
                        </div>

                        {/* Code editor container */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] text-slate-400 font-extrabold uppercase tracking-widest">
                              Submitted Source Repository
                            </span>
                            {customCode && (
                              <button
                                onClick={() => handleCopyCode(customCode)}
                                className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-150 transition-all cursor-pointer"
                              >
                                {copiedCode ? "Copied!" : "Copy Code"}
                              </button>
                            )}
                          </div>

                          {customCode ? (
                            <div className="rounded-2xl bg-slate-950 p-4 overflow-hidden border-2 border-slate-900 shadow-inner">
                              <pre className="font-mono text-xs text-slate-200 select-all overflow-x-auto max-h-[350px] leading-relaxed font-semibold pr-2">
                                {customCode}
                              </pre>
                            </div>
                          ) : (
                            <div className="p-8 border-4 border-dashed border-slate-150 rounded-2xl text-center text-slate-400">
                              <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                              {isSolved ? (
                                <p className="font-sans text-xs font-black uppercase">
                                  No code submitted for this exercise yet. Student bypassed with manual Done status.
                                </p>
                              ) : (
                                <p className="font-sans text-xs font-black uppercase text-slate-450">
                                  This exercise is currently pending. Custom Java code will be loaded here once resolved.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 select-none">
                    <Code className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="font-sans text-xs font-black uppercase tracking-wider">No Exercise Selected</p>
                    <p className="font-sans text-[11px] text-slate-400 max-w-sm mt-1 leading-relaxed">
                      Select any session exercise on the left to inspect code, audit student submission parameters, and review the detailed grading rubrics.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Info Note */}
      <div className="p-5 bg-indigo-50 border border-indigo-150 rounded-3xl flex items-start gap-4">
        <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-sans text-xs font-black text-indigo-950 uppercase tracking-tight">Examiners Portal Guidelines</h4>
          <p className="font-sans text-[11px] text-indigo-900 leading-relaxed font-semibold">
            This administration console reads progress records directly from <code className="bg-indigo-100/80 px-1 py-0.5 rounded font-mono text-[10px]">student_progress.xlsx</code>, calculating detailed score breakdowns automatically based on:
          </p>
          <ul className="list-disc pl-4 text-[10px] text-indigo-900/90 font-bold space-y-0.5 mt-1">
            <li>EASY PROBLEMS: 10 Marks each</li>
            <li>MEDIUM PROBLEMS: 15 Marks each</li>
            <li>HARD PROBLEMS: 20 Marks each</li>
            <li>STUDENT QUIZZES: 2 Marks per correct answer (Total 10 Marks per Module)</li>
            <li>OVERALL GRADE SCALES: S (Outstanding &gt;=90%), A (Excellent &gt;=80%), B (Very Good &gt;=70%), C (Good &gt;=60%), D (Pass &gt;=50%), F (Fail &lt;50%)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
