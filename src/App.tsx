/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import SessionView from "./components/SessionView";
import QuizDeck from "./components/QuizDeck";
import Certificate from "./components/Certificate";
import StudentOnboarding from "./components/StudentOnboarding";
import FacultyConsole from "./components/FacultyConsole";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [selectedSessionNum, setSelectedSessionNum] = useState<number>(1);

  // Student details state
  const [studentName, setStudentName] = useState<string | null>(() => {
    try {
      return localStorage.getItem("hkbk_student_name");
    } catch {
      return null;
    }
  });

  const [studentUsn, setStudentUsn] = useState<string | null>(() => {
    try {
      return localStorage.getItem("hkbk_student_usn");
    } catch {
      return null;
    }
  });

  // Load offline progress states from localStorage
  const [completedProblems, setCompletedProblems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("hkbk_java_completed_problems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("hkbk_java_completed_quizzes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userCodes, setUserCodes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("hkbk_java_user_codes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("hkbk_java_streak");
      return saved ? parseInt(saved) || 1 : 1;
    } catch {
      return 1;
    }
  });

  // Save states to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("hkbk_java_completed_problems", JSON.stringify(completedProblems));
    } catch {}
  }, [completedProblems]);

  useEffect(() => {
    try {
      localStorage.setItem("hkbk_java_completed_quizzes", JSON.stringify(completedQuizzes));
    } catch {}
  }, [completedQuizzes]);

  useEffect(() => {
    try {
      localStorage.setItem("hkbk_java_user_codes", JSON.stringify(userCodes));
    } catch {}
  }, [userCodes]);

  const saveUserCode = (problemId: string, code: string) => {
    setUserCodes((prev) => {
      const updated = { ...prev, [problemId]: code };
      return updated;
    });
  };

  // Sync progress to the server-side Excel sheet automatically
  useEffect(() => {
    if (!studentUsn || !studentName) return;

    const syncProgress = async () => {
      try {
        const response = await fetch("/api/students/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usn: studentUsn,
            name: studentName,
            streak,
            completedProblems,
            completedQuizzes,
            userCodes,
            certificateEarned: completedProblems.length === 30 && Object.keys(completedQuizzes).length === 10
          }),
        });
        if (!response.ok) {
          console.error("Local server sync failed.");
        }
      } catch (err) {
        console.error("Network error syncing progress to local server:", err);
      }
    };

    // Debounce to prevent rapid, successive writes to the Excel file
    const timer = setTimeout(syncProgress, 600);
    return () => clearTimeout(timer);
  }, [completedProblems, completedQuizzes, streak, studentUsn, studentName, userCodes]);

  // Handle study streak update on load
  useEffect(() => {
    try {
      const lastStudyStr = localStorage.getItem("hkbk_java_last_study_date");
      const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      if (lastStudyStr) {
        if (lastStudyStr !== todayStr) {
          const lastDate = new Date(lastStudyStr);
          const todayDate = new Date(todayStr);
          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Consecutive day, increment streak
            const newStreak = streak + 1;
            setStreak(newStreak);
            localStorage.setItem("hkbk_java_streak", String(newStreak));
          } else if (diffDays > 1) {
            // Streak broken, reset to 1
            setStreak(1);
            localStorage.setItem("hkbk_java_streak", "1");
          }
          localStorage.setItem("hkbk_java_last_study_date", todayStr);
        }
      } else {
        localStorage.setItem("hkbk_java_last_study_date", todayStr);
        localStorage.setItem("hkbk_java_streak", "1");
      }
    } catch (e) {
      console.error("Error setting study streak", e);
    }
  }, []);

  // Completion toggles
  const toggleProblemCompleted = (id: string) => {
    setCompletedProblems((prev) => {
      const exists = prev.includes(id);
      let updated;
      if (exists) {
        updated = prev.filter((x) => x !== id);
      } else {
        updated = [...prev, id];
        // Instantly register study date for streak tracking on solve
        try {
          const todayStr = new Date().toISOString().split("T")[0];
          localStorage.setItem("hkbk_java_last_study_date", todayStr);
        } catch {}
      }
      return updated;
    });
  };

  const handleCompleteQuiz = (sessionNum: number, score: number) => {
    setCompletedQuizzes((prev) => {
      const updated = { ...prev, [String(sessionNum)]: score };
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        localStorage.setItem("hkbk_java_last_study_date", todayStr);
      } catch {}
      return updated;
    });
  };

  const handleLoginSuccess = (data: {
    usn: string;
    name: string;
    streak: number;
    completedProblems: string[];
    completedQuizzes: Record<string, number>;
    userCodes?: Record<string, string>;
  }) => {
    setStudentName(data.name);
    setStudentUsn(data.usn);
    setStreak(data.streak);
    setCompletedProblems(data.completedProblems);
    setCompletedQuizzes(data.completedQuizzes);
    const codes = data.userCodes || {};
    setUserCodes(codes);

    try {
      localStorage.setItem("hkbk_student_name", data.name);
      localStorage.setItem("hkbk_student_usn", data.usn);
      localStorage.setItem("hkbk_java_completed_problems", JSON.stringify(data.completedProblems));
      localStorage.setItem("hkbk_java_completed_quizzes", JSON.stringify(data.completedQuizzes));
      localStorage.setItem("hkbk_java_user_codes", JSON.stringify(codes));
      localStorage.setItem("hkbk_java_streak", String(data.streak));
    } catch {}
  };

  const handleLogout = () => {
    setStudentName(null);
    setStudentUsn(null);
    setCompletedProblems([]);
    setCompletedQuizzes({});
    setUserCodes({});
    setStreak(1);

    try {
      localStorage.removeItem("hkbk_student_name");
      localStorage.removeItem("hkbk_student_usn");
      localStorage.removeItem("hkbk_java_completed_problems");
      localStorage.removeItem("hkbk_java_completed_quizzes");
      localStorage.removeItem("hkbk_java_user_codes");
      localStorage.removeItem("hkbk_java_streak");
      localStorage.removeItem("hkbk_java_last_study_date");
    } catch {}
    setCurrentTab("dashboard");
  };

  // If student isn't authenticated yet, show onboarding/identification gate
  if (!studentUsn || !studentName) {
    return <StudentOnboarding onLoginSuccess={handleLoginSuccess} />;
  }

  const totalProblemsCount = 30;
  const overallProgressPercent = Math.round(
    ((completedProblems.length + Object.keys(completedQuizzes).length) / (totalProblemsCount + 10)) * 100
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-gray-800 antialiased selection:bg-emerald-100 selection:text-emerald-950" id="main-root-container">
      {/* Dynamic Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        overallProgress={overallProgressPercent}
        streak={streak}
        studentName={studentName}
        studentUsn={studentUsn}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 overflow-y-auto">
        {currentTab === "dashboard" && (
          <Dashboard
            completedProblems={completedProblems}
            completedQuizzes={completedQuizzes}
            setCurrentTab={setCurrentTab}
            setSelectedSessionNum={setSelectedSessionNum}
            streak={streak}
          />
        )}

        {currentTab === "syllabus" && (
          <SessionView
            selectedSessionNum={selectedSessionNum}
            setSelectedSessionNum={setSelectedSessionNum}
            completedProblems={completedProblems}
            toggleCompleted={toggleProblemCompleted}
            userCodes={userCodes}
            saveUserCode={saveUserCode}
          />
        )}

        {currentTab === "quizDeck" && (
          <QuizDeck
            completedQuizzes={completedQuizzes}
            onCompleteQuiz={handleCompleteQuiz}
          />
        )}

        {currentTab === "certificate" && (
          <Certificate
            completedProblems={completedProblems}
            completedQuizzes={completedQuizzes}
            setCurrentTab={setCurrentTab}
            studentName={studentName || ""}
            studentUsn={studentUsn || ""}
          />
        )}

        {currentTab === "faculty" && (
          <FacultyConsole />
        )}
      </main>

      {/* Corporate/Departmental footer */}
      <footer className="w-full border-t border-gray-150 bg-white py-4 text-center print:hidden" id="app-footer-bar">
        <p className="font-sans text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
          Department of CSE • HKBK College of Engineering
        </p>
        <p className="font-sans text-[9px] text-gray-400 mt-0.5">
          © {new Date().getFullYear()} Bangalore. Handcrafted for Real-World Java Lab Training.
        </p>
      </footer>
    </div>
  );
}
