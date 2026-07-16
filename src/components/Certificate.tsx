/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Trophy, Award, CheckCircle, Code, ShieldCheck, Printer, ArrowRight, Star } from "lucide-react";

interface CertificateProps {
  completedProblems: string[];
  completedQuizzes: Record<string, number>;
  setCurrentTab: (tab: string) => void;
}

export default function Certificate({
  completedProblems,
  completedQuizzes,
  setCurrentTab,
}: CertificateProps) {
  const [studentName, setStudentName] = useState("");
  const totalProblemsCount = 30;
  const solvedCount = completedProblems.length;
  
  const totalQuizzesCount = 5;
  const quizzesCount = Object.keys(completedQuizzes).length;

  const isEligible = solvedCount >= totalProblemsCount && quizzesCount >= totalQuizzesCount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="certificate-tab-container">
      {/* CASE 1: NOT YET ELIGIBLE - SHOW DETAILED SCORECARD PROGRESS */}
      {!isEligible ? (
        <div className="space-y-6" id="certificate-locked-screen">
          <div className="space-y-1">
            <h2 className="font-sans text-xl sm:text-2xl font-black tracking-tight text-indigo-900 uppercase">
              Departmental Certification of Mastery
            </h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mt-1">
              Complete all 30 programming problems and score in all 5 session quiz decks to unlock your academic certificate.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2" id="certification-progress-cards">
            {/* Programming completion card */}
            <div className="rounded-3xl border-4 border-indigo-50 bg-white p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-black text-slate-800 uppercase tracking-wider">Programming Exercises</span>
                <div className="rounded-xl p-2.5 bg-indigo-50 text-indigo-800 border-2 border-indigo-100">
                  <Code className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <span>Solved Problems</span>
                  <span className="font-mono font-black">{solvedCount} / {totalProblemsCount}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${(solvedCount / totalProblemsCount) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed font-semibold">
                You must complete all 30 problems systematically from Session 1 to Session 5 to ensure comprehensive hands-on programming experience.
              </p>
              <button
                onClick={() => setCurrentTab("syllabus")}
                id="btn-goto-syllabus"
                className="w-full flex items-center justify-center gap-1.5 text-xs font-black bg-indigo-50 text-indigo-700 border-2 border-indigo-100 py-3 rounded-2xl hover:bg-indigo-100 transition-all uppercase tracking-widest"
              >
                <span>Browse Exercises</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Quiz completion card */}
            <div className="rounded-3xl border-4 border-indigo-50 bg-white p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-black text-slate-800 uppercase tracking-wider">Quiz Decks Played</span>
                <div className="rounded-xl p-2.5 bg-indigo-50 text-indigo-800 border-2 border-indigo-100">
                  <Trophy className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <span>Decks Finished</span>
                  <span className="font-mono font-black">{quizzesCount} / {totalQuizzesCount}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${(quizzesCount / totalQuizzesCount) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed font-semibold">
                You must attempt the final multi-choice questions representing the 5 core modules to test and secure your theoretical core knowledge.
              </p>
              <button
                onClick={() => setCurrentTab("quizDeck")}
                id="btn-goto-quiz"
                className="w-full flex items-center justify-center gap-1.5 text-xs font-black bg-indigo-50 text-indigo-700 border-2 border-indigo-100 py-3 rounded-2xl hover:bg-indigo-100 transition-all uppercase tracking-widest"
              >
                <span>Browse Quiz Decks</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Locked feedback card */}
          <div className="rounded-3xl border-4 border-orange-200 bg-orange-100 p-6 text-center space-y-2">
            <h4 className="font-sans text-sm font-black text-orange-850 flex items-center justify-center gap-1.5 uppercase tracking-wider">
              <Star className="h-4 w-4 text-orange-600 fill-orange-500" />
              Keep up the focus, CSE Student!
            </h4>
            <p className="font-sans text-xs text-orange-700 leading-relaxed max-w-xl mx-auto font-semibold">
              Once you master the full syllabus (30 coding problems and 5 complete quiz scores), this portal will instantly unlock a high-fidelity, printable certificate of completion authorized by the Department of CSE.
            </p>
          </div>
        </div>
      ) : (
        /* CASE 2: ELIGIBLE - SHOW HIGH-FIDELITY printable CERTIFICATE */
        <div className="space-y-6" id="certificate-unlocked-screen">
          <div className="space-y-1 print:hidden">
            <h2 className="font-sans text-xl sm:text-2xl font-black tracking-tight text-indigo-900 uppercase">
              Congratulations! Your Certificate is Unlocked 🎉
            </h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mt-1">
              Provide your full name below to personalize your official certificate. You can print or save it as a PDF immediately.
            </p>
          </div>

          {/* Name Input Form */}
          <div className="rounded-3xl border-4 border-indigo-50 bg-white p-6 shadow-md space-y-4 print:hidden">
            <label className="font-sans text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Student Full Name
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                id="student-name-field"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name (e.g., Tahir Ahmed)"
                className="flex-1 rounded-2xl border-2 border-slate-250 px-4 py-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans font-black"
              />
              <button
                onClick={handlePrint}
                id="btn-print-certificate"
                className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-150 transition-all"
              >
                <Printer className="h-4.5 w-4.5" />
                <span>Print Certificate / PDF</span>
              </button>
            </div>
          </div>

          {/* PRINTABLE CERTIFICATE VIEWPORT */}
          <div
            className="relative bg-white border-[14px] border-double border-emerald-900 rounded-lg p-8 sm:p-14 shadow-md max-w-3xl mx-auto text-center space-y-6 overflow-hidden select-text font-serif"
            id="printable-certificate-card"
          >
            {/* Header branding */}
            <div className="space-y-2">
              <h3 className="font-sans text-lg sm:text-2xl font-black text-emerald-950 tracking-wide uppercase">
                HKBK College of Engineering
              </h3>
              <p className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800 border-b border-double border-emerald-950/20 pb-3 max-w-md mx-auto">
                Department of Computer Science and Engineering
              </p>
            </div>

            {/* Certificate Title */}
            <div className="space-y-1.5 pt-4">
              <span className="font-serif italic text-xs sm:text-sm text-gray-500 block">
                This is to certify that
              </span>
              <div className="py-2">
                {studentName ? (
                  <h4 className="font-serif italic text-xl sm:text-3xl font-bold text-emerald-900 underline decoration-emerald-800/25 decoration-wavy underline-offset-8">
                    {studentName}
                  </h4>
                ) : (
                  <span className="font-sans italic text-base sm:text-lg text-gray-400 border-b border-dashed border-gray-300 px-12 py-1 inline-block">
                    [Click input box above to insert your name]
                  </span>
                )}
              </div>
              <span className="font-serif italic text-xs sm:text-sm text-gray-500 block pt-1">
                has successfully completed the comprehensive
              </span>
            </div>

            {/* Core Mastery Statement */}
            <div className="space-y-3">
              <h5 className="font-sans text-base sm:text-xl font-extrabold text-gray-900 tracking-wide uppercase">
                10-Hour Core Java Training Program
              </h5>
              <p className="font-sans text-xs text-gray-600 leading-relaxed max-w-xl mx-auto">
                An intensive curriculum mastering basic conditions, loops, array processing, OOP constructors, inheritance, checked exceptions, and collection structures, validated through interactive tests.
              </p>
            </div>

            {/* Verification Seal */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl mx-auto">
              <div className="text-center sm:text-left font-sans space-y-1">
                <span className="text-[10px] text-gray-400 block font-mono">VERIFIED CODE METRIC:</span>
                <span className="text-xs font-bold text-emerald-900 block flex items-center gap-1 justify-center sm:justify-start">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  30/30 LAB EXERCISES SOLVED
                </span>
                <span className="text-xs font-bold text-emerald-900 block flex items-center gap-1 justify-center sm:justify-start">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  5/5 TEST DECKS COMPLETED
                </span>
              </div>

              {/* Authority Stamps */}
              <div className="border-t border-emerald-900/40 pt-2 px-6 text-center font-sans space-y-0.5">
                <span className="text-xs font-bold text-emerald-950 block">Head of Department, CSE</span>
                <span className="text-[10px] text-emerald-800 block uppercase tracking-widest font-semibold">
                  HKBK CSE Board of Excellence
                </span>
              </div>
            </div>

            {/* Certificate border decoration corner icons */}
            <div className="absolute top-2 left-2 text-emerald-800">
              <Award className="h-6 w-6" />
            </div>
            <div className="absolute top-2 right-2 text-emerald-800">
              <Award className="h-6 w-6" />
            </div>
            <div className="absolute bottom-2 left-2 text-emerald-800">
              <Award className="h-6 w-6" />
            </div>
            <div className="absolute bottom-2 right-2 text-emerald-800">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
