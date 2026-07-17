/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookOpen, Trophy, Award, Flame, Menu, X, CheckCircle2, Shield, LogOut } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  overallProgress: number;
  streak: number;
  studentName?: string;
  studentUsn?: string;
  onLogout?: () => void;
}

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  overallProgress, 
  streak,
  studentName,
  studentUsn,
  onLogout
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Trophy },
    { id: "syllabus", label: "Sessions", icon: BookOpen },
    { id: "quizDeck", label: "Quiz Deck", icon: CheckCircle2 },
    { id: "certificate", label: "Certificate", icon: Award },
    { id: "faculty", label: "Faculty Portal", icon: Shield },
  ];

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "?";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-indigo-600 text-white shadow-lg shrink-0 print:hidden" id="app-header">
      <div className="mx-auto max-w-none w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-xl text-white">
                J
              </div>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight uppercase leading-none">
                HKBK College of Engineering
              </h1>
              <p className="text-indigo-200 text-[10px] sm:text-xs font-semibold tracking-widest uppercase mt-1">
                Department of CSE | Java Mastery Pro
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-2 ${
                    isActive
                      ? "bg-white text-indigo-900 border-white shadow-md"
                      : "text-indigo-100 border-transparent hover:bg-indigo-500 hover:text-white"
                  }`}
                >
                  <IconComponent className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-indigo-200"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Indicators & User Block */}
          <div className="hidden md:flex items-center gap-6">
            {/* Status Info */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">Current Progress</span>
              <span className="text-lg font-black tracking-tight">{overallProgress}% Complete</span>
            </div>

            {/* Sync Active Badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-indigo-500/50 px-3 py-1 border border-indigo-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-mono text-[9px] font-bold text-emerald-200 uppercase tracking-wider">
                Excel Synced
              </span>
            </div>

            {/* Student Badge and Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-indigo-500/50">
              <div className="flex flex-col items-end text-right">
                <span className="text-xs font-black tracking-tight block max-w-[120px] truncate" title={studentName}>
                  {studentName || "Student"}
                </span>
                <span className="text-[9px] font-mono text-indigo-200 tracking-wider block font-bold uppercase">
                  {studentUsn || "NO USN"}
                </span>
              </div>
              <div 
                title={`${studentName} (${studentUsn})`}
                className="w-9 h-9 bg-emerald-400 text-indigo-950 rounded-full border-2 border-white flex items-center justify-center shadow-inner font-black text-xs uppercase shrink-0"
              >
                {studentName ? getInitials(studentName) : "ST"}
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Switch Student / Sign Out"
                  className="p-1.5 rounded-xl text-indigo-200 hover:text-white hover:bg-indigo-500/60 transition-colors border border-transparent hover:border-indigo-400/30 cursor-pointer"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-3">
            <div className="flex flex-col items-end text-right">
              <span className="text-[9px] font-bold text-indigo-200 uppercase leading-none">Progress</span>
              <span className="text-sm font-black leading-tight">{overallProgress}%</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl p-2 text-indigo-100 hover:bg-indigo-500 hover:text-white border border-indigo-500/40"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t-2 border-indigo-700 bg-indigo-700" id="mobile-nav-dropdown">
          <div className="space-y-1.5 px-4 py-3 pb-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-white text-indigo-900 shadow-md"
                      : "text-indigo-100 hover:bg-indigo-600"
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-indigo-200"}`} />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-indigo-600 mt-2 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-white font-black block truncate max-w-[150px]">{studentName}</span>
                <span className="text-[8px] text-indigo-200 font-mono tracking-wider block font-bold">{studentUsn}</span>
              </div>
              <div className="flex items-center gap-2">
                {onLogout && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-1.5 bg-indigo-800 hover:bg-indigo-950 text-indigo-200 hover:text-white px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase border border-indigo-500/40"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign Out
                  </button>
                )}
                <div className="flex items-center gap-1 bg-indigo-800 px-2 py-1.5 rounded-lg border border-indigo-500/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span className="font-mono text-[8px] font-bold text-emerald-200 uppercase">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
