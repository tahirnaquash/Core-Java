import React, { useState, useEffect } from "react";
import { User, GraduationCap, Database, Sparkles, AlertCircle, ArrowRight, Server, ShieldCheck } from "lucide-react";

interface StudentOnboardingProps {
  onLoginSuccess: (data: {
    usn: string;
    name: string;
    streak: number;
    completedProblems: string[];
    completedQuizzes: Record<string, number>;
  }) => void;
}

export default function StudentOnboarding({ onLoginSuccess }: StudentOnboardingProps) {
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");

  // Check connection to local express server
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch("/api/admin/students");
        if (res.ok) {
          setServerStatus("online");
        } else {
          setServerStatus("offline");
        }
      } catch (e) {
        setServerStatus("offline");
      }
    };
    checkServer();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedUsn = usn.trim().toUpperCase();

    if (!trimmedName) {
      setError("Please enter your full name as registered in college records.");
      return;
    }
    if (!trimmedUsn) {
      setError("Please enter your VTU University Seat Number (USN).");
      return;
    }

    // Basic VTU USN validation (e.g. 1HK22CS001, etc. - typically 10 characters)
    if (trimmedUsn.length < 5) {
      setError("Please enter a valid VTU USN (e.g., 1HK22CS045).");
      return;
    }

    setIsLoading(true);

    try {
      // Connect to server
      const response = await fetch("/api/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usn: trimmedUsn, name: trimmedName }),
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess({
          usn: data.usn,
          name: data.name,
          streak: data.streak,
          completedProblems: data.completedProblems || [],
          completedQuizzes: data.completedQuizzes || {},
        });
      } else {
        const data = await response.json().catch(() => ({ error: "Server authentication failed" }));
        setError(data.error || "Could not register on the local server. Attempting offline fallback...");
        
        // Offline backup mode
        setTimeout(() => {
          onLoginSuccess({
            usn: trimmedUsn,
            name: trimmedName,
            streak: 1,
            completedProblems: [],
            completedQuizzes: {},
          });
        }, 1200);
      }
    } catch (err) {
      console.error("Local server connection failed, using browser offline database", err);
      setError("Local server is currently busy. Initializing local workspace session anyway...");
      
      // Fallback to local storage
      setTimeout(() => {
        onLoginSuccess({
          usn: trimmedUsn,
          name: trimmedName,
          streak: 1,
          completedProblems: [],
          completedQuizzes: {},
        });
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-6 select-none relative overflow-hidden" id="onboarding-root">
      {/* Decorative vector background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_40%)] pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md border border-indigo-400">
            <span className="font-sans text-lg font-black text-white">H</span>
          </div>
          <div>
            <h2 className="font-sans text-[11px] font-black tracking-widest text-indigo-400 uppercase leading-none">
              HKBK College of Engineering
            </h2>
            <p className="font-sans text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
              Bengaluru
            </p>
          </div>
        </div>

        {/* Server status indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700">
          <Database className={`h-3 w-3 ${serverStatus === "online" ? "text-emerald-400 animate-pulse" : serverStatus === "checking" ? "text-amber-400 animate-spin" : "text-rose-400"}`} />
          <span className="font-mono text-[9px] font-black tracking-wider uppercase text-slate-300">
            {serverStatus === "online" ? "Server: Sync Active" : serverStatus === "checking" ? "Verifying Host..." : "Server: Offline Mode"}
          </span>
        </div>
      </div>

      {/* Middle Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-10 z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="font-sans text-[9px] font-black tracking-widest uppercase">
              Secure Laboratory Session Gate
            </span>
          </div>
          <h1 className="font-sans text-2xl font-black text-white tracking-tight uppercase">
            Core Java Lab Trainer
          </h1>
          <p className="font-sans text-xs text-slate-400 leading-relaxed font-medium">
            Department of Computer Science & Engineering. Enter your name and VTU University Seat Number to load or start your session records.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-800/80 border-2 border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-5" id="form-onboarding-student">
            
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Student Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Tahir Ahmed"
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 font-sans font-bold focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* USN Input */}
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                University Seat Number (VTU USN)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  placeholder="e.g., 1HK22CS045"
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 font-mono font-black tracking-widest uppercase focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-rose-200 font-semibold leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            {/* Action Trigger Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-900/30 active:translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              id="btn-login-submit"
            >
              {isLoading ? (
                <>
                  <Server className="h-4 w-4 animate-spin text-indigo-300" />
                  <span>Configuring Lab Environment...</span>
                </>
              ) : (
                <>
                  <span>Enter Training Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Informative notice */}
        <div className="mt-6 flex items-center gap-2 justify-center">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            All labs sync automatically to 'student_progress.xlsx' on server
          </span>
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-slate-800/80 pt-4 text-center z-10">
        <p className="font-sans text-[10px] text-slate-500 uppercase tracking-widest font-black">
          Department of Computer Science & Engineering • HKBKCE
        </p>
        <p className="font-sans text-[8px] text-slate-600 mt-0.5">
          Vite Embedded Node Sandbox • Bengaluru • Powered by CSE Faculty Hub
        </p>
      </div>
    </div>
  );
}
