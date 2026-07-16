/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { JAVA_SESSIONS } from "../javaData";
import { Trophy, CheckCircle, Code, Shield, HelpCircle, BookOpen, Clock, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

interface DashboardProps {
  completedProblems: string[];
  completedQuizzes: Record<string, number>; // quizId -> score
  setCurrentTab: (tab: string) => void;
  setSelectedSessionNum: (num: number) => void;
  streak: number;
}

export default function Dashboard({
  completedProblems,
  completedQuizzes,
  setCurrentTab,
  setSelectedSessionNum,
  streak,
}: DashboardProps) {
  const totalProblemsCount = 30;
  const solvedProblemsCount = completedProblems.length;
  const problemsPercent = Math.round((solvedProblemsCount / totalProblemsCount) * 100);

  const totalQuizzesCount = 5; // 1 per session representing the 5 sessions
  const solvedQuizzesCount = Object.keys(completedQuizzes).length;
  const quizzesPercent = Math.round((solvedQuizzesCount / totalQuizzesCount) * 100);

  const overallProgress = Math.round(
    ((solvedProblemsCount + solvedQuizzesCount) / (totalProblemsCount + totalQuizzesCount)) * 100
  );

  const handleResumeSession = (num: number) => {
    setSelectedSessionNum(num);
    setCurrentTab("syllabus");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="dashboard-container">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 shadow-xl border-4 border-indigo-100 text-white" id="welcome-hero">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-600 px-3 py-1 border border-rose-200">
              <Sparkles className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest">
                Department of CSE Portal
              </span>
            </div>
            <h2 className="font-sans text-2xl sm:text-3.5xl font-black tracking-tight uppercase">
              10-Hour Core Java Training Program
            </h2>
            <p className="max-w-2xl text-indigo-100 text-xs sm:text-sm leading-relaxed font-semibold">
              Welcome, CSE Java Explorer! Elevate your real-world programming problem-solving skills systematically across 5 core modules. Learn fundamentals, arrays, and OOP structure with live simulated test evaluations.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm p-5 border-2 border-white/20 text-center min-w-[160px] self-start md:self-auto shadow-inner">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">{overallProgress}%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mt-1.5">Overall Progress</span>
          </div>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute left-1/3 bottom-0 -mb-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      {/* Offline Banner notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-orange-100 border-4 border-orange-200 shadow-md" id="offline-banner">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-orange-200 text-orange-800 border-2 border-orange-300">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black text-orange-800 uppercase tracking-wider">Exam Prep Mode Active</span>
            </div>
            <p className="font-sans text-xs text-orange-700 leading-relaxed font-semibold">
              Your codes, completed statuses, and quiz records are fully secured in local storage. Adaptive quizzes generated based on HKBK curriculum data. Learn on campus or in labs with zero internet requirement.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-white text-orange-800 px-3 py-1.5 rounded-full border-2 border-orange-200 uppercase tracking-widest font-black shrink-0 self-start sm:self-auto">
          Local Storage Sync
        </span>
      </div>

      {/* Grid of Main Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3" id="analytics-grid">
        {/* Card 1: Streak */}
        <div className="bg-emerald-500 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-black text-xs uppercase opacity-85 tracking-widest">Current Streak</span>
            <div className="w-8 h-8 bg-emerald-400/30 rounded-lg flex items-center justify-center border border-emerald-300/30">
              <Trophy className="h-4.5 w-4.5" />
            </div>
          </div>
          <h4 className="text-4xl font-black mt-4">{streak} Days</h4>
          <div className="h-1.5 w-full bg-emerald-400 rounded-full mt-4"></div>
        </div>

        {/* Card 2: Code Points */}
        <div className="bg-amber-400 rounded-3xl p-6 text-indigo-950 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-black text-xs uppercase opacity-85 tracking-widest">Code Points</span>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center border border-white/20">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
          </div>
          <h4 className="text-4xl font-black mt-4">
            {((solvedProblemsCount * 100) + (solvedQuizzesCount * 50)).toLocaleString()}
          </h4>
          <p className="text-[10px] font-extrabold uppercase mt-4 text-indigo-900 tracking-widest">Top 5% of CSE Batch</p>
        </div>

        {/* Card 3: Offline Content sync status */}
        <div className="bg-white rounded-3xl p-6 border-4 border-indigo-50 flex flex-col justify-between shadow-lg">
          <div>
            <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Offline Content</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-black text-slate-700">Local Sync</span>
              <span className="text-[10px] px-2.5 py-0.5 bg-emerald-100 text-emerald-600 rounded-full font-black uppercase">Active</span>
            </div>
          </div>
          <div className="mt-3 space-y-1 border-t border-gray-100 pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Quizzes Ready</span>
              <span className="font-mono text-xs font-black">1.2 MB</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Code Snippets</span>
              <span className="font-mono text-xs font-black">450 KB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session wise training structure */}
      <div className="space-y-4" id="sessions-progress-section">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-sans text-xl sm:text-2xl font-black tracking-tight text-indigo-900 uppercase">
              Course Modules
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mt-1">
              Each module lasts 2 Hours and contains exactly 6 real-world challenges.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab("syllabus")}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-2 border-indigo-100 font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
          >
            <span>View Syllabus</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Dynamic List of 5 Sessions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5" id="sessions-grid">
          {JAVA_SESSIONS.map((session) => {
            const completedCount = session.problems.filter((p) =>
              completedProblems.includes(p.id)
            ).length;
            const completionPercent = Math.round((completedCount / 6) * 100);

            return (
              <div
                key={session.num}
                className="group flex flex-col justify-between rounded-3xl border-4 border-indigo-50 bg-white p-5 shadow-md hover:shadow-xl hover:border-indigo-400 transition-all cursor-pointer"
                onClick={() => handleResumeSession(session.num)}
                id={`session-card-${session.num}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full uppercase border-2 border-indigo-100">
                      Module 0{session.num}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {session.duration}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {session.title}
                    </h4>
                    <p className="font-sans text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed font-medium">
                      {session.topics.slice(0, 4).join(", ")}...
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Problems</span>
                    <span className="font-mono font-black text-slate-800">{completedCount} / 6</span>
                  </div>
                  {/* Progress Line */}
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    ></div>
                  </div>
                  {/* CTA */}
                  <div className="flex items-center justify-end pt-1">
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-indigo-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      Open Module <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helpful Quick Guide */}
      <div className="rounded-3xl border-4 border-indigo-50 bg-indigo-50/20 p-6 shadow-sm space-y-4" id="quick-guide-panel">
        <h4 className="font-sans text-sm font-black text-indigo-900 uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-indigo-600" />
          Core Java Training Curriculum Guide
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs leading-relaxed text-slate-600">
          <div className="space-y-1.5 bg-white p-4 rounded-2xl border-2 border-indigo-100 shadow-sm hover:border-indigo-300 transition-colors">
            <span className="font-black text-indigo-900 font-sans uppercase tracking-wider">1. Theoretical Foundation</span>
            <p className="font-medium text-[11px] text-slate-500 leading-relaxed">Every topic includes structured scenario, explanations, and core syntax. Read concepts thoroughly before coding.</p>
          </div>
          <div className="space-y-1.5 bg-white p-4 rounded-2xl border-2 border-indigo-100 shadow-sm hover:border-indigo-300 transition-colors">
            <span className="font-black text-indigo-900 font-sans uppercase tracking-wider">2. Interactive Code Puzzles</span>
            <p className="font-medium text-[11px] text-slate-500 leading-relaxed">Write Java inside simulated playgrounds. Validate custom inputs and review expected console logs instantly.</p>
          </div>
          <div className="space-y-1.5 bg-white p-4 rounded-2xl border-2 border-indigo-100 shadow-sm hover:border-indigo-300 transition-colors">
            <span className="font-black text-indigo-900 font-sans uppercase tracking-wider">3. Dynamic Quizzes</span>
            <p className="font-medium text-[11px] text-slate-500 leading-relaxed">Complete multi-choice quiz tests. Track your scores. Obtain the CSE Department Certification when fully complete!</p>
          </div>
        </div>
      </div>
    </div>
  );

}
