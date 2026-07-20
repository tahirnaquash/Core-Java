/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Trophy, Award, CheckCircle, Code, ShieldCheck, Printer, ArrowRight, Star, Download } from "lucide-react";

interface CertificateProps {
  completedProblems: string[];
  completedQuizzes: Record<string, number>;
  setCurrentTab: (tab: string) => void;
  studentName: string;
  studentUsn: string;
}

export default function Certificate({
  completedProblems,
  completedQuizzes,
  setCurrentTab,
  studentName: defaultStudentName,
  studentUsn,
}: CertificateProps) {
  const [studentName, setStudentName] = useState(defaultStudentName || "");
  const totalProblemsCount = 30;
  const solvedCount = completedProblems.length;
  
  const totalQuizzesCount = 5;
  const quizzesCount = Object.keys(completedQuizzes).length;

  const isEligible = solvedCount >= totalProblemsCount && quizzesCount >= totalQuizzesCount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Draw solid parchment background
    ctx.fillStyle = "#FAF9F6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Double Border
    // Outer emerald green border
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#064e3b"; // emerald-950
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Thin gold inner accent border
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#d97706"; // amber-600 / gold
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Fine inner emerald green border
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#047857"; // emerald-700
    ctx.strokeRect(62, 62, canvas.width - 124, canvas.height - 124);

    // Draw Corner Ornaments (Classic certificate flourishes)
    const drawCornerOrnament = (cx: number, cy: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#d97706"; // amber-600 / gold
      
      // Draw outer circle
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();

      // Draw inner star/lines
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(20, 0);
        ctx.stroke();
      }
      ctx.restore();
    };

    drawCornerOrnament(85, 85);
    drawCornerOrnament(canvas.width - 85, 85);
    drawCornerOrnament(85, canvas.height - 85);
    drawCornerOrnament(canvas.width - 85, canvas.height - 85);

    // 3. Header Text - Institution Name
    ctx.textAlign = "center";
    ctx.fillStyle = "#064e3b"; // emerald-950
    ctx.font = "bold 44px Georgia, serif";
    ctx.fillText("HKBK COLLEGE OF ENGINEERING", canvas.width / 2, 170);

    // Department Subtitle
    ctx.fillStyle = "#047857"; // emerald-700
    ctx.font = "bold 20px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING", canvas.width / 2, 220);

    // Double rule line under department
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(6, 78, 59, 0.2)";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 250, 240);
    ctx.lineTo(canvas.width / 2 + 250, 240);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 250, 245);
    ctx.lineTo(canvas.width / 2 + 250, 245);
    ctx.stroke();

    // 4. "This is to certify that"
    ctx.fillStyle = "#6b7280"; // gray-500
    ctx.font = "italic 26px Georgia, serif";
    ctx.fillText("This is to certify that", canvas.width / 2, 330);

    // 5. Student Name (Large elegant cursive/serif)
    ctx.fillStyle = "#064e3b"; // emerald-950
    ctx.font = "italic bold 54px Georgia, serif";
    ctx.fillText(studentName || "[Student Name]", canvas.width / 2, 420);

    // Decorative wavy underline for student name
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(4, 120, 87, 0.35)"; // emerald-700 opacity
    ctx.beginPath();
    const startX = canvas.width / 2 - 220;
    const endX = canvas.width / 2 + 220;
    const y = 450;
    ctx.moveTo(startX, y);
    for (let x = startX; x <= endX; x += 10) {
      const dy = Math.sin(x * 0.05) * 5;
      ctx.lineTo(x, y + dy);
    }
    ctx.stroke();

    // 6. USN Detail
    ctx.fillStyle = "#4b5563"; // gray-650
    ctx.font = "bold 22px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText(`BEARING USN: ${studentUsn ? studentUsn.toUpperCase() : "N/A"}`, canvas.width / 2, 510);

    // "has successfully completed the comprehensive"
    ctx.fillStyle = "#6b7280"; // gray-500
    ctx.font = "italic 24px Georgia, serif";
    ctx.fillText("has successfully completed the comprehensive", canvas.width / 2, 580);

    // 7. Course Title
    ctx.fillStyle = "#1e293b"; // slate-800
    ctx.font = "bold 38px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("10-HOUR CORE JAVA TRAINING PROGRAM", canvas.width / 2, 650);

    // 8. Course Description Text (Wrapped nicely)
    ctx.fillStyle = "#4b5563"; // gray-600
    ctx.font = "18px 'Helvetica Neue', Arial, sans-serif";
    const description = "An intensive curriculum mastering basic conditions, loops, array processing, OOP constructors, inheritance, checked exceptions, and collection structures, validated through interactive tests.";
    
    // Simple text wrapping helper
    const words = description.split(" ");
    let line = "";
    const maxWidth = 950;
    const lineHeight = 30;
    let descY = 710;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, descY);
        line = words[n] + " ";
        descY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, descY);

    // 9. Verification seal info (Bottom-Left)
    ctx.textAlign = "left";
    ctx.fillStyle = "#9ca3af"; // gray-400
    ctx.font = "bold 14px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("VERIFIED CODE METRIC:", 140, 920);

    ctx.fillStyle = "#064e3b"; // emerald-950
    ctx.font = "bold 17px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("✓  30/30 LAB EXERCISES SOLVED", 140, 955);
    ctx.fillText("✓  5/5 TEST DECKS COMPLETED", 140, 985);

    // 10. Seal Circle ornament (Middle bottom-ish)
    ctx.save();
    ctx.translate(canvas.width / 2, 950);
    ctx.fillStyle = "#fef3c7"; // amber-100/gold bg
    ctx.strokeStyle = "#d97706"; // amber-600 / gold stroke
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Inner circular dotted ring
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    // Star or seal text inside
    ctx.fillStyle = "#b45309"; // amber-700
    ctx.font = "bold 13px 'Helvetica Neue', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("HKBK", 0, -8);
    ctx.fillText("CSE", 0, 10);
    ctx.fillText("SEAL", 0, 26);
    ctx.restore();

    // 11. Signature line and stamp (Bottom-Right)
    ctx.textAlign = "center";
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#064e3b";
    ctx.beginPath();
    ctx.moveTo(canvas.width - 380, 935);
    ctx.lineTo(canvas.width - 120, 935);
    ctx.stroke();

    // Elegant signature text/font-drawing
    ctx.fillStyle = "#1d4ed8"; // classic blue ink color for signature
    ctx.font = "italic bold 28px Georgia, serif";
    ctx.fillText("Dr. Tahir Ahmed", canvas.width - 250, 915);

    ctx.fillStyle = "#064e3b"; // emerald-950
    ctx.font = "bold 16px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("Head of Department, CSE", canvas.width - 250, 960);

    ctx.fillStyle = "#047857"; // emerald-700
    ctx.font = "bold 12px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("HKBK CSE BOARD OF EXCELLENCE", canvas.width - 250, 985);

    // Save and download the image
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      const cleanName = (studentName || "Student").replace(/[^a-zA-Z0-9]/g, "_");
      a.download = `HKBK_Java_Certificate_${studentUsn ? studentUsn.toUpperCase() : "USN"}_${cleanName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to generate downloadable image", err);
    }
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
                className="w-full flex items-center justify-center gap-1.5 text-xs font-black bg-indigo-50 text-indigo-700 border-2 border-indigo-100 py-3 rounded-2xl hover:bg-indigo-100 transition-all uppercase tracking-widest cursor-pointer"
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
                className="w-full flex items-center justify-center gap-1.5 text-xs font-black bg-indigo-50 text-indigo-700 border-2 border-indigo-100 py-3 rounded-2xl hover:bg-indigo-100 transition-all uppercase tracking-widest cursor-pointer"
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
            <h2 className="font-sans text-xl sm:text-2xl font-black tracking-tight text-emerald-900 uppercase">
              Congratulations! Your Certificate is Unlocked 🎉
            </h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mt-1">
              Your certificate has been automatically generated below. You can customize the name or download your high-resolution copy instantly.
            </p>
          </div>

          {/* Name Input Form & Download Actions */}
          <div className="rounded-3xl border-4 border-indigo-50 bg-white p-6 shadow-md space-y-4 print:hidden">
            <label className="font-sans text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Confirm Student Name for Certificate
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                id="student-name-field"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name (e.g., Tahir Ahmed)"
                className="flex-1 rounded-2xl border-2 border-slate-250 px-4 py-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans font-black"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadImage}
                  id="btn-download-certificate"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-150 transition-all cursor-pointer active:scale-95"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>Download Image (PNG)</span>
                </button>
                <button
                  onClick={handlePrint}
                  id="btn-print-certificate"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-150 transition-all cursor-pointer active:scale-95"
                >
                  <Printer className="h-4.5 w-4.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
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
              
              {/* Dynamic USN Display */}
              <p className="font-sans text-[11px] sm:text-xs font-black tracking-widest text-slate-500 uppercase mt-2">
                Bearing University USN: <span className="font-mono text-indigo-950 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-xs font-bold">{studentUsn ? studentUsn.toUpperCase() : "N/A"}</span>
              </p>

              <span className="font-serif italic text-xs sm:text-sm text-gray-500 block pt-1.5">
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
