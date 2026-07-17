/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { JAVA_SESSIONS, JavaProblem } from "../javaData";
import CodingWorkspace from "./CodingWorkspace";
import { BookOpen, CheckCircle, ChevronRight, HelpCircle, FolderOpen, Award, ArrowLeft, Lightbulb, Clock } from "lucide-react";

interface SessionViewProps {
  selectedSessionNum: number;
  setSelectedSessionNum: (num: number) => void;
  completedProblems: string[];
  toggleCompleted: (id: string) => void;
}

export default function SessionView({
  selectedSessionNum,
  setSelectedSessionNum,
  completedProblems,
  toggleCompleted,
}: SessionViewProps) {
  const currentSession = JAVA_SESSIONS.find((s) => s.num === selectedSessionNum) || JAVA_SESSIONS[0];
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "problem">("list");

  // Reset active problem when session changes
  useEffect(() => {
    if (currentSession.problems.length > 0) {
      setActiveProblemId(currentSession.problems[0].id);
    }
  }, [selectedSessionNum]);

  const activeProblem = currentSession.problems.find((p) => p.id === activeProblemId) || currentSession.problems[0];

  const handleNextProblem = () => {
    // Find current index
    const allProblems = JAVA_SESSIONS.flatMap((s) => s.problems);
    const currIdx = allProblems.findIndex((p) => p.id === activeProblem.id);
    if (currIdx !== -1 && currIdx < allProblems.length - 1) {
      const nextProb = allProblems[currIdx + 1];
      setSelectedSessionNum(nextProb.sessionNum);
      setActiveProblemId(nextProb.id);
    }
  };

  const handlePrevProblem = () => {
    const allProblems = JAVA_SESSIONS.flatMap((s) => s.problems);
    const currIdx = allProblems.findIndex((p) => p.id === activeProblem.id);
    if (currIdx > 0) {
      const prevProb = allProblems[currIdx - 1];
      setSelectedSessionNum(prevProb.sessionNum);
      setActiveProblemId(prevProb.id);
    }
  };

  const selectProblem = (id: string) => {
    setActiveProblemId(id);
    setMobileView("problem");
  };

  const difficultyPills: Record<string, string> = {
    Easy: "text-emerald-700 bg-emerald-50",
    Medium: "text-amber-700 bg-amber-50",
    Hard: "text-rose-700 bg-rose-50",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:h-[calc(100vh-130px)] lg:min-h-[850px] min-h-[600px] flex flex-col" id="session-view-container">
      {/* Session Selection Tab Bar */}
      <div className="flex border-4 border-indigo-50 text-xs sm:text-sm font-bold overflow-x-auto whitespace-nowrap bg-white rounded-3xl shadow-md p-2 gap-2 select-none scrollbar-none" id="session-tabs">
        {JAVA_SESSIONS.map((s) => {
          const isSelected = s.num === selectedSessionNum;
          const completedCount = s.problems.filter((p) => completedProblems.includes(p.id)).length;
          return (
            <button
              key={s.num}
              onClick={() => {
                setSelectedSessionNum(s.num);
                setMobileView("list");
              }}
              id={`session-tab-btn-${s.num}`}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-all border-2 uppercase tracking-wider text-xs font-black ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                  : "text-indigo-900 bg-indigo-50/60 border-indigo-100/50 hover:bg-indigo-100/80 hover:border-indigo-200"
              }`}
            >
              <span className={`font-mono text-xs px-2 py-0.5 rounded-lg ${isSelected ? "bg-indigo-700 text-indigo-100" : "bg-white text-indigo-700 border border-indigo-200"}`}>
                M0{s.num}
              </span>
              <span className="font-sans">{s.title.split(" – ")[0].split(" - ")[0]}</span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${isSelected ? "bg-indigo-800 text-indigo-200" : "bg-indigo-100 text-indigo-800"}`}>
                {completedCount}/6
              </span>
            </button>
          );
        })}
      </div>

      {/* Main split grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 overflow-hidden" id="workspace-layout">
        {/* Left Side Menu List (Syllabus summary & problems list) */}
        <div className={`lg:col-span-1 flex flex-col space-y-4 overflow-y-auto pr-1 ${mobileView === "problem" ? "hidden lg:flex" : "flex"}`} id="left-sidebar-menu">
          {/* Selected Session Info Card */}
          <div className="rounded-3xl border-4 border-indigo-50 bg-white p-5 shadow-lg space-y-3 shrink-0">
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-black text-rose-600 tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-150 uppercase inline-block">
                {currentSession.domain}
              </span>
              <h4 className="font-sans text-base font-black text-slate-800 leading-snug">
                {currentSession.title}
              </h4>
            </div>

            {/* Pill badges */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
              {currentSession.topics.map((topic, i) => (
                <span key={i} className="font-sans text-[10px] text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-full border-2 border-indigo-100/40 font-bold uppercase">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* List of 6 Session Problems */}
          <div className="flex-1 flex flex-col space-y-2.5 overflow-hidden">
            <h5 className="font-sans text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
              Module Challenges (6)
            </h5>
            <div className="space-y-3 flex-1 overflow-y-auto pb-4 pr-1">
              {currentSession.problems.map((prob) => {
                const isActive = activeProblemId === prob.id;
                const isDone = completedProblems.includes(prob.id);
                return (
                  <button
                    key={prob.id}
                    id={`problem-selector-${prob.id}`}
                    onClick={() => selectProblem(prob.id)}
                    className={`w-full text-left flex items-center justify-between p-4 rounded-3xl border-4 transition-all ${
                      isActive
                        ? "bg-indigo-50/50 border-indigo-400 shadow-md"
                        : "bg-white border-slate-100 hover:border-indigo-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle className="h-6 w-6 text-emerald-500 fill-emerald-50 shrink-0" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-slate-200 shrink-0 bg-white" />
                      )}
                      <div>
                        <h6 className={`font-sans text-xs font-black leading-snug line-clamp-2 ${isActive ? "text-indigo-950" : "text-slate-700"}`}>
                          {prob.title}
                        </h6>
                        <span className="font-mono text-[9px] text-slate-400 mt-1 block font-bold uppercase tracking-wider">
                          {prob.concepts[0]} • {prob.concepts[1] || "Core"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`font-sans text-[9px] font-bold px-2 py-0.5 rounded-full border ${difficultyPills[prob.difficulty] || "text-slate-700 bg-slate-50 border-slate-200"}`}>
                        {prob.difficulty}
                      </span>
                      <ChevronRight className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-slate-300"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Coding Workspace */}
        <div className={`lg:col-span-2 h-full flex flex-col overflow-hidden ${mobileView === "list" ? "hidden lg:flex" : "flex"}`} id="right-workspace-area">
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-3">
            <button
              onClick={() => setMobileView("list")}
              id="btn-mobile-back"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border-2 border-indigo-100 px-3 py-1.5 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Problem List</span>
            </button>
          </div>

          <CodingWorkspace
            problem={activeProblem}
            isCompleted={completedProblems.includes(activeProblem.id)}
            toggleCompleted={toggleCompleted}
            onNext={handleNextProblem}
            onPrev={handlePrevProblem}
          />
        </div>
      </div>
    </div>
  );
}
